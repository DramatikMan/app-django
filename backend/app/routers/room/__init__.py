from datetime import datetime
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from .types import Detail, RoomCode, RoomProps, RoomResponse
from ...db.models import Room
from ...db.utils import generate_unique_room_code
from ...dependencies import get_db_session, get_session


router = APIRouter()


@router.post('/')
async def create_room(
    payload: RoomProps,
    session: dict[Any, Any] = Depends(get_session),
    DB: AsyncSession = Depends(get_db_session)
) -> RoomCode:
    stmt = select(Room).where(Room.host == session['identity'])
    result = await DB.execute(stmt)
    room: Optional[Room] = result.scalar_one_or_none()

    if room is None:
        unique_code: str = await generate_unique_room_code(DB)
        room = Room(
            host=session['identity'],
            code=unique_code,
            guest_can_pause=payload.guest_can_pause,
            votes_to_skip=payload.votes_to_skip
        )
        DB.add(room)
    else:
        room.guest_can_pause = payload.guest_can_pause
        room.votes_to_skip = payload.votes_to_skip

    session['room_code'] = room.code
    await DB.commit()

    return RoomCode(roomCode=session['room_code'])


@router.get('/leave')
async def leave_room(
    session: dict[Any, Any] = Depends(get_session),
    DB: AsyncSession = Depends(get_db_session)
) -> Detail:
    if 'room_code' in session:
        session.pop('room_code')
        await DB.execute(delete(Room).where(Room.host == session['identity']))
        await DB.commit()

        return Detail(detail='Left successfully.')

    return Detail(detail='User not in room.')


@router.get('/{room_code}')
async def get_room(
    room_code: str,
    session: dict[Any, Any] = Depends(get_session),
    DB: AsyncSession = Depends(get_db_session)
) -> RoomResponse:
    result = await DB.execute(select(Room).where(Room.code == room_code))
    room: Optional[Room] = result.scalar_one_or_none()

    if room is not None:
        return RoomResponse(
            guestCanPause=room.guest_can_pause,
            votesToSkip=room.votes_to_skip,
            isHost=(room.host == session['identity'])
        )

    raise HTTPException(status_code=404, detail='Room not found.')


@router.patch('/{room_code}')
async def update_room(
    room_code: str,
    payload: RoomProps,
    session: dict[Any, Any] = Depends(get_session),
    DB: AsyncSession = Depends(get_db_session)
) -> RoomResponse:
    result = await DB.execute(select(Room).where(Room.code == room_code))
    room: Optional[Room] = result.scalar_one_or_none()

    if room is None:
        raise HTTPException(status_code=404, detail='Room not found.')

    if room.host != session['identity']:
        raise HTTPException(
            status_code=403,
            detail='A room can only be updated by its host.'
        )

    room.guest_can_pause = payload.guest_can_pause
    room.votes_to_skip = payload.votes_to_skip
    room.updated_at = datetime.now()

    response = RoomResponse(
        guestCanPause=room.guest_can_pause,
        votesToSkip=room.votes_to_skip,
        isHost=(room.host == session['identity'])
    )

    await DB.commit()

    return response


@router.post('/join')
async def join_room(
    payload: RoomCode,
    session: dict[Any, Any] = Depends(get_session),
    DB: AsyncSession = Depends(get_db_session)
) -> Detail:
    if payload.room_code is not None:
        stmt = select(Room).where(Room.code == payload.room_code)
        result = await DB.execute(stmt)
        room: Optional[Room] = result.scalar_one_or_none()

        if room is not None:
            session['room_code'] = payload.room_code

            return Detail(detail='Room joined.')

        raise HTTPException(status_code=404, detail='Room not found.')

    raise HTTPException(
        status_code=400,
        detail='Room code not found in request body.'
    )

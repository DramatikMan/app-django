from datetime import datetime
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from .types import (
    GetRoomRequestData,
    RoomResponseData,
    JoinRoomRequestData
)
from ...db.models import Room
from ...db.utils import generate_unique_room_code
from ...dependencies import get_db_session, get_session


router = APIRouter()


@router.post('/room')
async def create_room(
    request: Request,
    session: dict[Any, Any] = Depends(get_session),
    DB: AsyncSession = Depends(get_db_session)
) -> dict[str, str]:
    data: GetRoomRequestData = await request.json()

    try:
        guest_can_pause: bool = data['guestCanPause']
        votes_to_skip: int = data['votesToSkip']
    except KeyError:
        raise HTTPException(status_code=400, detail='Invalid data.')

    stmt = select(Room).where(Room.host == session['identity'])
    result = await DB.execute(stmt)
    room: Optional[Room] = result.scalar_one_or_none()

    if room is None:
        unique_code: str = await generate_unique_room_code(DB)
        room = Room(
            host=session['identity'],
            code=unique_code,
            guest_can_pause=guest_can_pause,
            votes_to_skip=votes_to_skip
        )
        DB.add(room)
    else:
        room.guest_can_pause = guest_can_pause
        room.votes_to_skip = votes_to_skip

    session['room_code'] = room.code
    await DB.commit()

    return {'code': session['room_code']}


@router.get('/room/leave')
async def leave_room(
    session: dict[Any, Any] = Depends(get_session),
    DB: AsyncSession = Depends(get_db_session)
) -> dict[str, str]:
    if 'room_code' in session:
        session.pop('room_code')
        await DB.execute(delete(Room).where(Room.host == session['identity']))
        await DB.commit()

        return {'detail': 'Left successfully.'}

    return {'detail': 'User not in room.'}


@router.get('/room/{room_code}')
async def get_room(
    room_code: str,
    session: dict[Any, Any] = Depends(get_session),
    DB: AsyncSession = Depends(get_db_session)
) -> RoomResponseData:
    result = await DB.execute(select(Room).where(Room.code == room_code))
    room: Optional[Room] = result.scalar_one_or_none()

    if room is not None:
        return RoomResponseData(
            guestCanPause=room.guest_can_pause,
            votesToSkip=room.votes_to_skip,
            isHost=(room.host == session['identity'])
        )

    raise HTTPException(status_code=404, detail='Room not found.')


@router.patch('/room/{room_code}')
async def update_room(
    request: Request,
    room_code: str,
    session: dict[Any, Any] = Depends(get_session),
    DB: AsyncSession = Depends(get_db_session)
) -> RoomResponseData:
    data: GetRoomRequestData = await request.json()

    try:
        guest_can_pause: bool = data['guestCanPause']
        votes_to_skip: int = data['votesToSkip']
    except KeyError:
        raise HTTPException(status_code=400, detail='Invalid data.')

    result = await DB.execute(select(Room).where(Room.code == room_code))
    room: Optional[Room] = result.scalar_one_or_none()

    if room is None:
        raise HTTPException(status_code=404, detail='Room not found.')

    if room.host != session['identity']:
        raise HTTPException(status_code=403, detail='You are not the host.')

    room.guest_can_pause = guest_can_pause
    room.votes_to_skip = votes_to_skip
    room.updated_at = datetime.now()

    response = RoomResponseData(
        guestCanPause=room.guest_can_pause,
        votesToSkip=room.votes_to_skip,
        isHost=(room.host == session['identity'])
    )

    await DB.commit()

    return response


@router.post('/room/join')
async def join_room(
    request: Request,
    DB: AsyncSession = Depends(get_db_session)
) -> dict[str, str]:
    data: JoinRoomRequestData = await request.json()
    room_code: Optional[str] = data.get('roomCode')

    if room_code:
        stmt = select(Room).where(Room.code == room_code)
        result = await DB.execute(stmt)
        room: Optional[Room] = result.scalar_one_or_none()

        if room is not None:
            request.session['room_code'] = room_code

            return {'detail': 'Room joined.'}

        raise HTTPException(status_code=404, detail='Room not found.')

    raise HTTPException(
        status_code=400,
        detail='Room code not found in request body.'
    )


@router.get('/user-in-room')
async def check_room_code(request: Request) -> dict[str, Optional[str]]:
    room_code: Optional[str] = request.session.get('room_code')
    return {'room_code': room_code}

from datetime import datetime
from typing import Optional, TypedDict

from fastapi import APIRouter, Request, HTTPException
from sqlalchemy.orm.query import Query

from ..db.config import Session
from ..db.models import Room


router = APIRouter(prefix='/api')


class GetRoomData(TypedDict):
    guestCanPause: bool
    votesToSkip: int


class RoomResponseData(TypedDict):
    guestCanPause: bool
    votesToSkip: int
    isHost: bool


class JoinRoomData(TypedDict):
    roomCode: Optional[str]


@router.get('/session')
async def get_session(request: Request) -> dict[str, str]:
    return {
        'identity': request.session.get('identity', ''),
        'room_code': request.session.get('room_code', '')
    }


@router.post('/room')
async def create_room(request: Request) -> dict[str, str]:
    data: GetRoomData = await request.json()
    guest_can_pause: bool = data['guestCanPause']
    votes_to_skip: int = data['votesToSkip']

    host: str = request.session['identity']

    with Session() as session:
        room: Room = session.merge(Room(
            host=host,
            guest_can_pause=guest_can_pause,
            votes_to_skip=votes_to_skip,
            updated_at=datetime.now()
        ))
        session.commit()
        code: str = room.code

    request.session['room_code'] = code

    return {'code': code}


@router.get('/room/leave')
async def leave_room(request: Request) -> dict[str, str]:
    if 'room_code' in request.session:
        request.session.pop('room_code')
        host: str = request.session['identity']

        with Session() as session:
            q: Query = session.query(Room).filter(Room.host == host)

            if q.one_or_none() is not None:
                q.delete()

            session.commit()

    return {'detail': 'Left successfully.'}


@router.get('/room/{room_code}')
async def get_room(request: Request, room_code: str) -> RoomResponseData:
    with Session() as session:
        q: Query = session.query(Room).filter(Room.code == room_code)
        room: Optional[Room] = q.one_or_none()

        if room is not None:
            return {
                'guestCanPause': room.guest_can_pause,
                'votesToSkip': room.votes_to_skip,
                'isHost': room.host == request.session['identity']
            }

    raise HTTPException(status_code=404, detail='Room not found.')


@router.patch('/room/{room_code}')
async def update_room(request: Request, room_code: str) -> RoomResponseData:
    with Session() as session:
        q: Query = session.query(Room).filter(Room.code == room_code)
        room: Optional[Room] = q.one_or_none()

        if room is None:
            raise HTTPException(status_code=404, detail='Room not found.')

        if room.host != request.session['identity']:
            raise HTTPException(
                status_code=403,
                detail='You are not the host.'
            )

        data: GetRoomData = await request.json()
        q.update({
            Room.guest_can_pause: data['guestCanPause'],
            Room.votes_to_skip: data['votesToSkip']
        })

        session.commit()

        return {
            'guestCanPause': room.guest_can_pause,
            'votesToSkip': room.votes_to_skip,
            'isHost': room.host == request.session['identity']
        }


@router.post('/room/join')
async def join_room(request: Request) -> dict[str, str]:
    data: JoinRoomData = await request.json()
    code: Optional[str] = data.get('roomCode')

    if code:
        with Session() as session:
            q: Query = session.query(Room).filter(Room.code == code)

            if q.one_or_none() is not None:
                request.session['room_code'] = code

                return {'detail': 'Room joined.'}

            raise HTTPException(status_code=404, detail='Room not found.')

    raise HTTPException(
        status_code=400,
        detail='Room code not found in request body.'
    )

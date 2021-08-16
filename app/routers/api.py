from datetime import datetime
from typing import Any, Optional, TypedDict

from fastapi import APIRouter, Request, HTTPException
from sqlalchemy.orm.query import Query

from ..db.config import Session
from ..db.models import Room


router = APIRouter(prefix='/api')


class RoomRequestData(TypedDict):
    guestCanPause: bool
    votesToSkip: int


@router.get('/room')
async def get_rooms(request: Request) -> dict[str, str]:
    return {'status': 'OK'}


@router.post('/room')
async def create_room(request: Request) -> dict[str, str]:
    data: RoomRequestData = await request.json()
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
async def get_room(request: Request, room_code: str) -> Any:
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

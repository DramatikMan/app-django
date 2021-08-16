from datetime import datetime
from typing import TypedDict

from fastapi import APIRouter, Request
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

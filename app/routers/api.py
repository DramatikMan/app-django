from datetime import datetime
from typing import TypedDict

from fastapi import APIRouter, Request

from ..db.config import Session
from ..db.models import Room


router = APIRouter(prefix='/api')


class RoomReqData(TypedDict):
    guestCanPause: bool
    votesToSkip: int


@router.get('/room')
async def get_rooms(request: Request) -> dict[str, str]:
    return {'status': 'OK'}


@router.post('/room')
async def create_room(request: Request) -> dict[str, str]:
    data: RoomReqData = await request.json()
    guest_can_pause: bool = data['guestCanPause']
    votes_to_skip: int = data['votesToSkip']

    host: str = request.session['identity']

    with Session() as db_session:
        room: Room = db_session.merge(Room(
            host=host,
            guest_can_pause=guest_can_pause,
            votes_to_skip=votes_to_skip,
            updated_at=datetime.now()
        ))
        db_session.commit()

        code: str = room.code

    return {'code': code}

from datetime import datetime
from typing import TypedDict

from aiohttp import web
from aiohttp.web_response import Response
from aiohttp_session import get_session, Session

from ..db.models import Room
from ..db.config import Session as DatabaseSession


routes = web.RouteTableDef()


class PostRoomReqData(TypedDict):
    guestCanPause: bool
    votesToSkip: int


@routes.get('/room')
async def get_rooms(request: web.Request) -> Response:
    return web.json_response({'status': 'OK'})


@routes.post('/room')
async def create_room(request: web.Request) -> Response:
    data: PostRoomReqData = await request.json()
    guest_can_pause: bool = data['guestCanPause']
    votes_to_skip: int = data['votesToSkip']

    session: Session = await get_session(request)
    host: str = session.identity

    with DatabaseSession() as db_session:
        room = Room(
            host=host,
            guest_can_pause=guest_can_pause,
            votes_to_skip=votes_to_skip,
            updated_at=datetime.now()
        )

        db_session.add(room)
        db_session.commit()

        code: str = room.code

    return web.json_response({'code': code})


app = web.Application()
app.add_routes(routes)

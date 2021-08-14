from random import choices
from string import ascii_letters, digits
from typing import Any, Awaitable, Callable

from aiohttp.web import middleware, Request
from aiohttp.web_response import Response
from aiohttp_session import Session, get_session


@middleware
async def ensure_identity(
    request: Request,
    handler: Callable[[Request], Awaitable[Any]]
) -> Response:
    session: Session = await get_session(request)

    if 'identity' not in session:
        identity = ''.join(choices(ascii_letters + digits, k=50))
        session.set_new_identity(identity=identity)

    resp: Response = await handler(request)

    return resp

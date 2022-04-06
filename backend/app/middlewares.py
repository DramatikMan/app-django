import random
import string
from typing import Awaitable, Callable

from fastapi import Response, Request


async def ensure_identity(
    request: Request,
    handler: Callable[[Request], Awaitable[Response]]
) -> Response:
    if 'identity' not in request.session:
        request.session['identity'] = ''.join(random.choices(
            string.ascii_letters + string.digits,
            k=50
        ))

    resp: Response = await handler(request)

    return resp

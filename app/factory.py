import os
import base64
from pathlib import Path
from random import choices
from string import ascii_letters, digits
from typing import Callable, Awaitable

from fastapi import FastAPI, Request, Response
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
from cryptography import fernet

from .routers.frontend import router as frontend
from .routers.api import router as api


path_static = Path(os.environ['PWD']) / 'app/frontend/static'

fernet_key: bytes = fernet.Fernet.generate_key()
secret_key: bytes = base64.urlsafe_b64decode(fernet_key)


def create_app() -> FastAPI:
    app = FastAPI()
    app.mount('/static', StaticFiles(directory=path_static), name='static')
    app.include_router(frontend)
    app.include_router(api)

    @app.middleware('http')
    async def ensure_identity(
        request: Request,
        handler: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        if 'identity' not in request.session:
            request.session['identity'] = ''.join(choices(
                ascii_letters + digits,
                k=50
            ))

        resp: Response = await handler(request)

        return resp

    app.add_middleware(SessionMiddleware, secret_key=secret_key)

    return app

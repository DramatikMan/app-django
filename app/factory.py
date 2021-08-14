import base64
import logging
from pathlib import Path

import jinja2
import aiohttp_jinja2
from aiohttp import web
from aiohttp.web_response import Response
from aiohttp_session import Session, setup, get_session
from aiohttp_session.cookie_storage import EncryptedCookieStorage
from cryptography import fernet

from .routers.api import app as api


routes = web.RouteTableDef()
template_path = Path().resolve() / 'app' / 'frontend' / 'templates'
static_path = Path().resolve() / 'app' / 'frontend' / 'static'
loader = jinja2.FileSystemLoader(template_path.resolve())


@routes.get('/')
@aiohttp_jinja2.template('index.html')
async def root(request: web.Request) -> dict[str, str]:
    return {'status': 'OK'}


def create_app() -> web.Application:
    app = web.Application()
    logging.basicConfig(level=logging.DEBUG)

    # aiohttp session
    fernet_key: bytes = fernet.Fernet.generate_key()
    secret_key: bytes = base64.urlsafe_b64decode(fernet_key)
    setup(app, EncryptedCookieStorage(secret_key))

    # routes
    app.add_routes(routes)
    app.add_subapp('/api/', api)
    app.add_routes([web.static('/static', static_path)])

    # markup template loader
    aiohttp_jinja2.setup(app, loader=loader)

    return app

import base64
from pathlib import Path

import jinja2
import aiohttp_jinja2
from aiohttp import web
from aiohttp_session import setup
from aiohttp_session.cookie_storage import EncryptedCookieStorage
from cryptography import fernet

from .routers.frontend import routes
from .routers.api import app as api
from .middlewares import ensure_identity


template_path = Path().resolve() / 'app' / 'frontend' / 'templates'
static_path = Path().resolve() / 'app' / 'frontend' / 'static'
loader = jinja2.FileSystemLoader(template_path.resolve())


def create_app() -> web.Application:
    app = web.Application()

    # aiohttp session
    fernet_key: bytes = fernet.Fernet.generate_key()
    secret_key: bytes = base64.urlsafe_b64decode(fernet_key)
    setup(app, EncryptedCookieStorage(secret_key))
    app.middlewares.append(ensure_identity)

    # routes
    app.add_routes(routes)
    app.add_subapp('/api/', api)
    app.add_routes([web.static('/static', static_path)])

    # markup template loader
    aiohttp_jinja2.setup(app, loader=loader)

    return app

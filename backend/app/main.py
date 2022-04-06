from fastapi import FastAPI
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.sessions import SessionMiddleware

import app.config as config
from .middlewares import ensure_identity
from .routers.api import router as api
from .routers.spotify import router as spotify


app = FastAPI(root_path=config.ROOT_PATH, docs_url=None, redoc_url=None)
app.add_middleware(BaseHTTPMiddleware, dispatch=ensure_identity)
app.add_middleware(SessionMiddleware, secret_key=config.SECRET_KEY)
app.include_router(api)
app.include_router(spotify, prefix='/spotify')

from typing import AsyncGenerator

from fastapi import FastAPI
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.sessions import SessionMiddleware

import app.config as config
from .db.config import Session
from .middlewares import ensure_identity
from .routers.main import router as api
from .routers.spotify import router as spotify
from .utils import lifetime


app = FastAPI(root_path=config.ROOT_PATH, docs_url=None, redoc_url=None)
app.add_middleware(BaseHTTPMiddleware, dispatch=ensure_identity)
app.add_middleware(SessionMiddleware, secret_key=config.SECRET_KEY)


@lifetime(app)
async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with Session() as session:
        yield session


app.state.get_db_session = get_db_session


app.include_router(api)
app.include_router(spotify, prefix='/spotify')

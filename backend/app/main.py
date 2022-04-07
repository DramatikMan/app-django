from typing import Any, AsyncGenerator

from fastapi import Depends, FastAPI
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.sessions import SessionMiddleware

import app.config as config
from .dependencies import get_session
from .db.config import Session
from .middlewares import ensure_identity
from .routers import room, spotify
from .routers.room.types import RoomCode
from .utils import lifetime


app = FastAPI(root_path=config.ROOT_PATH, docs_url=None, redoc_url=None)
app.add_middleware(BaseHTTPMiddleware, dispatch=ensure_identity)
app.add_middleware(SessionMiddleware, secret_key=config.SECRET_KEY)


@lifetime(app)
async def get_client() -> AsyncGenerator[AsyncClient, None]:
    async with AsyncClient() as client:
        yield client


@lifetime(app)
async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with Session() as session:
        yield session


app.state.get_client = get_client
app.state.get_db_session = get_db_session


@app.get('/user-in-room')
async def get_current_room(
    session: dict[Any, Any] = Depends(get_session)
) -> RoomCode:
    return RoomCode(roomCode=session.get('room_code'))


app.include_router(room.router, prefix='/room')
app.include_router(spotify.router, prefix='/spotify')

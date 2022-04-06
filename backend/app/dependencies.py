from typing import Any

from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession


async def get_db_session(request: Request) -> AsyncSession:
    return request.app.state.get_db_session()


async def get_session(request: Request) -> dict[Any, Any]:
    return request.session

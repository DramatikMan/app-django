from typing import Any

from fastapi import Request


async def get_client(request: Request) -> Any:
    return request.app.state.get_client()


async def get_db_session(request: Request) -> Any:
    return request.app.state.get_db_session()


async def get_session(request: Request) -> dict[Any, Any]:
    return request.session

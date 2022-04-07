from datetime import timedelta, datetime
from random import choices
from string import ascii_uppercase, digits
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .models import Room, SpotifyTokens
from ..types import SpotifyAuthResp


async def generate_unique_room_code(session: AsyncSession) -> str:
    while True:
        code = ''.join(choices(ascii_uppercase + digits, k=6))
        result = await session.execute(select(Room).where(Room.code == code))

        if result.scalar_one_or_none() is None:
            break

    return code


async def get_tokens(
    session: AsyncSession,
    identity: str
) -> Optional[SpotifyTokens]:
    stmt = select(SpotifyTokens).where(SpotifyTokens.user == identity)
    result = await session.execute(stmt)
    tokens: Optional[SpotifyTokens] = result.scalar_one_or_none()

    return tokens


async def update_or_create_tokens(
    session: AsyncSession,
    identity: str,
    data: SpotifyAuthResp
) -> None:
    stmt = select(SpotifyTokens).where(SpotifyTokens.user == identity)
    result = await session.execute(stmt)
    tokens: Optional[SpotifyTokens] = result.scalar_one_or_none()

    if tokens is None:
        session.add(SpotifyTokens(
            user=identity,
            access_token=data.access_token,
            token_type=data.token_type,
            refresh_token=data.token_type,
            expiry_dt=datetime.now() + timedelta(seconds=data.expires_in)
        ))
    else:
        tokens.access_token = data.access_token
        tokens.token_type = data.token_type
        tokens.refresh_token = data.refresh_token,
        tokens.expiry_dt = datetime.now() \
            + timedelta(seconds=data.expires_in)

    await session.commit()

from typing import Literal, Optional

import httpx
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from .types import CurrentSongResp
from ...db.utils import get_tokens
from ...db.models import SpotifyTokens


API_URI = 'https://api.spotify.com/v1/me/'


async def spotify_api_request(
    client: httpx.AsyncClient,
    DB: AsyncSession,
    identity: str,
    endpoint: str = '',
    method: Literal['POST'] | Literal['PUT'] | None = None
) -> CurrentSongResp:
    tokens: Optional[SpotifyTokens] = await get_tokens(DB, identity)

    if tokens:
        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + tokens.access_token
        }

        if method == 'POST':
            await client.post(API_URI + endpoint, headers=headers)
        if method == 'PUT':
            await client.put(API_URI + endpoint, headers=headers)

        resp: httpx.Response = await client.get(
            url=API_URI + 'player/currently-playing',
            headers=headers
        )

        try:
            data = CurrentSongResp(**resp.json())
        except Exception as ex:
            raise HTTPException(status_code=400, detail=repr(ex))

        return data

    raise HTTPException(status_code=404, detail='No Spotify token found.')


async def pause_song(
    client: httpx.AsyncClient,
    DB: AsyncSession,
    identity: str
) -> CurrentSongResp:
    return await spotify_api_request(
        client, DB, identity, 'player/pause', 'PUT'
    )


async def play_song(
    client: httpx.AsyncClient,
    DB: AsyncSession,
    identity: str
) -> CurrentSongResp:
    return await spotify_api_request(
        client, DB, identity, 'player/play', 'PUT'
    )


async def skip_song(
    client: httpx.AsyncClient,
    DB: AsyncSession,
    identity: str
) -> CurrentSongResp:
    return await spotify_api_request(
        client, DB, identity, 'player/next', 'POST'
    )

from typing import Literal, Union, Optional

from httpx import AsyncClient, Response
from fastapi import HTTPException

from ..db.utils import get_tokens
from ..db.models import SpotifyTokens
from ..types import CurrentSongResponseData


API_URI = 'https://api.spotify.com/v1/me/'


async def spotify_api_request(
    identity: str,
    endpoint: str = '',
    method: Union[Literal['POST'], Literal['PUT'], None] = None
) -> CurrentSongResponseData:
    tokens: Optional[SpotifyTokens] = get_tokens(identity)

    if tokens:
        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + tokens.access_token
        }

        async with AsyncClient() as client:
            if method == 'POST':
                await client.post(API_URI + endpoint, headers=headers)
            if method == 'PUT':
                await client.put(API_URI + endpoint, headers=headers)

            resp: Response = await client.get(
                url=API_URI + 'player/currently-playing',
                headers=headers
            )

        try:
            data: CurrentSongResponseData = resp.json()
        except Exception as ex:
            raise HTTPException(status_code=400, detail=repr(ex))

        return data

    raise HTTPException(status_code=404, detail='No Spotify token found.')


async def pause_song(identity: str) -> CurrentSongResponseData:
    return await spotify_api_request(identity, 'player/pause', 'PUT')


async def play_song(identity: str) -> CurrentSongResponseData:
    return await spotify_api_request(identity, 'player/play', 'PUT')


async def skip_song(identity: str) -> CurrentSongResponseData:
    return await spotify_api_request(identity, 'player/next', 'POST')

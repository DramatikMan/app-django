from typing import Literal, Union, Optional

from fastapi import HTTPException
from requests import get, post, put, Response

from ..db.utils import get_tokens
from ..db.models import SpotifyTokens
from ..types import CurrentSongResponseData


API_URI = 'https://api.spotify.com/v1/me/'


def spotify_api_request(
    identity: str,
    endpoint: str = None,
    method: Union[Literal['POST'], Literal['PUT'], None] = None
) -> CurrentSongResponseData:
    tokens: Optional[SpotifyTokens] = get_tokens(identity)

    if tokens:
        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + tokens.access_token
        }

        if method == 'POST':
            post(API_URI + endpoint, headers=headers)
        if method == 'PUT':
            put(API_URI + endpoint, headers=headers)

        resp: Response = get(
            url=API_URI + 'player/currently-playing',
            headers=headers
        )

        try:
            data: CurrentSongResponseData = resp.json()
        except Exception as ex:
            raise HTTPException(status_code=400, detail=repr(ex))

        return data

    raise HTTPException(status_code=404, detail='No Spotify token found.')


def pause_song(identity: str) -> CurrentSongResponseData:
    return spotify_api_request(identity, 'player/pause', 'PUT')


def play_song(identity: str) -> CurrentSongResponseData:
    return spotify_api_request(identity, 'player/play', 'PUT')


def skip_song(identity: str) -> CurrentSongResponseData:
    return spotify_api_request(identity, 'player/next', 'POST')

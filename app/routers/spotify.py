import os
from typing import Optional, TypedDict

import requests
from fastapi import APIRouter, Request


router = APIRouter(prefix='/spotify')


TOKEN_URI = 'https://accounts.spotify.com/api/token'
REDIRECT_URI = os.environ['SPOTIFY_REDIRECT_URI']
CLIENT_ID = os.environ['SPOTIFY_CLIENT_ID']
CLIENT_SECRET = os.environ['SPOTIFY_CLIENT_SECRET']
AUTH_URI = 'https://accounts.spotify.com/authorize'


class SpotifyAuthData(TypedDict):
    scope: str
    response_type: str
    redirect_uri: str
    client_id: str


@router.get('/auth-url')
async def get(request: Request) -> dict[str, Optional[str]]:
    scopes = (
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing'
    )

    payload = SpotifyAuthData(
        scope=' '.join(scopes),
        response_type='code',
        redirect_uri=REDIRECT_URI,
        client_id=CLIENT_ID
    )

    req = requests.Request(method='GET', url=AUTH_URI, params=payload)
    url: Optional[str] = req.prepare().url

    return {'url': url}

import os
from datetime import datetime
from typing import Literal, Optional, TypedDict

import requests
from fastapi import APIRouter, Request

from ..db.models import SpotifyTokens
from ..db.utils import get_tokens, update_or_create_tokens


router = APIRouter(prefix='/spotify')


TOKEN_URI = 'https://accounts.spotify.com/api/token'
REDIRECT_URI = os.environ['SPOTIFY_REDIRECT_URI']
CLIENT_ID = os.environ['SPOTIFY_CLIENT_ID']
CLIENT_SECRET = os.environ['SPOTIFY_CLIENT_SECRET']
AUTH_URI = 'https://accounts.spotify.com/authorize'


class SpotifyAuthData(TypedDict):
    scope: str
    response_type: Literal['code']
    redirect_uri: str
    client_id: str


class SpotifyRefreshData(TypedDict):
    grant_type: Literal['refresh_token']
    refresh_token: str
    cliend_id: str
    client_secret: str


@router.get('/auth/url')
async def get_auth_url(request: Request) -> dict[str, Optional[str]]:
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


@router.get('/auth/status')
async def get_auth_status(request: Request) -> dict[str, bool]:
    identity: str = request.session['identity']
    tokens: Optional[SpotifyTokens] = get_tokens(identity)

    if tokens:

        if tokens.expiry_dt <= datetime.now():
            payload = SpotifyRefreshData(
                grant_type='refresh_token',
                refresh_token=tokens.refresh_token,
                cliend_id=CLIENT_ID,
                client_secret=CLIENT_SECRET
            )
            resp: requests.Response = requests.post(
                url=TOKEN_URI,
                data=payload
            )
            update_or_create_tokens(identity, resp.json())

        return {'status': True}

    return {'status': False}

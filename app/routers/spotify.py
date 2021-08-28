import os
from datetime import datetime
from typing import Optional

import requests
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm.query import Query

from ..db.config import Session
from ..db.models import Room, SpotifyTokens, Vote
from ..db.utils import get_tokens, update_or_create_tokens
from ..types import (
    CurrentSongBackendData,
    CurrentSongResponseData,
    SpotifyAuthResponseData,
    SpotifyAuthURLParams,
    SpotifyCallbackRequestData,
    SpotifyRefreshRequestData
)
from .utils import spotify_api_request, pause_song, play_song


router = APIRouter(prefix='/spotify')


TOKEN_URI = 'https://accounts.spotify.com/api/token'
REDIRECT_URI = os.environ['SPOTIFY_REDIRECT_URI']
CLIENT_ID = os.environ['SPOTIFY_CLIENT_ID']
CLIENT_SECRET = os.environ['SPOTIFY_CLIENT_SECRET']
AUTH_URI = 'https://accounts.spotify.com/authorize'


@router.get('/auth/url')
async def get_auth_url(request: Request) -> dict[str, Optional[str]]:
    scopes = (
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing'
    )

    payload = SpotifyAuthURLParams(
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
            payload = SpotifyRefreshRequestData(
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


@router.get('/redirect', response_class=RedirectResponse)
async def get_redirect(request: Request, code: str) -> str:
    payload = SpotifyCallbackRequestData(
        grant_type='authorization_code',
        code=code,
        redirect_uri=REDIRECT_URI,
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET
    )

    resp: requests.Response = requests.post(TOKEN_URI, data=payload)
    resp_data: SpotifyAuthResponseData = resp.json()

    update_or_create_tokens(request.session['identity'], resp_data)

    return '/'


@router.get('/song')
async def get_song(request: Request) -> CurrentSongBackendData:
    room_code: str = request.session['room_code']

    with Session() as session:
        q: Query = session.query(Room).filter(Room.code == room_code)
        room: Optional[Room] = q.one_or_none()

        if room is None:
            raise HTTPException(status_code=404)

        host: str = room.host

        data: CurrentSongResponseData = spotify_api_request(
            identity=host,
            endpoint='player/currently-playing'
        )

        if 'item' not in data:
            raise HTTPException(
                status_code=404,
                detail='No song info available.'
            )

        item = data['item']
        artists = ''

        for i, artist in enumerate(item['artists']):
            if i > 0:
                artists += ', '

            artists += artist['name']

        q = session.query(Vote).filter(Vote.room_code == room.code)
        votes_qty: int = len(q.all())

        song = CurrentSongBackendData(
            title=item['name'],
            artist=artists,
            duration=item['duration_ms'],
            progress=data['progress_ms'],
            image_url=item['album']['images'][0]['url'],
            is_playing=data['is_playing'],
            votes=votes_qty,
            votes_required=room.votes_to_skip,
            id=item['id']
        )

    return song


@router.put('/pause', status_code=204)
async def put_pause(request: Request) -> dict[None, None]:
    identity: str = request.session['identity']
    room_code: str = request.session['room_code']

    with Session() as session:
        q: Query = session.query(Room).filter(Room.code == room_code)
        room: Optional[Room] = q.one_or_none()

        if room is None:
            raise HTTPException(status_code=404)

        if identity == room.host or room.guest_can_pause:
            pause_song(room.host)

            return {}

        raise HTTPException(status_code=403)


@router.put('/play', status_code=204)
async def put_play(request: Request) -> dict[None, None]:
    identity: str = request.session['identity']
    room_code: str = request.session['room_code']

    with Session() as session:
        q: Query = session.query(Room).filter(Room.code == room_code)
        room: Optional[Room] = q.one_or_none()

        if room is None:
            raise HTTPException(status_code=404)

        if identity == room.host or room.guest_can_pause:
            play_song(room.host)

            return {}

        raise HTTPException(status_code=403)

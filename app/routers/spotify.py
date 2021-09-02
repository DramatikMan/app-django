import os
from datetime import datetime
from typing import Optional

import httpx
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm.query import Query

from ..db.config import Session
from ..db.models import Room, SpotifyTokens, Vote
from ..db.utils import get_tokens, update_or_create_tokens
from ..types import (
    CurrentSongBackendData,
    CurrentSongResponseData,
    SpotifyAuthResponseData
)
from .utils import skip_song, spotify_api_request, pause_song, play_song


router = APIRouter(prefix='/spotify')


TOKEN_URI = 'https://accounts.spotify.com/api/token'
REDIRECT_URI = os.environ['SPOTIFY_REDIRECT_URI']
CLIENT_ID = os.environ['SPOTIFY_CLIENT_ID']
CLIENT_SECRET = os.environ['SPOTIFY_CLIENT_SECRET']
AUTH_URI = 'https://accounts.spotify.com/authorize'


@router.get('/auth/url')
async def get_auth_url(request: Request) -> dict[str, str]:
    scopes = (
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing'
    )

    payload = dict(
        scope=' '.join(scopes),
        response_type='code',
        redirect_uri=REDIRECT_URI,
        client_id=CLIENT_ID
    )

    req = httpx.Request(method='GET', url=AUTH_URI, params=payload)

    return {'url': str(req.url)}


@router.get('/auth/status')
async def get_auth_status(request: Request) -> dict[str, bool]:
    identity: str = request.session['identity']
    tokens: Optional[SpotifyTokens] = get_tokens(identity)

    if tokens:

        if tokens.expiry_dt <= datetime.now():
            payload = dict(
                grant_type='refresh_token',
                refresh_token=tokens.refresh_token,
                cliend_id=CLIENT_ID,
                client_secret=CLIENT_SECRET
            )

            async with httpx.AsyncClient() as client:
                resp: httpx.Response = await client.post(
                    url=TOKEN_URI,
                    data=payload
                )
                update_or_create_tokens(identity, resp.json())

        return {'status': True}

    return {'status': False}


@router.get('/redirect', response_class=RedirectResponse)
async def get_redirect(request: Request, code: str) -> str:
    payload = dict(
        grant_type='authorization_code',
        code=code,
        redirect_uri=REDIRECT_URI,
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET
    )

    async with httpx.AsyncClient() as client:
        resp: httpx.Response = await client.post(TOKEN_URI, data=payload)
        resp_data: SpotifyAuthResponseData = resp.json()

    update_or_create_tokens(request.session['identity'], resp_data)

    return '/'


@router.get('/song')
async def get_song(request: Request) -> CurrentSongBackendData:
    room_code: str = request.session['room_code']

    with Session() as session:
        room_query: Query = session.query(Room).filter(Room.code == room_code)
        room: Optional[Room] = room_query.one_or_none()

        if room is None:
            raise HTTPException(status_code=404)

        host: str = room.host
        data: CurrentSongResponseData = await spotify_api_request(
            identity=host
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

        vote_query = session.query(Vote).filter(Vote.room_code == room.code)
        votes_qty: int = len(vote_query.all())

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

        if room.current_song != song['id']:
            room_query.update({'current_song': song['id']})
            vote_query.delete()

        session.commit()

    return song


@router.put('/pause', status_code=204)
async def put_pause(request: Request) -> None:
    identity: str = request.session['identity']
    room_code: str = request.session['room_code']

    with Session() as session:
        q: Query = session.query(Room).filter(Room.code == room_code)
        room: Optional[Room] = q.one_or_none()

        if room is None:
            raise HTTPException(status_code=404)

        if identity == room.host or room.guest_can_pause:
            await pause_song(room.host)

            return None

        raise HTTPException(status_code=403)


@router.put('/play', status_code=204)
async def put_play(request: Request) -> None:
    identity: str = request.session['identity']
    room_code: str = request.session['room_code']

    with Session() as session:
        q: Query = session.query(Room).filter(Room.code == room_code)
        room: Optional[Room] = q.one_or_none()

        if room is None:
            raise HTTPException(status_code=404)

        if identity == room.host or room.guest_can_pause:
            await play_song(room.host)

            return None

        raise HTTPException(status_code=403)


@router.post('/skip', status_code=204)
async def post_skip(request: Request) -> None:
    identity: str = request.session['identity']
    room_code: str = request.session['room_code']

    with Session() as session:
        room_query: Query = session.query(Room).filter(Room.code == room_code)
        room: Optional[Room] = room_query.one_or_none()

        if room is None:
            raise HTTPException(status_code=404)

        votes_query: Query = session.query(Vote).filter(
            Vote.room_code == room.code,
            Vote.song_id == room.current_song
        )
        user_votes_query: Query = session.query(Vote).filter(
            Vote.room_code == room.code,
            Vote.song_id == room.current_song,
            Vote.user == identity
        )
        votes_needed: int = room.votes_to_skip

        if identity == room.host:
            votes_query.delete()
            await skip_song(identity)
        elif user_votes_query.one_or_none() is None:
            if (len(votes_query.all()) + 1) >= votes_needed:
                votes_query.delete()
                await skip_song(identity)
            else:
                vote = Vote(
                    user=identity,
                    room_code=room.code,
                    song_id=room.current_song
                )
                session.add(vote)

        session.commit()

        return None

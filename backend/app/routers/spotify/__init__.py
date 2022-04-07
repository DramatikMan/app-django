from typing import Any, Optional

import httpx
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy import delete, select, update
from sqlalchemy.ext.asyncio import AsyncSession

import app.routers.spotify.config as config
from . import auth
from .types import CurrentSong, CurrentSongResp
from .utils import pause_song, play_song, skip_song, spotify_api_request
from ...db.models import Room, Vote
from ...db.utils import update_or_create_tokens
from ...dependencies import get_client, get_db_session, get_session
from ...types import SpotifyAuthResp


router = APIRouter()
router.include_router(auth.router, prefix='/auth')


@router.get('/redirect', response_class=RedirectResponse)
async def get_redirect(
    code: str,
    client: httpx.AsyncClient = Depends(get_client),
    session: dict[Any, Any] = Depends(get_session),
    DB: AsyncSession = Depends(get_db_session)
) -> str:
    payload = dict(
        grant_type='authorization_code',
        code=code,
        redirect_uri=config.REDIRECT_URI,
        client_id=config.CLIENT_ID,
        client_secret=config.CLIENT_SECRET
    )

    resp: httpx.Response = await client.post(config.TOKEN_URI, data=payload)
    resp_data = SpotifyAuthResp(**resp.json())
    await update_or_create_tokens(DB, session['identity'], resp_data)

    return '/'


@router.get('/song')
async def get_song(
    client: httpx.AsyncClient = Depends(get_client),
    session: dict[Any, Any] = Depends(get_session),
    DB: AsyncSession = Depends(get_db_session)
) -> CurrentSong:
    stmt = select(Room).where(Room.code == session['room_code'])
    result = await DB.execute(stmt)
    room: Optional[Room] = result.scalar_one_or_none()

    if room is None:
        raise HTTPException(status_code=404)

    room_code, host, votes_to_skip, current_song = \
        room.code, room.host, room.votes_to_skip, room.current_song

    data: CurrentSongResp = await spotify_api_request(client, DB, host)

    item = data.item
    artists = ''

    for i, artist in enumerate(item.artists):
        if i > 0:
            artists += ', '

        artists += artist.name

    stmt = select(Vote).where(Vote.room_code == room_code)
    result = await DB.execute(stmt)
    votes_qty: int = len(result.scalars().all())

    song = CurrentSong(
        title=item.name,
        artist=artists,
        duration=item.duration_ms,
        progress=data.progress_ms,
        image_url=item.album.images[0].url,
        is_playing=data.is_playing,
        votes=votes_qty,
        votes_required=votes_to_skip,
        id=item.id
    )

    if current_song != song.id:
        await DB.execute(
            update(Room)
            .where(Room.code == session['room_code'])
            .values(current_song=song.id)
        )
        await DB.execute(delete(Vote).where(Vote.room_code == room_code))

    await DB.commit()

    return song


@router.put('/pause', status_code=204)
async def put_pause(
    client: httpx.AsyncClient = Depends(get_client),
    session: dict[Any, Any] = Depends(get_session),
    DB: AsyncSession = Depends(get_db_session)
) -> None:
    stmt = select(Room).where(Room.code == session['room_code'])
    result = await DB.execute(stmt)
    room: Optional[Room] = result.scalar_one_or_none()

    if room is None:
        raise HTTPException(status_code=404)

    host, guest_can_pause = room.host, room.guest_can_pause

    if session['identity'] == host or guest_can_pause:
        await pause_song(client, DB, host)

        return None

    raise HTTPException(status_code=403)


@router.put('/play', status_code=204)
async def put_play(
    client: httpx.AsyncClient = Depends(get_client),
    session: dict[Any, Any] = Depends(get_session),
    DB: AsyncSession = Depends(get_db_session)
) -> None:
    stmt = select(Room).where(Room.code == session['room_code'])
    result = await DB.execute(stmt)
    room: Optional[Room] = result.scalar_one_or_none()

    if room is None:
        raise HTTPException(status_code=404)

    host, guest_can_pause = room.host, room.guest_can_pause

    if session['identity'] == host or guest_can_pause:
        await play_song(client, DB, host)

        return None

    raise HTTPException(status_code=403)


@router.post('/skip', status_code=204)
async def post_skip(
    client: httpx.AsyncClient = Depends(get_client),
    session: dict[Any, Any] = Depends(get_session),
    DB: AsyncSession = Depends(get_db_session)
) -> None:
    stmt = select(Room).where(Room.code == session['room_code'])
    result = await DB.execute(stmt)
    room: Optional[Room] = result.scalar_one_or_none()

    if room is None:
        raise HTTPException(status_code=404)

    votes_needed, room_code, host, current_song = \
        room.votes_to_skip, room.code, room.host, room.current_song

    result = await DB.execute(select(Vote).where(
        Vote.room_code == room_code and
        Vote.song_id == current_song
    ))
    total_votes = len(result.scalars().all())

    result = await DB.execute(select(Vote).where(
        Vote.room_code == room_code and
        Vote.song_id == current_song and
        Vote.user == session['identity']
    ))
    user_votes = len(result.scalars().all())

    if session['identity'] == host:
        await DB.execute(delete(Vote).where(
            Vote.room_code == room_code and
            Vote.song_id == current_song
        ))
        await skip_song(client, DB, session['identity'])
    elif user_votes == 0:
        if (total_votes + 1) >= votes_needed:
            await DB.execute(delete(Vote).where(
                Vote.room_code == room_code and
                Vote.song_id == current_song
            ))
            await skip_song(client, DB, host)
        else:
            DB.add(Vote(
                user=session['identity'],
                room_code=room_code,
                song_id=current_song
            ))

    await DB.commit()

    return None

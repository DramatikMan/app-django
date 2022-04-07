from datetime import datetime
from typing import Any, Optional

import httpx
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

import app.routers.spotify.config as config
from .types import Status, URL
from ....db.models import SpotifyTokens
from ....db.utils import get_tokens, update_or_create_tokens
from ....dependencies import get_db_session, get_session


router = APIRouter()


@router.get('/url')
async def get_auth_url() -> URL:
    scopes = (
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing'
    )

    payload = dict(
        scope=' '.join(scopes),
        response_type='code',
        redirect_uri=config.REDIRECT_URI,
        client_id=config.CLIENT_ID
    )

    req = httpx.Request(method='GET', url=config.AUTH_URI, params=payload)

    return URL(url=str(req.url))


@router.get('/status')
async def get_auth_status(
    session: dict[Any, Any] = Depends(get_session),
    DB: AsyncSession = Depends(get_db_session)
) -> Status:
    tokens: Optional[SpotifyTokens] = await get_tokens(DB, session['identity'])

    if tokens:
        if tokens.expiry_dt <= datetime.now():
            payload = dict(
                grant_type='refresh_token',
                refresh_token=tokens.refresh_token,
                cliend_id=config.CLIENT_ID,
                client_secret=config.CLIENT_SECRET
            )

            async with httpx.AsyncClient() as client:
                resp: httpx.Response = await client.post(
                    url=config.TOKEN_URI,
                    data=payload
                )
                await update_or_create_tokens(
                    DB,
                    session['identity'],
                    resp.json()
                )

        return Status(status=True)

    return Status(status=False)

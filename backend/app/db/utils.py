from typing import Optional
from datetime import timedelta, datetime

from sqlalchemy.orm.query import Query

from .models import SpotifyTokens
from .config import Session
from ..types import SpotifyAuthResponseData


def get_tokens(identity: str) -> Optional[SpotifyTokens]:
    with Session() as session:
        q: Query = session \
            .query(SpotifyTokens) \
            .filter(SpotifyTokens.user == identity)

        tokens: Optional[SpotifyTokens] = q.one_or_none()

        return tokens


def update_or_create_tokens(
    identity: str,
    data: SpotifyAuthResponseData
) -> None:
    with Session() as session:
        session.merge(SpotifyTokens(
            user=identity,
            access_token=data['access_token'],
            token_type=data['token_type'],
            refresh_token=data['refresh_token'],
            expiry_dt=datetime.now() + timedelta(seconds=data['expires_in'])
        ))
        session.commit()

from typing import Optional, Any
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
    access_token: str = data.get('access_token')
    token_type: str = data.get('token_type')
    expires_in: Any = data.get('expires_in')
    refresh_token: str = data.get('refresh_token')

    with Session() as session:
        session.merge(SpotifyTokens(
            user=identity,
            access_token=access_token,
            token_type=token_type,
            refresh_token=refresh_token,
            expiry_dt=datetime.now() + timedelta(seconds=expires_in)
        ))
        session.commit()

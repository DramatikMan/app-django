import re
from typing import Callable, ClassVar
from datetime import datetime

from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import as_declarative, declared_attr


@as_declarative()
class Base:
    __init__: Callable[..., None]
    __name__: ClassVar[str]

    @declared_attr  # type: ignore
    def __tablename__(cls) -> str:
        return '_'.join(re.findall('[A-Z][^A-Z]*', cls.__name__)).lower()


class Room(Base):
    host = Column(String(length=50), primary_key=True)
    code = Column(String(length=8), nullable=False, unique=True)
    guest_can_pause = Column(Boolean, nullable=False, default=False)
    votes_to_skip = Column(Integer, nullable=False, default=2)
    updated_at = Column(DateTime, nullable=False, default=datetime.now)
    current_song = Column(String)


class SpotifyTokens(Base):
    user = Column(String(length=50), primary_key=True)
    created_at = Column(DateTime, nullable=False, default=datetime.now)
    access_token = Column(String, nullable=False)
    token_type = Column(String, nullable=False)
    expiry_dt = Column(DateTime, nullable=False)
    refresh_token = Column(String)


class Vote(Base):
    user = Column(String(length=50), primary_key=True)
    created_at = Column(DateTime, nullable=False, default=datetime.now)
    song_id = Column(String, nullable=False)
    room_code = Column(
        String(length=8),
        ForeignKey('room.code', ondelete='CASCADE'),
        nullable=False
    )

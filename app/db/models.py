from random import choices
from string import ascii_uppercase, digits
from typing import Callable, ClassVar

from sqlalchemy import Column, String, Integer, Boolean, DateTime
from sqlalchemy.orm import as_declarative, declared_attr
from sqlalchemy.orm.query import Query

from .config import Session


@as_declarative()
class Base:
    __init__: Callable[..., None]
    __name__: ClassVar[str]

    @declared_attr  # type: ignore
    def __tablename__(cls) -> str:
        return cls.__name__.lower()


def unique_code() -> str:
    with Session() as session:
        while True:
            code = ''.join(choices(ascii_uppercase + digits, k=6))
            q: Query = session.query(Room).filter(Room.code == code)

            if q.one_or_none() is None:
                break

    return code


class Room(Base):
    host = Column(String(length=50), primary_key=True)
    code = Column(
        String(length=8),
        nullable=False,
        unique=True,
        default=unique_code
    )
    guest_can_pause = Column(Boolean, nullable=False, default=False)
    votes_to_skip = Column(Integer, nullable=False, default=2)
    updated_at = Column(DateTime, nullable=False)
    current_song = Column(String(length=50))


class SpotifyToken(Base):
    user = Column(String(length=50), primary_key=True)
    created_at = Column(DateTime, nullable=False)
    access_token = Column(String(length=255), nullable=False)
    token_type = Column(String(length=50), nullable=False)
    expiry_dt = Column(DateTime, nullable=False)
    refresh_token = Column(String(length=255))

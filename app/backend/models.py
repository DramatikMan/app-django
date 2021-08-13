from typing import Callable, ClassVar

import sqlalchemy as sa
from sqlalchemy.orm import as_declarative, declared_attr


@as_declarative()
class Base:
    __init__: Callable[..., None]
    __name__: ClassVar[str]

    @declared_attr  # type: ignore
    def __tablename__(cls) -> str:
        return cls.__name__.lower()


class Room(Base):
    code = sa.Column(sa.String(length=8), primary_key=True)
    host = sa.Column(sa.String(lenght=50), unique=True)
    guest_can_pause = sa.Column(sa.Boolean, nullable=False, default=False)
    votes_to_skip = sa.Column(sa.Integer, nullable=False, default=2)
    created_at = sa.Column(sa.DateTime, nullable=False)
    current_song = sa.Column(sa.String(length=50))

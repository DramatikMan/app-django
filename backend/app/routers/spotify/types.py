from pydantic import StrictBool, StrictInt, StrictStr

from ...types import BaseModel


class URL(BaseModel):
    url: StrictStr


class Status(BaseModel):
    status: StrictBool


class AlbumImage(BaseModel):
    url: str


class Album(BaseModel):
    images: list[AlbumImage]


class Artist(BaseModel):
    name: str


class SongItem(BaseModel):
    name: str
    id: str
    duration_ms: int
    album: Album
    artists: list[Artist]


class CurrentSongResp(BaseModel):
    is_playing: bool
    progress_ms: int
    item: SongItem


class CurrentSong(BaseModel):
    title: StrictStr
    artist: StrictStr
    duration: StrictInt
    progress: StrictInt
    image_url: StrictStr
    is_playing: bool
    votes: StrictInt
    votes_required: StrictInt
    id: StrictStr

from typing import TypedDict


class AlbumImage(TypedDict):
    url: str


class Album(TypedDict):
    images: list[AlbumImage]


class Artist(TypedDict):
    name: str


class SongItem(TypedDict):
    name: str
    id: str
    duration_ms: int
    album: Album
    artists: list[Artist]


class CurrentSongResponseData(TypedDict, total=False):
    is_playing: bool
    progress_ms: int
    item: SongItem


class CurrentSongBackendData(TypedDict):
    title: str
    artist: str
    duration: int
    progress: int
    image_url: str
    is_playing: bool
    votes: int
    votes_required: int
    id: str

from typing import TypedDict, Optional


class GetRoomRequestData(TypedDict):
    guestCanPause: bool
    votesToSkip: int


class RoomResponseData(TypedDict):
    guestCanPause: bool
    votesToSkip: int
    isHost: bool


class JoinRoomRequestData(TypedDict):
    roomCode: Optional[str]


class SpotifyAuthResponseData(TypedDict):
    access_token: str
    token_type: str
    expires_in: int
    refresh_token: str
    scope: str


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

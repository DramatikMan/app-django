from typing import List, TypedDict, Optional, Literal


class GetRoomRequestData(TypedDict):
    guestCanPause: bool
    votesToSkip: int


class RoomResponseData(TypedDict):
    guestCanPause: bool
    votesToSkip: int
    isHost: bool


class JoinRoomRequestData(TypedDict):
    roomCode: Optional[str]


class SpotifyAuthURLParams(TypedDict):
    scope: str
    response_type: Literal['code']
    redirect_uri: str
    client_id: str


class SpotifyRefreshRequestData(TypedDict):
    grant_type: Literal['refresh_token']
    refresh_token: str
    cliend_id: str
    client_secret: str


class SpotifyCallbackRequestData(TypedDict):
    grant_type: Literal['authorization_code']
    code: str
    redirect_uri: str
    client_id: str
    client_secret: str


class SpotifyAuthResponseData(TypedDict):
    access_token: str
    token_type: str
    expires_in: int
    refresh_token: str
    scope: str


class AlbumImage(TypedDict):
    url: str


class Album(TypedDict):
    images: List[AlbumImage]


class Artist(TypedDict):
    name: str


class SongItem(TypedDict):
    name: str
    id: str
    duration_ms: int
    album: Album
    artists: List[Artist]


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

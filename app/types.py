from typing import TypedDict, Optional, Literal


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

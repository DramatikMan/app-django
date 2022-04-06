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

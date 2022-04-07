from typing import Optional

from pydantic import Field, StrictBool, StrictInt, StrictStr

from ...types import BaseModel


class Detail(BaseModel):
    detail: StrictStr


class RoomProps(BaseModel):
    guest_can_pause: StrictBool = Field(..., alias='guestCanPause')
    votes_to_skip: StrictInt = Field(..., alias='votesToSkip')


class RoomResponse(RoomProps):
    is_host: StrictBool = Field(..., alias='isHost')


class RoomCode(BaseModel):
    room_code: Optional[StrictStr] = Field(..., alias='roomCode')

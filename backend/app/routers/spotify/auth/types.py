from pydantic import StrictBool, StrictStr

from ....types import BaseModel


class URL(BaseModel):
    url: StrictStr


class Status(BaseModel):
    status: StrictBool

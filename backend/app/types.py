from typing import TypedDict

from pydantic import BaseModel as PydanticBaseModel


class SpotifyAuthResponseData(TypedDict):
    access_token: str
    token_type: str
    expires_in: int
    refresh_token: str
    scope: str


class BaseModel(PydanticBaseModel):
    class Config:
        @staticmethod
        def to_camel_case(string: str) -> str:
            return ''.join(
                word if i == 0 else word[0].upper() + word[1:]
                for i, word in enumerate(string.split('_'))
            )

        alias_generator = to_camel_case
        allow_population_by_field_name = True
        extra = 'forbid'

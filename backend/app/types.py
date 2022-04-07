from pydantic import BaseModel as PydanticBaseModel


class BaseModel(PydanticBaseModel):
    class Condig:
        allow_population_by_field_name = True


class SpotifyAuthResp(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
    refresh_token: str
    scope: str

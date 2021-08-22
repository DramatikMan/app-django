from typing import Literal, Union, Optional, Any

from requests import get, post, put, Response

from ..db.utils import get_tokens
from ..db.models import SpotifyTokens


API_URI = 'https://api.spotify.com/v1/me/'


def spotify_api_request(
    identity: str,
    endpoint: str,
    method: Union[Literal['POST'], Literal['PUT'], None]
) -> Any:
    tokens: Optional[SpotifyTokens] = get_tokens(identity)

    if tokens:
        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer' + tokens.access_token
        }

        if method == 'POST':
            post(API_URI + endpoint, headers=headers)
        if method == 'PUT':
            put(API_URI + endpoint, headers=headers)

        resp: Response = get(API_URI + endpoint, headers=headers)

        try:
            return resp.json()
        except Exception:
            return {'Error': 'Unable to get JSON from response.'}

    return {'Error': 'Found no tokens to execute request with.'}

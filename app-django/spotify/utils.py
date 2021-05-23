import requests
from datetime import timedelta

from django.utils import timezone

from .models import SpotifyToken


API_URI = "https://api.spotify.com/v1/me/"


def get_spotify_token(session_key):
    queryset = SpotifyToken.objects.filter(user=session_key)

    if queryset.exists():
        return queryset[0]
    else:
        return None


def update_or_create_spotify_token(request, resp_json):
    user = request.session.session_key

    access_token = resp_json.get('access_token')
    token_type = resp_json.get('token_type')
    refresh_token = resp_json.get('refresh_token') or \
        get_spotify_token(user).refresh_token
    expires_in = resp_json.get('expires_in')
    
    SpotifyToken.objects.update_or_create(
        user=user,
        defaults=dict(
            access_token=access_token,
            token_type=token_type,
            refresh_token=refresh_token,
            expiry_dt=timezone.now() + timedelta(seconds=expires_in)
        )
    )


def execute_spotify_api_request(session_key, endpoint, post=False,  put=False):
    tokens = get_spotify_token(session_key)
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + tokens.access_token
    }

    if post:
        requests.post(API_URI + endpoint, headers=headers)
    if put:
        requests.put(API_URI + endpoint, headers=headers)
    
    response = requests.get(API_URI + endpoint, headers=headers)
    try:
        return response.json()
    except:
        return {'Error': 'Unable to return JSON object.'}


def pause_song(session_key):
    return execute_spotify_api_request(session_key, "player/pause", put=True)


def play_song(session_key):
    return execute_spotify_api_request(session_key, "player/play", put=True)


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


def update_or_create_spotify_token(request, response):
    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    
    SpotifyToken.objects.update_or_create(
        user=request.session.session_key,
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
        'Authorization': 'Bearer' + tokens.access_token
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
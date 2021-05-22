from datetime import timedelta

from django.utils import timezone

from .models import SpotifyToken


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
import os
import requests

from django.shortcuts import render, redirect
from django.utils import timezone
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from api.models import Room
from .models import SpotifyToken
from .utils import (
    get_spotify_token,
    update_or_create_spotify_token,
    execute_spotify_api_request
)


TOKEN_URI = 'https://accounts.spotify.com/api/token'
REDIRECT_URI = os.environ['SPOTIFY_REDIRECT_URI']
CLIENT_ID = os.environ['SPOTIFY_CLIENT_ID']
CLIENT_SECRET = os.environ['SPOTIFY_CLIENT_SECRET']


class AuthURL(APIView):
    def get(self, request, format=None):
        scopes = (
            'user-read-playback-state',
            'user-modify-playback-state',
            'user-read-currently-playing'
        )
        payload = dict(
            scope=' '.join(scopes),
            response_type='code',
            redirect_uri=REDIRECT_URI,
            client_id=CLIENT_ID
        )
        url = requests.Request(
            'GET',
            'https://accounts.spotify.com/authorize',
            params=payload
        ).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)


def spotify_callback(request, format=None):
    code = request.GET.get('code')
    payload = dict(
        grant_type='authorization_code',
        code=code,
        redirect_uri=REDIRECT_URI,
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET
    )
    response = requests.post(TOKEN_URI, data=payload).json()

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_spotify_token(request, response)

    return redirect('frontend:')


class IsAuthenticated(APIView):
    def get(self, request, format=None):
        if not request.session.exists(request.session.session_key):
            request.session.create()

        tokens = get_spotify_token(self.request.session.session_key)
        
        if tokens:

            if tokens.expiry_dt <= timezone.now():
                payload = dict(
                    grant_type='refresh_token',
                    refresh_token=tokens.refresh_token,
                    client_id=CLIENT_ID,
                    client_secret=CLIENT_SECRET
                )
                response = requests.post(TOKEN_URI, data=payload)
                update_or_create_spotify_token(self.request, response.json())

            return Response({'status': True}, status=status.HTTP_200_OK)

        return Response({'status': False}, status=status.HTTP_200_OK)
        

class CurrentSong(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        queryset = Room.objects.filter(code=room_code)

        if queryset.exists():
            room = queryset[0]
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)

        host = room.host
        endpoint = 'player/currently-playing'
        resp_json = execute_spotify_api_request(host, endpoint)

        if 'item' not in resp_json:
            return Response(
                {'Message': 'Could not get current song info.'},
                status=status.HTTP_204_NO_CONTENT
            )
        
        is_playing = resp_json.get('is_playing')
        progress = resp_json.get('progress_ms')

        item = resp_json.get('item')
        title = item.get('name')
        song_id = item.get('id')
        duration = item.get('duration_ms')
        album_cover = item.get('album').get('images')[0].get('url')

        artist_string = ''

        for i, artist in enumerate(item.get('artists')):
            if i > 0:
                artist_string += ', '
            artist_name = artist.get('name')
            artist_string += artist_name

        song = dict(
            title=title,
            artist=artist_string,
            duration=duration,
            progress=progress,
            image_url=album_cover,
            is_playing=is_playing,
            votes=0,
            id=song_id
        )

        return Response(song, status=status.HTTP_200_OK)
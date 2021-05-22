import os
import requests

from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response


redirect_uri = os.environ['SPOTIFY_REDIRECT_URI']
client_id = os.environ['SPOTIFY_CLIENT_ID']
client_secret = os.environ['SPOTIFY_CLIENT_SECRET']


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
            redirect_uri=redirect_uri,
            client_id=client_id
        )
        url = requests.Request(
            'GET',
            'https://accounts.spotify.com/authorize',
            params=payload
        ).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)


def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    payload = dict(
        grant_type='authorization_code',
        code=code,
        redirect_uri=redirect_uri,
        client_id=client_id,
        client_secret=client_secret
    )

    response = requests.post(
        'https://accounts.spotify.com/api/token',
        data=payload
    ).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')
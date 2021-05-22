import os
import requests

from django.shortcuts import render, redirect
from django.utils import timezone
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import SpotifyToken
from .utils import update_or_create_spotify_token


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
    error = request.GET.get('error')

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

        queryset = SpotifyToken.objects.filter(user=request.session.session_key)
       
        if queryset.exists():
            tokens = queryset[0]
           
            if tokens.expiry_dt <= timezone.now():
                payload = dict(
                    grant_type='refresh_token',
                    refresh_token=tokens.refresh_token,
                    client_id=CLIENT_ID,
                    client_secret=CLIENT_SECRET
                )
                response = post(TOKEN_URI, data=payload).json()
                update_or_create_spotify_token(request, response)

            return Response({'status': True}, status=status.HTTP_200_OK)

        return Response({'status': False}, status=status.HTTP_200_OK)
                



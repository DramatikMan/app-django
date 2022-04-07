import os


AUTH_URI = 'https://accounts.spotify.com/authorize'
CLIENT_ID = os.environ['SPOTIFY_CLIENT_ID']
CLIENT_SECRET = os.environ['SPOTIFY_CLIENT_SECRET']
REDIRECT_URI = os.environ['SPOTIFY_REDIRECT_URI']
TOKEN_URI = 'https://accounts.spotify.com/api/token'

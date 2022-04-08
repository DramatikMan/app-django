# Music App

Allows you to host or join rooms to control the host's Spotify playback.
A Room host has to start playing something from their Spotify account AND
their account has to have Premium for this to work.
Spotify API rules, not mine ¯\\\_(ツ)_/¯ .

## Local startup w/ `docker compose`

### Step 1

- create an app at https://developer.spotify.com/
- get credentials to use as environment variables at the next step
- set redirect URI

### Step 2

```bash
$ git clone https://github.com/DramatikMan/music-app.git
$ cd music-app
$ docker compose up --build  # requires secrets.env in repo folder
```

#### Required environment variables:
```
### ~ session encryption ~ ###
SECRET_KEY=some_string

### ~ PostgreSQL database ~ ###
POSTGRES_USER=some_username
POSTGRES_PASSWORD=some_password
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=postgres

### ~ Spotify API ~ ###
SPOTIFY_CLIENT_ID=some_id
SPOTIFY_CLIENT_SECRET=some_string
SPOTIFY_REDIRECT_URI=http://127.0.0.1:5001/api/spotify/redirect
```

The app will listen at `127:0.0.1:5001`.

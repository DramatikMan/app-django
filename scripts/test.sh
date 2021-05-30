sed -i "s/DEBUG = True/DEBUG = False/" music_app/music_app/settings.py
pipenv run collectstatic --noinput
pipenv run pytest
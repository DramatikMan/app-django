evs=(
	SECRET_KEY
    SPOTIFY_REDIRECT_URI
	SPOTIFY_CLIENT_ID
    SPOTIFY_CLIENT_SECRET
)
for variable in "${evs[@]}"; do
	if [[ -z ${!variable+x} ]] || [[ -z ${!variable} ]] ; then
		echo -e "\e[93mEnvironmental variable \e[1m$variable\e[21m is undefined or empty.\e[0m"
		((undef++))
	fi
done
if [[ $undef -gt 0 ]]; then exit 1; fi

cd music_app

sed -i "s/DEBUG = True/DEBUG = False/" music_app/settings.py
# sed -i "s/# //g" music_app/settings.py
pipenv run ./manage.py migrate
pipenv run ./manage.py collectstatic

echo $'
workers=4
bind="0.0.0.0:8000"
wsgi_app="music_app.wsgi:application"' > gunicorn.conf.py
pipenv run gunicorn

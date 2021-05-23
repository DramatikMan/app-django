if [[ ${build_env} != 'production' ]]; then
    npm install --no-package-lock
else
    npm install --production --no-package-lock
fi
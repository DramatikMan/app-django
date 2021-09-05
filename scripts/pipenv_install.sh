pip install pipenv
mkdir -p .venv
if [[ ${build_env} != 'production' ]]; then
    pipenv install --dev --skip-lock
else
    pipenv install
fi
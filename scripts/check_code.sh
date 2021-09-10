clear

pipenv run mypy \
    /${PWD}/app \
    --ignore-missing-imports \
    --show-error-codes \
    --strict \
    --exclude /migrations/

pipenv run flake8 \
    /${PWD}/app \
    --count \
    --statistics \
    --show-source \
    --exclude /**/migrations
pipenv run mypy \
    /project/app \
    --ignore-missing-imports \
    --show-error-codes \
    --strict \
    --exclude /migrations/

pipenv run flake8 \
    /project/app \
    --count \
    --statistics \
    --show-source \
    --exclude **/migrations
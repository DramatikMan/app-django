#!/bin/bash
set -e

until poetry run python scripts/check_postgres.py &> /dev/null; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"
poetry exec upgrade
poetry exec server

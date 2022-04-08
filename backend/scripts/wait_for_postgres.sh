#!/bin/bash
set -e

until python3 -c "
import os
import socket


if __name__ == '__main__':
    try:
        sock = socket.create_connection((
            os.environ['POSTGRES_HOST'],
            os.environ['POSTGRES_PORT']
        ))
    except Exception:
        raise
    else:
        sock.close()
" &> /dev/null; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"
poetry exec upgrade
poetry exec server

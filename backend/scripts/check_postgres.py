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

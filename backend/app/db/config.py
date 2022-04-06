import os

from sqlalchemy.engine import Engine
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


DB_USER = os.environ['DB_USER']
DB_PASSWORD = os.environ['DB_PASSWORD']
DB_HOST = os.environ['DB_HOST']
DB_PORT = os.environ['DB_PORT']
DB_NAME = os.environ['DB_NAME']
DB_STRING = f'{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
DB_URI = f'postgresql://{DB_STRING}'
engine: Engine = create_engine(DB_URI)
Session = sessionmaker(engine)

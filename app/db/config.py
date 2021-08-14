import os

from sqlalchemy.engine import Engine
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


# Database
db_user = os.environ['POSTGRES_USER']
db_pswd = os.environ['POSTGRES_PASSWORD']
db_host = os.environ['POSTGRES_HOST']
db_port = os.environ['POSTGRES_PORT']
db_name = os.environ['POSTGRES_DB']
DB_URI = f'postgresql://{db_user}:{db_pswd}@{db_host}:{db_port}/{db_name}'
db_engine: Engine = create_engine(DB_URI)
Session = sessionmaker(db_engine)

from sqlmodel import SQLModel, Session, create_engine
from tenflow.config import settings
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import sys
import os
from urllib.parse import urlparse
from contextlib import contextmanager, asynccontextmanager

global engine
engine = None

def recreate_engine():
    global engine
    engine = create_engine(settings.get_postgres_url(), echo=False)


def get_session_gen():
    if engine is None:
        recreate_engine()
    with Session(engine) as session:
        yield session

def get_session():
    if engine is None:
        recreate_engine()
    return Session(engine)


@contextmanager
def session_context():
    session = get_session()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@asynccontextmanager
async def async_session_context():
    """Async version of session_context for use with async functions."""
    session = get_session()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()

#def create_database():
#    # Parse the database URL
#    database_url = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/tenflow")
#    parsed = urlparse(database_url)
#    
#    db_name = parsed.path[1:]  # Remove leading '/'
#    db_user = parsed.username
#    db_password = parsed.password
#    db_host = parsed.hostname
#    db_port = parsed.port or 5432
#    
#    try:
#        # Connect to PostgreSQL server (not to a specific database)
#        conn = psycopg2.connect(
#            host=db_host,
#            port=db_port,
#            user=db_user,
#            password=db_password,
#            database='postgres'  # Connect to default postgres database
#        )
#        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
#        cursor = conn.cursor()
#        
#        # Check if database exists
#        cursor.execute(
#            "SELECT 1 FROM pg_database WHERE datname = %s",
#            (db_name,)
#        )
#        exists = cursor.fetchone()
#        
#        if not exists:
#            # Create database
#            cursor.execute(f'CREATE DATABASE "{db_name}"')
#            print(f"Database '{db_name}' created successfully!")
#        else:
#            print(f"Database '{db_name}' already exists.")
#        
#        cursor.close()
#        conn.close()
#        
#    except psycopg2.Error as e:
#        print(f"Error creating database: {e}")
#        sys.exit(1)
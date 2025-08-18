import pytest
import uuid
from sqlmodel import text, create_engine, Session, select
import alembic.config
import os
import importlib
from httpx import ASGITransport
from httpx import AsyncClient


@pytest.fixture(scope='session')
def worker_id():
    """Get the worker ID for parallel test execution."""
    return os.environ.get('PYTEST_XDIST_WORKER', 'master')


@pytest.fixture(scope='session')
def env_vars(worker_id):
    original_db = os.environ.get('POSTGRES_DATABASE', 'tenflow')
    # Use a stable database name per worker
    new_db = f'test_{worker_id}_{uuid.uuid4().hex[:8]}'
    env = {
        'ORIGINAL_POSTGRES_DATABASE': original_db,
        'ENV': 'test',
        'POSTGRES_USER': 'postgres',
        'POSTGRES_PASSWORD': 'password',
        'POSTGRES_DATABASE': new_db,
        'POSTGRES_HOST': 'localhost',
        'POSTGRES_PORT': '5432',
        'SECRET_KEY': 'your-secret-key-here-change-in-production',
        'ALGORITHM': 'HS256',
        'ACCESS_TOKEN_EXPIRE_MINUTES': '30',
        'FRONTEND_URL': 'http://localhost:5173',
    }

    for key, value in env.items():
        os.environ[key] = str(value)

    # Reinitialize settings to pick up new environment variables
    import tenflow.config as config

    importlib.reload(config)

    # Reset database engine so new settings are used when sessions are created
    import tenflow.database as db

    db.engine = None

    return env


def drop_database(conn, db_name):
    if db_name == os.environ['ORIGINAL_POSTGRES_DATABASE']:
        raise ValueError(f'Cowardly refusing to drop original database {db_name}')
    
    # First, terminate all connections to the database
    try:
        conn.execute(text(f"""
            SELECT pg_terminate_backend(pg_stat_activity.pid)
            FROM pg_stat_activity
            WHERE pg_stat_activity.datname = '{db_name}'
              AND pid <> pg_backend_pid()
        """))
    except Exception:
        pass
    
    # Now drop the database
    conn.execute(text(f'DROP DATABASE IF EXISTS "{db_name}"'))


@pytest.fixture(scope='session')
async def root_engine(env_vars):
    from tenflow.config import settings

    engine = create_engine(settings.get_root_postgres_url(), isolation_level='AUTOCOMMIT', echo=False)
    yield engine
    engine.dispose()


@pytest.fixture(scope='session')
async def db_created(root_engine, env_vars):
    """Create the database once per worker session."""
    with root_engine.connect() as conn:
        # Drop database if it exists (in case of previous failed run)
        try:
            drop_database(conn, env_vars['POSTGRES_DATABASE'])
        except Exception:
            pass
        
        # Create new database
        conn.execute(text(f'CREATE DATABASE "{env_vars["POSTGRES_DATABASE"]}"'))
        
        # Run migrations once
        alembic_args = [
            '-q',
            '--raiseerr',
            'upgrade',
            'head',
        ]
        alembic.config.main(argv=alembic_args)
        
        yield
        
        # Clean up at the end of the session
        import tenflow.database as db
        if db.engine:
            db.engine.dispose()
            db.engine = None
        
        drop_database(conn, env_vars['POSTGRES_DATABASE'])


def clear_all_tables(session):
    """Clear all tables in the database while preserving schema."""
    # Get all table names from the database
    result = session.execute(text("""
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT IN ('alembic_version')
    """))
    tables = [row[0] for row in result]
    
    # Disable foreign key checks temporarily
    session.execute(text('SET session_replication_role = replica'))
    
    # Truncate all tables
    for table in tables:
        session.execute(text(f'TRUNCATE TABLE "{table}" CASCADE'))
    
    # Re-enable foreign key checks
    session.execute(text('SET session_replication_role = DEFAULT'))
    
    session.commit()


@pytest.fixture
async def session(db_created, env_vars):
    """Provide a clean database session for each test."""
    # need to be lazy to pick up the new database name
    from tenflow.database import get_session
    
    # Create a new session
    session = get_session()
    
    # Clear all data before the test
    clear_all_tables(session)
    
    yield session
    
    # Clean up after the test
    session.close()


@pytest.fixture(name='async_client')
async def async_client_fixture(session, env_vars):
    # need to be lazy to pick up the new database name
    from tenflow.main import app

    async with AsyncClient(transport=ASGITransport(app=app), base_url='http://localhost') as ac:
        yield ac
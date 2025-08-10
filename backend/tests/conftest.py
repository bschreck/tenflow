import pytest
import uuid
from sqlmodel import text, Session, create_engine
import alembic.config
import os
import importlib
from httpx import ASGITransport
from httpx import AsyncClient

@pytest.fixture
def env_vars():
    original_db = os.environ.get("POSTGRES_DATABASE", "tenflow")
    # Include worker ID if available to ensure unique DBs per worker
    worker_id = os.environ.get("PYTEST_XDIST_WORKER", "")
    new_db = f"test_{worker_id}_{uuid.uuid4().hex}" if worker_id else f"test_{uuid.uuid4().hex}"
    env = {
        "ORIGINAL_POSTGRES_DATABASE": original_db,
        "ENV": "test",
        "POSTGRES_USER": "postgres",
        "POSTGRES_PASSWORD": "password",
        "POSTGRES_DATABASE": new_db,
        "POSTGRES_HOST": "localhost",
        "POSTGRES_PORT": "5432",
        "SECRET_KEY": "your-secret-key-here-change-in-production",
        "ALGORITHM": "HS256",
        "ACCESS_TOKEN_EXPIRE_MINUTES": "30",
        "FRONTEND_URL": "http://localhost:5173",
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
    if db_name == os.environ["ORIGINAL_POSTGRES_DATABASE"]:
        raise ValueError(f"Cowardly refusing to drop original database {db_name}")
    conn.execute(text(f"DROP DATABASE IF EXISTS \"{db_name}\""))

@pytest.fixture
async def root_engine(env_vars):
    from tenflow.config import settings
    return create_engine(settings.get_root_postgres_url(), isolation_level="AUTOCOMMIT", echo=False)



@pytest.fixture
async def new_db(root_engine, env_vars):
    with root_engine.connect() as conn:
        conn.execute(text(f"CREATE DATABASE \"{env_vars['POSTGRES_DATABASE']}\""))
        yield
        drop_database(conn, env_vars["POSTGRES_DATABASE"])


@pytest.fixture
async def session(new_db, env_vars):
    # need to be lazy to pick up the new database name
    from tenflow.database import async_session_context
    async with async_session_context() as _session:
        yield _session

@pytest.fixture
async def migrate_db(session, env_vars):
    alembic_args = [
        '-q',
        '--raiseerr',
        'upgrade',
        'head',
    ]
    alembic.config.main(argv=alembic_args)


@pytest.fixture(name='async_client')
async def async_client_fixture(migrate_db):
    # need to be lazy to pick up the new database name
    from tenflow.main import app
    async with AsyncClient(transport=ASGITransport(app=app), base_url='http://localhost') as ac:
        try:
            yield ac
        finally:
            # Ensure any pending database connections are closed
            try:
                await ac.aclose()
            except Exception:
                pass


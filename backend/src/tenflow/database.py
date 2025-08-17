from sqlmodel import Session, create_engine
from tenflow.config import settings
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

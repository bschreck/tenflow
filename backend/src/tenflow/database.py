from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from tenflow.config import settings
from contextlib import contextmanager, asynccontextmanager

global engine
engine = None
global read_only_engine
read_only_engine = None

global Session
Session = None
global ReadOnlySession
ReadOnlySession = None


def recreate_engine():
    global engine
    engine = create_engine(
        settings.get_postgres_url(), 
        echo=(settings.LOGLEVEL.upper() == 'DEBUG'),
        pool_size=settings.DATABASE_POOL_SIZE,
        max_overflow=settings.DATABASE_MAX_OVERFLOW,
        pool_pre_ping=True,
        pool_recycle=settings.DATABASE_POOL_RECYCLE,
        pool_timeout=settings.DATABASE_POOL_TIMEOUT,
        pool_use_lifo=True,
    )

def recreate_read_only_engine():
    global read_only_engine
    read_only_engine = create_engine(
        settings.get_postgres_url(), 
        echo=(settings.LOGLEVEL.upper() == 'DEBUG'),
        pool_size=settings.DATABASE_POOL_SIZE,
        max_overflow=settings.DATABASE_MAX_OVERFLOW,
        pool_pre_ping=True,
        pool_recycle=settings.DATABASE_POOL_RECYCLE,
        pool_timeout=settings.DATABASE_POOL_TIMEOUT,
        pool_use_lifo=True,
        connect_args={
            'options': '-c default_transaction_isolation=serializable -c default_transaction_read_only=on'
        },
    )
    
def recreate_session():
    global Session
    global engine
    if engine is None:
        recreate_engine()
    Session = scoped_session(sessionmaker(bind=engine))


def recreate_read_only_session():
    global ReadOnlySession
    global read_only_engine
    if read_only_engine is None:
        recreate_read_only_engine()
    ReadOnlySession = scoped_session(sessionmaker(bind=read_only_engine))



def get_session_gen():
    if Session is None:
        recreate_session()

    with Session() as session:
        yield session

def get_read_only_session_gen():
    if ReadOnlySession is None:
        recreate_read_only_session()

    with ReadOnlySession() as session:
        yield session




def get_session():
    if Session is None:
        recreate_session()
    return Session()


def get_read_only_session():
    if ReadOnlySession is None:
        recreate_read_only_session()
    return ReadOnlySession()



@contextmanager
def session_context():
    with get_session() as session:
        yield session


@contextmanager
def read_only_session_context():
    with get_read_only_session() as session:
        yield session
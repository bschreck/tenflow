from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.ext.asyncio.session import AsyncSession
from sqlalchemy.orm import scoped_session
from tenflow.config import settings
from contextlib import asynccontextmanager

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
    engine = create_async_engine(
        settings.get_postgres_url(), 
        echo=(settings.LOGLEVEL.upper() == 'DEBUG'),
        pool_size=settings.DATABASE_POOL_SIZE,
        max_overflow=settings.DATABASE_MAX_OVERFLOW,
        pool_pre_ping=False,  # Disable pre-ping to avoid async loop conflicts
        pool_recycle=settings.DATABASE_POOL_RECYCLE,
        pool_timeout=settings.DATABASE_POOL_TIMEOUT,
        pool_use_lifo=True,
    )

def recreate_read_only_engine():
    global read_only_engine
    read_only_engine = create_async_engine(
        settings.get_postgres_url(), 
        echo=(settings.LOGLEVEL.upper() == 'DEBUG'),
        pool_size=settings.DATABASE_POOL_SIZE,
        max_overflow=settings.DATABASE_MAX_OVERFLOW,
        pool_pre_ping=False,  # Disable pre-ping to avoid async loop conflicts
        pool_recycle=settings.DATABASE_POOL_RECYCLE,
        pool_timeout=settings.DATABASE_POOL_TIMEOUT,
        pool_use_lifo=True,
        connect_args={
            'server_settings': {
                'default_transaction_isolation': 'serializable',
                'default_transaction_read_only': 'on'
            }
        },
    )
    
def recreate_session():
    global Session
    global engine
    if engine is None:
        recreate_engine()
    # TODO see if this is necessary or if it works
    #Session = scoped_session(async_sessionmaker(bind=engine))
    Session = async_sessionmaker(bind=engine, class_=AsyncSession)


def recreate_read_only_session():
    global ReadOnlySession
    global read_only_engine
    if read_only_engine is None:
        recreate_read_only_engine()
    # TODO see if this is necessary or if it works
    #ReadOnlySession = scoped_session(async_sessionmaker(bind=read_only_engine))
    ReadOnlySession = async_sessionmaker(bind=read_only_engine, class_=AsyncSession)



async def get_session_gen():
    if Session is None:
        recreate_session()

    async with Session() as session:
        yield session

async def get_read_only_session_gen():
    if ReadOnlySession is None:
        recreate_read_only_session()

    async with ReadOnlySession() as session:
        yield session




def get_session():
    if Session is None:
        recreate_session()
    return Session()


def get_read_only_session():
    if ReadOnlySession is None:
        recreate_read_only_session()
    return ReadOnlySession()



@asynccontextmanager
async def session_context():
    async with get_session() as session:
        yield session


@asynccontextmanager
async def read_only_session_context():
    async with get_read_only_session() as session:
        yield session
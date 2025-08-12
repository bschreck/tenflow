from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from tenflow.config import settings
from tenflow.api.v1.api import api_router


app = FastAPI(
    title=settings.APP_NAME,
    openapi_url=f'{settings.API_V1_STR}/openapi.json',
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_allowed_origins(),
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get('/')
def root():
    return {'message': f'Welcome to {settings.APP_NAME} API'}


@app.get('/health')
def health_check():
    return {'status': 'healthy'}

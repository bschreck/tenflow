from fastapi import APIRouter
from tenflow.api.v1.endpoints import auth, users, training_plans

api_router = APIRouter()

api_router.include_router(auth.router, prefix='/auth', tags=['auth'])
api_router.include_router(users.router, prefix='/users', tags=['users'])
api_router.include_router(training_plans.router, prefix='/training-plans', tags=['training-plans'])

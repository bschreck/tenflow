from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select

from tenflow.config import settings
from tenflow.core import security
from tenflow.database import session_context, read_only_session_context
from tenflow.models import User, UserRead

router = APIRouter()


@router.post('/login', response_model=UserRead)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    with read_only_session_context() as session:
        statement = select(User).where(User.email == form_data.username)
        user = session.execute(statement).first()
        if user:
            user_id = user.id
            hashed_password = user.hashed_password
            is_active = user.is_active
    if not user or not security.verify_password(form_data.password, hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Incorrect email or password',
            headers={'WWW-Authenticate': 'Bearer'},
        )
    elif not is_active:
        raise HTTPException(status_code=400, detail='Inactive user')

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(subject=user_id, expires_delta=access_token_expires)
    with session_context() as session:
        session.add(user)
        user.access_token = access_token
        session.add(user)
        session.commit()
        user_read = UserRead.model_validate(user, from_attributes=True)
    return user_read

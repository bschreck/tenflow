from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from tenflow.config import settings
from tenflow.database import get_read_only_session_gen
from tenflow.models import User, TokenPayload

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f'{settings.API_V1_STR}/auth/login')


async def get_current_user(session: Session = Depends(get_read_only_session_gen), token: str = Depends(oauth2_scheme)) -> User:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        token_data = TokenPayload(**payload)
    except (JWTError, ValidationError) as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Could not validate credentials',
        ) from e

    statement = select(User).options(selectinload(User.training_plans)).where(User.id == token_data.sub)
    row = (await session.execute(statement)).first()
    if row is None or len(row) == 0 or not row[0]:
        raise HTTPException(status_code=404, detail='User not found')
    return row[0]


def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active or not current_user.access_token:
        raise HTTPException(status_code=400, detail='Inactive user')
    return current_user


def get_current_active_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="The user doesn't have enough privileges")
    return current_user

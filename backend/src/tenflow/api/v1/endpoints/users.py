from typing import Any
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from tenflow.core import security
from tenflow.core.deps import get_current_active_user, get_current_active_superuser
from tenflow.models import User, UserCreate, UserRead, UserUpdate
from tenflow.database import session_context, read_only_session_context, get_read_only_session_gen

router = APIRouter()


@router.post('/', response_model=UserRead)
def create_user(
    *,
    user_in: UserCreate,
) -> Any:
    with read_only_session_context() as session:
        statement = select(User).where(User.email == user_in.email)
        if session.execute(statement).first():
            raise HTTPException(
                status_code=400,
                detail='The user with this email already exists.',
            )

    with session_context() as session:
        user = User(
            email=user_in.email,
            full_name=user_in.full_name,
            hashed_password=security.get_password_hash(user_in.password),
            is_active=user_in.is_active,
            is_superuser=user_in.is_superuser,
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        user_read = UserRead.model_validate(user, from_attributes=True)
    return user_read


@router.get('/me', response_model=UserRead)
def read_user_me(
    current_user: User = Depends(get_current_active_user),
) -> Any:
    return current_user


@router.put('/me', response_model=UserRead)
def update_user_me(
    *,
    user_in: UserUpdate,
) -> Any:
    """
    Update own user.
    """
    with session_context() as session:
        current_user = get_current_active_user(session=session)
        if user_in.email:
            current_user.email = user_in.email
        if user_in.full_name is not None:
            current_user.full_name = user_in.full_name
        if user_in.password:
            current_user.hashed_password = security.get_password_hash(user_in.password)

        session.add(current_user)
        session.commit()
        session.refresh(current_user)
        user_read = UserRead.model_validate(current_user, from_attributes=True)
    return user_read


@router.get('/{user_id}', response_model=UserRead)
def read_user_by_id(
    user_id: UUID,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_read_only_session_gen)
) -> Any:
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail='The user with this id does not exist.',
        )
    return UserRead.model_validate(user, from_attributes=True)


@router.get('/', response_model=list[UserRead])
def read_users(
    session: Session = Depends(get_read_only_session_gen),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_superuser),
) -> Any:
    statement = select(User).offset(skip).limit(limit)
    users = session.execute(statement).all()
    return [UserRead.model_validate(u, from_attributes=True) for u in users]

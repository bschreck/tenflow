from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from tenflow.core import security
from tenflow.core.deps import get_current_active_user, get_current_active_superuser
from tenflow.database import get_session_gen
from tenflow.models import User, UserCreate, UserRead, UserUpdate

router = APIRouter()


@router.post('/', response_model=UserRead)
def create_user(
    *,
    session: Session = Depends(get_session_gen),
    user_in: UserCreate,
) -> Any:
    """
    Create new user.
    """
    # Check if user already exists
    statement = select(User).where(User.email == user_in.email)
    if session.exec(statement).first():
        raise HTTPException(
            status_code=400,
            detail='The user with this email already exists.',
        )

    # Create user
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
    return user


@router.get('/me', response_model=UserRead)
def read_user_me(
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user


@router.put('/me', response_model=UserRead)
def update_user_me(
    *,
    session: Session = Depends(get_session_gen),
    user_in: UserUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update own user.
    """
    if user_in.email:
        current_user.email = user_in.email
    if user_in.full_name is not None:
        current_user.full_name = user_in.full_name
    if user_in.password:
        current_user.hashed_password = security.get_password_hash(user_in.password)

    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user


@router.get('/{user_id}', response_model=UserRead)
def read_user_by_id(
    user_id: int,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session_gen),
) -> Any:
    """
    Get a specific user by id.
    """
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail='The user with this id does not exist.',
        )
    return user


@router.get('/', response_model=list[UserRead])
def read_users(
    session: Session = Depends(get_session_gen),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_superuser),
) -> Any:
    """
    Retrieve users.
    """
    statement = select(User).offset(skip).limit(limit)
    users = session.exec(statement).all()
    return users

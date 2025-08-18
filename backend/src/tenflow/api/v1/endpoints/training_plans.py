from datetime import datetime
from typing import Any
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select, func

from tenflow.core.deps import get_current_active_user
from tenflow.database import get_session_gen
from tenflow.models import User, TrainingPlan, TrainingPlanCreate, TrainingPlanRead, TrainingPlanUpdate

router = APIRouter()


@router.post('/', response_model=TrainingPlanRead)
def create_training_plan(
    *,
    session: Session = Depends(get_session_gen),
    training_plan_in: TrainingPlanCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Create new training plan.
    """
    training_plan_data = training_plan_in.model_dump()
    training_plan_data['user_id'] = current_user.id  # Ensure user can only create plans for themselves
    training_plan = TrainingPlan.model_validate(training_plan_data)
    session.add(training_plan)
    session.commit()
    session.refresh(training_plan)
    return training_plan


@router.get('/', response_model=list[TrainingPlanRead])
def read_training_plans(
    session: Session = Depends(get_session_gen),
    current_user: User = Depends(get_current_active_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    is_active: bool | None = Query(None),
) -> Any:
    """
    Retrieve training plans for the current user.
    """
    statement = select(TrainingPlan).where(TrainingPlan.user_id == current_user.id)
    
    if is_active is not None:
        statement = statement.where(TrainingPlan.is_active == is_active)
    
    statement = statement.offset(skip).limit(limit).order_by(TrainingPlan.created_at.desc())
    training_plans = session.exec(statement).all()
    return training_plans


@router.get('/{training_plan_id}', response_model=TrainingPlanRead)
def read_training_plan(
    *,
    session: Session = Depends(get_session_gen),
    training_plan_id: UUID,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get training plan by ID.
    """
    training_plan = session.get(TrainingPlan, training_plan_id)
    if not training_plan:
        raise HTTPException(status_code=404, detail='Training plan not found')
    
    # Ensure user can only access their own training plans
    if training_plan.user_id != current_user.id:
        raise HTTPException(status_code=403, detail='Not enough permissions')
    
    return training_plan


@router.put('/{training_plan_id}', response_model=TrainingPlanRead)
def update_training_plan(
    *,
    session: Session = Depends(get_session_gen),
    training_plan_id: UUID,
    training_plan_in: TrainingPlanUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update a training plan.
    """
    training_plan = session.get(TrainingPlan, training_plan_id)
    if not training_plan:
        raise HTTPException(status_code=404, detail='Training plan not found')
    
    # Ensure user can only update their own training plans
    if training_plan.user_id != current_user.id:
        raise HTTPException(status_code=403, detail='Not enough permissions')
    
    training_plan_data = training_plan_in.model_dump(exclude_unset=True)
    for field, value in training_plan_data.items():
        setattr(training_plan, field, value)
    
    training_plan.updated_at = datetime.utcnow()
    session.add(training_plan)
    session.commit()
    session.refresh(training_plan)
    return training_plan


@router.delete('/{training_plan_id}')
def delete_training_plan(
    *,
    session: Session = Depends(get_session_gen),
    training_plan_id: UUID,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Delete a training plan.
    """
    training_plan = session.get(TrainingPlan, training_plan_id)
    if not training_plan:
        raise HTTPException(status_code=404, detail='Training plan not found')
    
    # Ensure user can only delete their own training plans
    if training_plan.user_id != current_user.id:
        raise HTTPException(status_code=403, detail='Not enough permissions')
    
    session.delete(training_plan)
    session.commit()
    return {'message': 'Training plan deleted successfully'}


@router.get('/stats/count')
def get_training_plan_count(
    session: Session = Depends(get_session_gen),
    current_user: User = Depends(get_current_active_user),
    is_active: bool | None = Query(None),
) -> Any:
    """
    Get count of training plans for the current user.
    """
    statement = select(func.count(TrainingPlan.id)).where(TrainingPlan.user_id == current_user.id)
    
    if is_active is not None:
        statement = statement.where(TrainingPlan.is_active == is_active)
    
    count = session.exec(statement).one()
    return {'count': count}

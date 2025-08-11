from typing import Any, List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from tenflow.database import get_session_gen
from tenflow.core.deps import get_current_active_user
from tenflow.models import (
    User, Workflow, WorkflowCreate, WorkflowRead, WorkflowUpdate,
    WorkflowStep, WorkflowStepCreate,
    WorkflowRun, WorkflowRunCreate, WorkflowRunRead, RunStatus
)

router = APIRouter()


@router.post("/", response_model=WorkflowRead)
def create_workflow(
    *,
    session: Session = Depends(get_session_gen),
    workflow_in: WorkflowCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Create new workflow.
    """
    workflow = Workflow(
        name=workflow_in.name,
        description=workflow_in.description,
        status=workflow_in.status,
        configuration=workflow_in.configuration,
        user_id=current_user.id,
    )
    session.add(workflow)
    session.commit()
    session.refresh(workflow)
    
    # Add steps if provided
    for step_data in workflow_in.steps:
        step = WorkflowStep(
            workflow_id=workflow.id,
            name=step_data.name,
            type=step_data.type,
            configuration=step_data.configuration,
            position=step_data.position,
        )
        session.add(step)
    
    session.commit()
    session.refresh(workflow)
    return workflow


@router.get("/", response_model=List[WorkflowRead])
def read_workflows(
    session: Session = Depends(get_session_gen),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Retrieve workflows for current user.
    """
    statement = select(Workflow).where(
        Workflow.user_id == current_user.id
    ).offset(skip).limit(limit)
    workflows = session.exec(statement).all()
    return workflows


@router.get("/{workflow_id}", response_model=WorkflowRead)
def read_workflow(
    workflow_id: int,
    session: Session = Depends(get_session_gen),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get workflow by ID.
    """
    workflow = session.get(Workflow, workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    if workflow.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return workflow


@router.put("/{workflow_id}", response_model=WorkflowRead)
def update_workflow(
    *,
    workflow_id: int,
    session: Session = Depends(get_session_gen),
    workflow_in: WorkflowUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Update workflow.
    """
    workflow = session.get(Workflow, workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    if workflow.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    if workflow_in.name is not None:
        workflow.name = workflow_in.name
    if workflow_in.description is not None:
        workflow.description = workflow_in.description
    if workflow_in.status is not None:
        workflow.status = workflow_in.status
    if workflow_in.configuration is not None:
        workflow.configuration = workflow_in.configuration
    
    workflow.updated_at = datetime.utcnow()
    
    session.add(workflow)
    session.commit()
    session.refresh(workflow)
    return workflow


@router.delete("/{workflow_id}")
def delete_workflow(
    workflow_id: int,
    session: Session = Depends(get_session_gen),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Delete workflow.
    """
    workflow = session.get(Workflow, workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    if workflow.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    session.delete(workflow)
    session.commit()
    return {"message": "Workflow deleted successfully"}


@router.post("/{workflow_id}/run", response_model=WorkflowRunRead)
def run_workflow(
    workflow_id: int,
    session: Session = Depends(get_session_gen),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Execute a workflow.
    """
    workflow = session.get(Workflow, workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    if workflow.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # Create a new run
    run = WorkflowRun(
        workflow_id=workflow_id,
        status=RunStatus.RUNNING,
        started_at=datetime.utcnow(),
    )
    session.add(run)
    session.commit()
    session.refresh(run)
    
    # TODO: Implement actual workflow execution logic here
    # For now, just mark it as successful
    run.status = RunStatus.SUCCESS
    run.completed_at = datetime.utcnow()
    run.logs = [{"timestamp": datetime.utcnow().isoformat(), "message": "Workflow executed successfully"}]
    
    session.add(run)
    session.commit()
    session.refresh(run)
    
    return run


@router.get("/{workflow_id}/runs", response_model=List[WorkflowRunRead])
def read_workflow_runs(
    workflow_id: int,
    session: Session = Depends(get_session_gen),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get workflow execution history.
    """
    workflow = session.get(Workflow, workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    if workflow.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    statement = select(WorkflowRun).where(
        WorkflowRun.workflow_id == workflow_id
    ).offset(skip).limit(limit).order_by(WorkflowRun.created_at.desc())
    
    runs = session.exec(statement).all()
    return runs

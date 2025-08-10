from typing import Optional, List, Dict, Any
from datetime import datetime, date
from uuid import UUID, uuid4
from decimal import Decimal
from sqlmodel import Field, SQLModel, Relationship, Column, JSON
import enum


# Enums
class WorkflowStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    ARCHIVED = "archived"


class RunStatus(str, enum.Enum):
    PENDING = "pending"
    RUNNING = "running"
    SUCCESS = "success"
    FAILED = "failed"
    CANCELLED = "cancelled"


# User Models
class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    username: str = Field(unique=True, index=True)
    full_name: Optional[str] = None
    is_active: bool = True
    is_superuser: bool = False


class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    
    # Relationships
    workflows: List["Workflow"] = Relationship(back_populates="user")


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None


class UserUpdate(SQLModel):
    email: Optional[str] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None


# Workflow Step Models
class WorkflowStepBase(SQLModel):
    name: str
    type: str  # e.g., "trigger", "action", "condition"
    configuration: Dict[str, Any] = Field(default={}, sa_column=Column(JSON))
    position: int


class WorkflowStep(WorkflowStepBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    workflow_id: int = Field(foreign_key="workflow.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    
    # Relationships
    workflow: Optional["Workflow"] = Relationship(back_populates="steps")


class WorkflowStepCreate(WorkflowStepBase):
    pass


class WorkflowStepRead(WorkflowStepBase):
    id: int
    workflow_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None


class WorkflowStepUpdate(SQLModel):
    name: Optional[str] = None
    type: Optional[str] = None
    configuration: Optional[Dict[str, Any]] = None
    position: Optional[int] = None


# Workflow Models
class WorkflowBase(SQLModel):
    name: str
    description: Optional[str] = None
    status: WorkflowStatus = WorkflowStatus.DRAFT
    configuration: Dict[str, Any] = Field(default={}, sa_column=Column(JSON))


class Workflow(WorkflowBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    
    # Relationships
    user: Optional[User] = Relationship(back_populates="workflows")
    steps: List[WorkflowStep] = Relationship(back_populates="workflow")
    runs: List["WorkflowRun"] = Relationship(back_populates="workflow")


class WorkflowCreate(WorkflowBase):
    steps: List[WorkflowStepCreate] = []


class WorkflowRead(WorkflowBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    steps: List[WorkflowStepRead] = []


class WorkflowUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[WorkflowStatus] = None
    configuration: Optional[Dict[str, Any]] = None


# Workflow Run Models
class WorkflowRunBase(SQLModel):
    workflow_id: int
    status: RunStatus = RunStatus.PENDING
    error_message: Optional[str] = None
    logs: List[Dict[str, Any]] = Field(default=[], sa_column=Column(JSON))


class WorkflowRun(WorkflowRunBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    workflow_id: int = Field(foreign_key="workflow.id")
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    workflow: Optional[Workflow] = Relationship(back_populates="runs")


class WorkflowRunCreate(SQLModel):
    workflow_id: int


class WorkflowRunRead(WorkflowRunBase):
    id: int
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime


# Auth Models
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(SQLModel):
    sub: Optional[int] = None


# ============================
# Lovable/Supabase demo models
# ============================


class ComplianceScore(SQLModel, table=True):
    __tablename__ = "compliance_scores"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(index=True)
    week_start: date

    workout_compliance: Optional[Decimal] = Field(default=Decimal(0))
    intensity_compliance: Optional[Decimal] = Field(default=Decimal(0))
    recovery_compliance: Optional[Decimal] = Field(default=Decimal(0))
    overall_compliance: Optional[Decimal] = Field(default=Decimal(0))

    activities_prescribed: Optional[int] = Field(default=0)
    activities_completed: Optional[int] = Field(default=0)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class TrainingPlanBase(SQLModel):
    user_id: UUID
    goal: str
    plan_name: str
    start_date: date
    end_date: date
    duration_weeks: int
    fitness_level: str
    weekly_distance_base: Decimal
    weekly_distance_peak: Decimal
    training_days_per_week: int
    plan_data: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    is_active: bool = True


class TrainingPlan(TrainingPlanBase, table=True):
    __tablename__ = "training_plans"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    prescribed_workouts: List["PrescribedWorkout"] = Relationship(back_populates="training_plan")


class PrescribedWorkoutBase(SQLModel):
    training_plan_id: UUID = Field(foreign_key="training_plans.id")
    user_id: UUID
    workout_date: date
    workout_type: str
    distance: Optional[Decimal] = None
    duration_minutes: Optional[int] = None
    intensity_zone: Optional[str] = None
    rpe_target: Optional[int] = None
    workout_description: Optional[str] = None
    workout_data: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    is_completed: bool = False


class PrescribedWorkout(PrescribedWorkoutBase, table=True):
    __tablename__ = "prescribed_workouts"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    training_plan: Optional[TrainingPlan] = Relationship(back_populates="prescribed_workouts")


class Profile(SQLModel, table=True):
    __tablename__ = "profiles"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(unique=True, index=True)
    email: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class StravaConnection(SQLModel, table=True):
    __tablename__ = "strava_connections"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(unique=True, index=True)
    strava_user_id: str
    access_token: str
    refresh_token: str
    expires_at: datetime
    athlete_data: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    connected_at: datetime = Field(default_factory=datetime.utcnow)
    last_sync: Optional[datetime] = None


class Subscriber(SQLModel, table=True):
    __tablename__ = "subscribers"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(unique=True, index=True)
    email: Optional[str] = None
    stripe_customer_id: Optional[str] = None
    subscribed: Optional[bool] = Field(default=False)
    subscription_tier: Optional[str] = Field(default="free")
    subscription_end: Optional[datetime] = None
    stripe_subscription_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class TrainingActivity(SQLModel, table=True):
    __tablename__ = "training_activities"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(index=True)
    strava_activity_id: Optional[str] = None
    name: str
    activity_type: str
    prescribed_workout: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    actual_workout: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    compliance_score: Optional[Decimal] = None
    distance: Optional[Decimal] = None
    moving_time: Optional[int] = None
    elapsed_time: Optional[int] = None
    total_elevation_gain: Optional[Decimal] = None
    start_date: datetime
    average_heartrate: Optional[int] = None
    max_heartrate: Optional[int] = None
    rpe_prescribed: Optional[int] = None
    rpe_actual: Optional[int] = None
    activity_data: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)

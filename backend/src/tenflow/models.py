from typing import Optional, Any
from datetime import datetime, date
from uuid import UUID, uuid4
from decimal import Decimal
from sqlmodel import Field, SQLModel, Relationship, Column, JSON
import enum


# User Models
class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    full_name: str | None = None
    is_active: bool = True
    is_superuser: bool = False


class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime | None = None


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime | None = None


class UserUpdate(SQLModel):
    email: str | None = None
    full_name: str | None = None
    password: str | None = None
    is_active: bool | None = None
    is_superuser: bool | None = None


# Auth Models
class Token(SQLModel):
    access_token: str
    token_type: str = 'bearer'


class TokenPayload(SQLModel):
    sub: int | None = None


# ============================
# Lovable/Supabase demo models
# ============================


class ComplianceScore(SQLModel, table=True):
    __tablename__ = 'compliance_scores'

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(index=True)
    week_start: date

    workout_compliance: Decimal | None = Field(default=Decimal(0))
    intensity_compliance: Decimal | None = Field(default=Decimal(0))
    recovery_compliance: Decimal | None = Field(default=Decimal(0))
    overall_compliance: Decimal | None = Field(default=Decimal(0))

    activities_prescribed: int | None = Field(default=0)
    activities_completed: int | None = Field(default=0)

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
    plan_data: dict[str, Any] | None = Field(default=None, sa_column=Column(JSON))
    is_active: bool = True


class TrainingPlan(TrainingPlanBase, table=True):
    __tablename__ = 'training_plans'

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    prescribed_workouts: list['PrescribedWorkout'] = Relationship(back_populates='training_plan')


class PrescribedWorkoutBase(SQLModel):
    training_plan_id: UUID = Field(foreign_key='training_plans.id')
    user_id: UUID
    workout_date: date
    workout_type: str
    distance: Decimal | None = None
    duration_minutes: int | None = None
    intensity_zone: str | None = None
    rpe_target: int | None = None
    workout_description: str | None = None
    workout_data: dict[str, Any] | None = Field(default=None, sa_column=Column(JSON))
    is_completed: bool = False


class PrescribedWorkout(PrescribedWorkoutBase, table=True):
    __tablename__ = 'prescribed_workouts'

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    training_plan: TrainingPlan | None = Relationship(back_populates='prescribed_workouts')


class Profile(SQLModel, table=True):
    __tablename__ = 'profiles'

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(unique=True, index=True)
    email: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class StravaConnection(SQLModel, table=True):
    __tablename__ = 'strava_connections'

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(unique=True, index=True)
    strava_user_id: str
    access_token: str
    refresh_token: str
    expires_at: datetime
    athlete_data: dict[str, Any] | None = Field(default=None, sa_column=Column(JSON))
    connected_at: datetime = Field(default_factory=datetime.utcnow)
    last_sync: datetime | None = None


class Subscriber(SQLModel, table=True):
    __tablename__ = 'subscribers'

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(unique=True, index=True)
    email: str | None = None
    stripe_customer_id: str | None = None
    subscribed: bool | None = Field(default=False)
    subscription_tier: str | None = Field(default='free')
    subscription_end: datetime | None = None
    stripe_subscription_id: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class TrainingActivity(SQLModel, table=True):
    __tablename__ = 'training_activities'

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(index=True)
    strava_activity_id: str | None = None
    name: str
    activity_type: str
    prescribed_workout: dict[str, Any] | None = Field(default=None, sa_column=Column(JSON))
    actual_workout: dict[str, Any] | None = Field(default=None, sa_column=Column(JSON))
    compliance_score: Decimal | None = None
    distance: Decimal | None = None
    moving_time: int | None = None
    elapsed_time: int | None = None
    total_elevation_gain: Decimal | None = None
    start_date: datetime
    average_heartrate: int | None = None
    max_heartrate: int | None = None
    rpe_prescribed: int | None = None
    rpe_actual: int | None = None
    activity_data: dict[str, Any] | None = Field(default=None, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)

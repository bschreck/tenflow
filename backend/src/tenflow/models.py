from typing import Any
from datetime import datetime, date
import datetime as dt 
from uuid import UUID, uuid4
from decimal import Decimal
from sqlalchemy import (
    String, 
    Boolean, 
    DateTime, 
    Date, 
    UUID as SAUUID, 
    ForeignKey, 
    Integer,
    Enum,
    Numeric
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import MappedAsDataclass, Mapped, mapped_column, relationship, DeclarativeBase
from pydantic import BaseModel
from enum import StrEnum

class Base(MappedAsDataclass, DeclarativeBase):
    pass

class User(Base):
    __tablename__ = 'users'
    email: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    full_name: Mapped[str | None] = mapped_column(String(50))
    hashed_password: Mapped[str] = mapped_column(String(255))
    id: Mapped[UUID] = mapped_column(SAUUID(), primary_key=True, default_factory=uuid4)
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True)
    is_superuser: Mapped[bool] = mapped_column(Boolean(), default=False)
    access_token: Mapped[str | None] = mapped_column(String(255), default=None)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default_factory=lambda: dt.datetime.now(dt.UTC))
    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), default_factory=lambda: dt.datetime.now(dt.UTC))

    compliance_scores: Mapped[list["ComplianceScore"]] = relationship(
        back_populates="user", cascade="all, delete-orphan",
        default_factory=list
    )
    training_plans: Mapped[list["TrainingPlan"]] = relationship(
        back_populates="user", cascade="all, delete-orphan",
        default_factory=list
    )
    prescribed_workouts: Mapped[list['PrescribedWorkout']] = relationship(
        back_populates='user',
        cascade="all, delete-orphan",
        default_factory=list
    )
    strava_connections: Mapped[list["StravaConnection"]] = relationship(
        back_populates="user", cascade="all, delete-orphan",
        default_factory=list
    )
    training_activities: Mapped[list["TrainingActivity"]] = relationship(
        back_populates="user", cascade="all, delete-orphan",
        default_factory=list
    )

class UserBase(BaseModel):
    id: UUID | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
    training_plans: list['TrainingPlanRead'] = []
    email: str | None = None
    full_name: str | None = None
    access_token: str | None = None
    is_active: bool = True
    is_superuser: bool = False

class UserRead(UserBase):
    id: UUID
    email: str
    full_name: str
    created_at: datetime
    updated_at: datetime
    access_token: str

class UserCreate(UserBase):
    password: str
    email: str
    full_name: str
    created_at: datetime
    updated_at: datetime


class UserPublicUpdate(UserBase):
    email: str | None = None
    full_name: str | None = None
    password: str | None = None

class UserUpdate(UserPublicUpdate):
    is_active: bool | None = None
    is_superuser: bool | None = None


# Auth Models
class Token(BaseModel):
    access_token: str
    token_type: str = 'bearer'


class TokenPayload(BaseModel):
    sub: UUID | None = None


class ComplianceScore(Base):
    __tablename__ = 'compliance_scores'

    user_id: Mapped[UUID] = mapped_column(ForeignKey('users.id'), init=False)
    week_start: Mapped[dt.date] = mapped_column(Date())

    id: Mapped[UUID] = mapped_column(SAUUID(), default_factory=uuid4, primary_key=True)

    workout_compliance: Mapped[Decimal | None] = mapped_column(Numeric(), default=Decimal(0))
    intensity_compliance: Mapped[Decimal | None] = mapped_column(Numeric(), default=Decimal(0))
    recovery_compliance: Mapped[Decimal | None] = mapped_column(Numeric(), default=Decimal(0))
    overall_compliance: Mapped[Decimal | None] = mapped_column(Numeric(), default=Decimal(0))

    activities_prescribed: Mapped[int | None] = mapped_column(Integer(), default=0)
    activities_completed: Mapped[int | None] = mapped_column(Integer(), default=0)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default_factory=lambda: dt.datetime.now(dt.UTC))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default_factory=lambda: dt.datetime.now(dt.UTC))

    user: Mapped["User"] = relationship(back_populates="compliance_scores", default=None)


class TrainingPlan(Base):
    __tablename__ = 'training_plans'
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), init=False)
    
    goal: Mapped[str] = mapped_column(String(50))
    plan_name: Mapped[str] = mapped_column(String(50))
    start_date: Mapped[dt.date] = mapped_column(Date())
    end_date: Mapped[dt.date] = mapped_column(Date())
    duration_weeks: Mapped[int] = mapped_column(Integer())
    fitness_level: Mapped[str] = mapped_column(String(50))
    weekly_distance_base: Mapped[Decimal] = mapped_column(Numeric())
    weekly_distance_peak: Mapped[Decimal] = mapped_column(Numeric())
    training_days_per_week: Mapped[int] = mapped_column(Integer())
    plan_data: Mapped[dict[str, Any] | None] = mapped_column(JSONB())

    user: Mapped["User"] = relationship(back_populates="training_plans", default=None)
    prescribed_workouts: Mapped[list['PrescribedWorkout']] = relationship(
        back_populates='training_plan',
        cascade="all, delete-orphan",
        default_factory=list
    )

    id: Mapped[UUID] = mapped_column(SAUUID(), primary_key=True, default_factory=uuid4)
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default_factory=lambda: dt.datetime.now(dt.UTC))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default_factory=lambda: dt.datetime.now(dt.UTC))


class TrainingPlanBase(BaseModel):
    id: UUID | None = None
    goal: str
    plan_name: str
    start_date: date
    end_date: date
    duration_weeks: int
    fitness_level: str
    weekly_distance_base: Decimal
    weekly_distance_peak: Decimal
    training_days_per_week: int
    plan_data: dict[str, Any] | None = None
    is_active: bool = True
    created_at: datetime | None = None
    updated_at: datetime | None = None

class TrainingPlanCreate(TrainingPlanBase):
    pass

class TrainingPlanRead(TrainingPlanBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

class TrainingPlanUpdate(TrainingPlanBase):
    id: UUID
    goal: str | None = None
    plan_name: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    duration_weeks: int | None = None
    fitness_level: str | None = None
    weekly_distance_base: Decimal | None = None
    weekly_distance_peak: Decimal | None = None
    training_days_per_week: int | None = None
    plan_data: dict[str, Any] | None = None
    is_active: bool | None = None


class WorkoutTimeOfDay(StrEnum):
    MORNING = 'morning'
    AFTERNOON = 'afternoon'
    
class IntensityZone(StrEnum):
    Z1 = 'z1'
    Z2 = 'z2'
    Z3 = 'z3'
    Z4 = 'z4'
    Z5 = 'z5'

class PrescribedWorkout(Base):
    __tablename__ = 'prescribed_workouts'
    training_plan_id: Mapped[UUID] = mapped_column(ForeignKey("training_plans.id"), init=False)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), init=False)
    workout_date: Mapped[dt.date] = mapped_column(Date())
    workout_time: Mapped[WorkoutTimeOfDay] = mapped_column(Enum('morning', 'afternoon', name='WorkoutTimeOfDay'))
    workout_type: Mapped[str] = mapped_column(String(50))
    distance: Mapped[Decimal] = mapped_column(Numeric())
    duration_minutes: Mapped[int | None] = mapped_column(Integer())
    intensity_zone: Mapped[IntensityZone | None] = mapped_column(Enum(*[f'z{i}' for i in range(1,6)], name='IntensityZone'))
    rpe_target: Mapped[int | None] = mapped_column(Integer())
    workout_description: Mapped[str | None] = mapped_column(String(1000))

    user: Mapped[User] = relationship(back_populates='prescribed_workouts', default=None)
    training_plan: Mapped[TrainingPlan | None] = relationship(back_populates='prescribed_workouts', default=None)
    training_activities: Mapped[list["TrainingActivity"]] = relationship(
        back_populates="prescribed_workout", cascade="all, delete-orphan",
        default_factory=list
    )

    id: Mapped[UUID] = mapped_column(SAUUID(), primary_key=True, default_factory=uuid4)
    workout_data: Mapped[dict[str, Any] | None] = mapped_column(JSONB(), default=None)
    is_completed: Mapped[bool] = mapped_column(Boolean(), default=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default_factory=lambda: dt.datetime.now(dt.UTC))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default_factory=lambda: dt.datetime.now(dt.UTC))

class PrescribedWorkoutBase(BaseModel):
    id: UUID | None = None
    training_plan_id: UUID
    user_id: UUID
    workout_date: dt.date
    workout_time: WorkoutTimeOfDay
    workout_type: str
    distance: Decimal
    duration_minutes: int | None = None
    intensity_zone: IntensityZone | None = None
    rpe_target: int | None = None
    workout_description: str | None = None
    workout_data: dict[str, Any] | None = None
    is_completed: bool = False

    created_at: datetime | None = None
    updated_at: datetime | None = None

class PrescribedWorkoutCreate(PrescribedWorkoutBase):
    pass

class PrescribedWorkoutRead(PrescribedWorkoutBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

class PrescribedWorkoutUpdate(PrescribedWorkoutBase):
    id: UUID
    training_plan_id: UUID | None = None
    user_id: UUID | None = None
    workout_date: dt.date | None = None
    workout_time: WorkoutTimeOfDay | None = None
    workout_type: str | None = None
    distance: Decimal | None = None
    is_completed: bool | None = None


class StravaConnection(Base):
    __tablename__ = 'strava_connections'

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), init=False)
    strava_user_id: Mapped[str] = mapped_column(String(50))
    access_token: Mapped[str] = mapped_column(String(50))
    refresh_token: Mapped[str] = mapped_column(String(50))
    expires_at: Mapped[dt.datetime] = mapped_column(DateTime(timezone=True))
    athlete_data: Mapped[dict[str, Any] | None] = mapped_column(JSONB())

    user: Mapped["User"] = relationship(back_populates="strava_connections", default=None)
    id: Mapped[UUID] = mapped_column(SAUUID(), primary_key=True, default_factory=uuid4)
    connected_at: Mapped[dt.datetime] = mapped_column(DateTime(timezone=True), default_factory=lambda: dt.datetime.now(dt.UTC))
    last_sync: Mapped[dt.datetime | None] = mapped_column(DateTime(timezone=True), default=None)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default_factory=lambda: dt.datetime.now(dt.UTC))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default_factory=lambda: dt.datetime.now(dt.UTC))

class TrainingActivity(Base):
    __tablename__ = 'training_activities'

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), init=False)

    name: Mapped[str] = mapped_column(String(1000))
    activity_type: Mapped[str] = mapped_column(String(50))

    prescribed_workout_id: Mapped[UUID] = mapped_column(ForeignKey("prescribed_workouts.id"), init=False)

    actual_workout: Mapped[dict[str, Any] | None] = mapped_column(JSONB())
    activity_data: Mapped[dict[str, Any] | None] = mapped_column(JSONB())
    start_date: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    id: Mapped[UUID] = mapped_column(SAUUID(), primary_key=True, default_factory=uuid4)
    strava_activity_id: Mapped[str | None] = mapped_column(String(50), default=None)
    distance: Mapped[Decimal | None] = mapped_column(Numeric(), default=None)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default_factory=lambda: dt.datetime.now(dt.UTC))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default_factory=lambda: dt.datetime.now(dt.UTC))
    compliance_score: Mapped[Decimal | None] = mapped_column(Numeric(), default=None)
    moving_time: Mapped[int | None] = mapped_column(Integer(), default=None)
    elapsed_time: Mapped[int | None] = mapped_column(Integer(), default=None)
    total_elevation_gain: Mapped[Decimal | None] = mapped_column(Numeric(), default=None)
    average_heartrate: Mapped[int | None] = mapped_column(Integer(), default=None)
    max_heartrate: Mapped[int | None] = mapped_column(Integer(), default=None)
    rpe_prescribed: Mapped[int | None] = mapped_column(Integer(), default=None)
    rpe_actual: Mapped[int | None] = mapped_column(Integer(), default=None)

    user: Mapped["User"] = relationship(back_populates="training_activities", default=None)
    prescribed_workout: Mapped["PrescribedWorkout"] = relationship(
        back_populates="training_activities", default_factory=list
    )

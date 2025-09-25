import pytest
from datetime import date, timedelta
from decimal import Decimal
from httpx import AsyncClient
from uuid import uuid4

from tenflow.core import security
from tenflow.models import User, TrainingPlan


@pytest.fixture
async def test_user_with_training_plans_id(session):
    """Create a test user with some training plans."""
    # Create user with unique email
    unique_email = f"testuser-{uuid4().hex[:8]}@example.com"
    user_id = uuid4()
    user = User(
        id=user_id,
        email=unique_email,
        full_name="Test User",
        hashed_password=security.get_password_hash("testpassword"),
        access_token=security.create_access_token(subject=user_id),
        is_active=True,
        is_superuser=False,
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    
    # Create some training plans for the user
    training_plan_1 = TrainingPlan(
        user=user,
        goal="Marathon Training",
        plan_name="16-Week Marathon Plan",
        start_date=date.today(),
        end_date=date.today() + timedelta(weeks=16),
        duration_weeks=16,
        fitness_level="intermediate",
        weekly_distance_base=Decimal("50.0"),
        weekly_distance_peak=Decimal("80.0"),
        training_days_per_week=5,
        plan_data={"test": "data"},
        is_active=True,
    )
    
    training_plan_2 = TrainingPlan(
        user=user,
        goal="5K Training",
        plan_name="8-Week 5K Plan",
        start_date=date.today() + timedelta(weeks=20),
        end_date=date.today() + timedelta(weeks=28),
        duration_weeks=8,
        fitness_level="beginner",
        weekly_distance_base=Decimal("20.0"),
        weekly_distance_peak=Decimal("30.0"),
        training_days_per_week=3,
        plan_data={"test": "data2"},
        is_active=True,
    )
    
    session.add(training_plan_1)
    session.add(training_plan_2)
    await session.commit()
    await session.refresh(training_plan_1)
    await session.refresh(training_plan_2)
    
    # Return just the user ID to avoid session issues
    return user_id


@pytest.fixture
async def auth_headers_for_user_with_plans(test_user_with_training_plans_id):
    """Create authentication headers for the test user with training plans."""
    access_token = security.create_access_token(subject=test_user_with_training_plans_id)
    return {"Authorization": f"Bearer {access_token}"}


async def test_get_user_me_includes_training_plans(
    async_client: AsyncClient, auth_headers_for_user_with_plans
):
    """Test that GET /users/me returns the user with their training plans."""
    response = await async_client.get(
        "/api/v1/users/me",
        headers=auth_headers_for_user_with_plans
    )
    
    assert response.status_code == 200
    result = response.json()
    
    # Check user fields
    assert "id" in result
    assert "email" in result
    assert "full_name" in result
    assert "is_active" in result
    assert "created_at" in result
    
    # Check training plans are included
    assert "training_plans" in result
    assert isinstance(result["training_plans"], list)
    assert len(result["training_plans"]) == 2
    
    # Check training plan structure
    training_plans = result["training_plans"]
    plan_names = [plan["plan_name"] for plan in training_plans]
    assert "16-Week Marathon Plan" in plan_names
    assert "8-Week 5K Plan" in plan_names
    
    # Check training plan fields
    for plan in training_plans:
        assert "id" in plan
        assert "goal" in plan
        assert "plan_name" in plan
        assert "start_date" in plan
        assert "end_date" in plan
        assert "duration_weeks" in plan
        assert "fitness_level" in plan
        assert "weekly_distance_base" in plan
        assert "weekly_distance_peak" in plan
        assert "training_days_per_week" in plan
        assert "is_active" in plan
        assert "created_at" in plan
        assert "updated_at" in plan

async def test_get_user_me_empty_training_plans(
    async_client: AsyncClient, session
):
    """Test that GET /users/me works for users with no training plans."""
    # Create user with unique email and no training plans
    unique_email = f"testuser-{uuid4().hex[:8]}@example.com"
    user_id = uuid4()
    user = User(
        id=user_id,
        email=unique_email,
        full_name="Test User No Plans",
        hashed_password=security.get_password_hash("testpassword"),
        access_token=security.create_access_token(subject=user_id),
        is_active=True,
        is_superuser=False,
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    
    # Create auth headers
    access_token = security.create_access_token(subject=user_id)
    auth_headers = {"Authorization": f"Bearer {access_token}"}
    
    response = await async_client.get(
        "/api/v1/users/me",
        headers=auth_headers
    )
    
    assert response.status_code == 200
    result = response.json()
    
    # Check user fields
    assert "id" in result
    assert "email" in result
    assert result["email"] == unique_email
    
    # Check training plans are included but empty
    assert "training_plans" in result
    assert isinstance(result["training_plans"], list)
    assert len(result["training_plans"]) == 0

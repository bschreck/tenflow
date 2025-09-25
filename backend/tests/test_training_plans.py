import pytest
from datetime import date, timedelta
from decimal import Decimal
from httpx import AsyncClient
from uuid import uuid4

from tenflow.core import security
from tenflow.models import User, TrainingPlan


@pytest.fixture
async def test_user(session):
    """Create a test user for authentication."""
    # Use unique email to avoid conflicts across test workers
    unique_email = f"testuser-{uuid4().hex[:8]}@example.com"
    user = User(
        email=unique_email,
        full_name="Test User",
        hashed_password=security.get_password_hash("testpassword"),
        is_active=True,
        is_superuser=False,
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@pytest.fixture
async def auth_headers(test_user):
    """Create authentication headers for the test user."""
    access_token = security.create_access_token(subject=test_user.id)
    return {"Authorization": f"Bearer {access_token}"}


@pytest.fixture
async def sample_training_plan_data(test_user):
    """Sample training plan data for testing."""
    return {
        "user_id": str(test_user.id),
        "goal": "Marathon Training",
        "plan_name": "16-Week Marathon Plan",
        "start_date": str(date.today()),
        "end_date": str(date.today() + timedelta(weeks=16)),
        "duration_weeks": 16,
        "fitness_level": "intermediate",
        "weekly_distance_base": "50.0",
        "weekly_distance_peak": "80.0",
        "training_days_per_week": 5,
        "plan_data": {
            "weeks": [
                {"week": 1, "distance": 50, "workouts": ["easy", "tempo", "long"]},
                {"week": 2, "distance": 55, "workouts": ["easy", "intervals", "long"]}
            ]
        },
        "is_active": True
    }


@pytest.fixture
async def created_training_plan(session, test_user):
    """Create a training plan in the database for testing."""
    training_plan = TrainingPlan(
        user_id=test_user.id,
        goal="Test Marathon Training",
        plan_name="Test 16-Week Marathon Plan",
        start_date=date.today(),
        end_date=date.today() + timedelta(weeks=16),
        duration_weeks=16,
        fitness_level="intermediate",
        weekly_distance_base=Decimal("50.0"),
        weekly_distance_peak=Decimal("80.0"),
        training_days_per_week=5,
        plan_data={"test": "data"},
        is_active=True
    )
    session.add(training_plan)
    session.commit()
    session.refresh(training_plan)
    return training_plan


# Create Training Plan Tests

async def test_create_training_plan_success(
    async_client: AsyncClient, auth_headers, sample_training_plan_data
):
    """Test successful creation of a training plan."""
    # Remove user_id from data as it should be set from the authenticated user
    data = sample_training_plan_data.copy()
    del data["user_id"]
    
    response = await async_client.post(
        "/api/v1/training-plans/",
        json=data,
        headers=auth_headers
    )
    
    assert response.status_code == 200
    result = response.json()
    
    assert result["goal"] == data["goal"]
    assert result["plan_name"] == data["plan_name"]
    assert result["duration_weeks"] == data["duration_weeks"]
    assert result["fitness_level"] == data["fitness_level"]
    assert result["weekly_distance_base"] == data["weekly_distance_base"]
    assert result["weekly_distance_peak"] == data["weekly_distance_peak"]
    assert result["training_days_per_week"] == data["training_days_per_week"]
    assert result["plan_data"] == data["plan_data"]
    assert result["is_active"] == data["is_active"]
    assert "id" in result
    assert "created_at" in result
    assert "updated_at" in result


async def test_create_training_plan_unauthorized(
    async_client: AsyncClient, sample_training_plan_data
):
    """Test creating a training plan without authentication."""
    data = sample_training_plan_data.copy()
    del data["user_id"]
    
    response = await async_client.post(
        "/api/v1/training-plans/",
        json=data
    )
    
    assert response.status_code == 401


async def test_create_training_plan_invalid_data(
    async_client: AsyncClient, auth_headers
):
    """Test creating a training plan with invalid data."""
    invalid_data = {
        "goal": "",  # Empty goal
        "plan_name": "",  # Empty plan name
        # Missing required fields
    }
    
    response = await async_client.post(
        "/api/v1/training-plans/",
        json=invalid_data,
        headers=auth_headers
    )
    
    assert response.status_code == 422


# Read Training Plans Tests

async def test_read_training_plans_success(
    async_client: AsyncClient, auth_headers, created_training_plan
):
    """Test successful retrieval of training plans."""
    response = await async_client.get(
        "/api/v1/training-plans/",
        headers=auth_headers
    )
    
    assert response.status_code == 200
    result = response.json()
    
    assert isinstance(result, list)
    assert len(result) >= 1
    
    # Check the created training plan is in the results
    plan_ids = [plan["id"] for plan in result]
    assert str(created_training_plan.id) in plan_ids


async def test_read_training_plans_with_pagination(
    async_client: AsyncClient, auth_headers, created_training_plan
):
    """Test training plans retrieval with pagination."""
    response = await async_client.get(
        "/api/v1/training-plans/?skip=0&limit=10",
        headers=auth_headers
    )
    
    assert response.status_code == 200
    result = response.json()
    assert isinstance(result, list)
    assert len(result) <= 10


async def test_read_training_plans_filter_active(
    async_client: AsyncClient, auth_headers, created_training_plan
):
    """Test training plans retrieval with is_active filter."""
    response = await async_client.get(
        "/api/v1/training-plans/?is_active=true",
        headers=auth_headers
    )
    
    assert response.status_code == 200
    result = response.json()
    
    # All returned plans should be active
    for plan in result:
        assert plan["is_active"] is True


async def test_read_training_plans_unauthorized(
    async_client: AsyncClient
):
    """Test retrieving training plans without authentication."""
    response = await async_client.get("/api/v1/training-plans/")
    assert response.status_code == 401


# Read Single Training Plan Tests

async def test_read_training_plan_success(
    async_client: AsyncClient, auth_headers, created_training_plan
):
    """Test successful retrieval of a specific training plan."""
    response = await async_client.get(
        f"/api/v1/training-plans/{created_training_plan.id}",
        headers=auth_headers
    )
    
    assert response.status_code == 200
    result = response.json()
    
    assert result["id"] == str(created_training_plan.id)
    assert result["goal"] == created_training_plan.goal
    assert result["plan_name"] == created_training_plan.plan_name


async def test_read_training_plan_not_found(
    async_client: AsyncClient, auth_headers
):
    """Test retrieving a non-existent training plan."""
    fake_id = uuid4()
    response = await async_client.get(
        f"/api/v1/training-plans/{fake_id}",
        headers=auth_headers
    )
    
    assert response.status_code == 404
    assert "Training plan not found" in response.json()["detail"]


async def test_read_training_plan_unauthorized(
    async_client: AsyncClient, created_training_plan
):
    """Test retrieving a training plan without authentication."""
    response = await async_client.get(
        f"/api/v1/training-plans/{created_training_plan.id}"
    )
    assert response.status_code == 401


async def test_read_training_plan_forbidden(
    async_client: AsyncClient, session, created_training_plan
):
    """Test retrieving another user's training plan."""
    # Create another user with unique email
    unique_email = f"otheruser-{uuid4().hex[:8]}@example.com"
    other_user = User(
        email=unique_email,
        full_name="Other User",
        hashed_password=security.get_password_hash("password"),
        is_active=True,
    )
    session.add(other_user)
    session.commit()
    session.refresh(other_user)
    
    # Create auth headers for the other user
    access_token = security.create_access_token(subject=other_user.id)
    other_auth_headers = {"Authorization": f"Bearer {access_token}"}
    
    response = await async_client.get(
        f"/api/v1/training-plans/{created_training_plan.id}",
        headers=other_auth_headers
    )
    
    assert response.status_code == 403
    assert "Not enough permissions" in response.json()["detail"]


# Update Training Plan Tests

async def test_update_training_plan_success(
    async_client: AsyncClient, auth_headers, created_training_plan
):
    """Test successful update of a training plan."""
    update_data = {
        "goal": "Updated Marathon Training",
        "plan_name": "Updated 16-Week Marathon Plan",
        "fitness_level": "advanced"
    }
    
    response = await async_client.put(
        f"/api/v1/training-plans/{created_training_plan.id}",
        json=update_data,
        headers=auth_headers
    )
    
    assert response.status_code == 200
    result = response.json()
    
    assert result["goal"] == update_data["goal"]
    assert result["plan_name"] == update_data["plan_name"]
    assert result["fitness_level"] == update_data["fitness_level"]
    assert result["updated_at"] != result["created_at"]


async def test_update_training_plan_partial(
    async_client: AsyncClient, auth_headers, created_training_plan
):
    """Test partial update of a training plan."""
    update_data = {"goal": "Partial Update Goal"}
    
    response = await async_client.put(
        f"/api/v1/training-plans/{created_training_plan.id}",
        json=update_data,
        headers=auth_headers
    )
    
    assert response.status_code == 200
    result = response.json()
    
    assert result["goal"] == update_data["goal"]
    # Other fields should remain unchanged
    assert result["plan_name"] == created_training_plan.plan_name


async def test_update_training_plan_not_found(
    async_client: AsyncClient, auth_headers
):
    """Test updating a non-existent training plan."""
    fake_id = uuid4()
    update_data = {"goal": "Updated Goal"}
    
    response = await async_client.put(
        f"/api/v1/training-plans/{fake_id}",
        json=update_data,
        headers=auth_headers
    )
    
    assert response.status_code == 404
    assert "Training plan not found" in response.json()["detail"]


async def test_update_training_plan_unauthorized(
    async_client: AsyncClient, created_training_plan
):
    """Test updating a training plan without authentication."""
    update_data = {"goal": "Updated Goal"}
    
    response = await async_client.put(
        f"/api/v1/training-plans/{created_training_plan.id}",
        json=update_data
    )
    
    assert response.status_code == 401


# Delete Training Plan Tests

async def test_delete_training_plan_success(
    async_client: AsyncClient, auth_headers, created_training_plan
):
    """Test successful deletion of a training plan."""
    response = await async_client.delete(
        f"/api/v1/training-plans/{created_training_plan.id}",
        headers=auth_headers
    )
    
    assert response.status_code == 200
    result = response.json()
    assert "Training plan deleted successfully" in result["message"]
    
    # Verify the plan is deleted
    get_response = await async_client.get(
        f"/api/v1/training-plans/{created_training_plan.id}",
        headers=auth_headers
    )
    assert get_response.status_code == 404


async def test_delete_training_plan_not_found(
    async_client: AsyncClient, auth_headers
):
    """Test deleting a non-existent training plan."""
    fake_id = uuid4()
    
    response = await async_client.delete(
        f"/api/v1/training-plans/{fake_id}",
        headers=auth_headers
    )
    
    assert response.status_code == 404
    assert "Training plan not found" in response.json()["detail"]


async def test_delete_training_plan_unauthorized(
    async_client: AsyncClient, created_training_plan
):
    """Test deleting a training plan without authentication."""
    response = await async_client.delete(
        f"/api/v1/training-plans/{created_training_plan.id}"
    )
    
    assert response.status_code == 401


# Training Plan Stats Tests

async def test_get_training_plan_count(
    async_client: AsyncClient, auth_headers, created_training_plan
):
    """Test getting the count of training plans."""
    response = await async_client.get(
        "/api/v1/training-plans/stats/count",
        headers=auth_headers
    )
    
    assert response.status_code == 200
    result = response.json()
    
    assert "count" in result
    assert result["count"] >= 1


async def test_get_training_plan_count_with_filter(
    async_client: AsyncClient, auth_headers, created_training_plan
):
    """Test getting the count of active training plans."""
    response = await async_client.get(
        "/api/v1/training-plans/stats/count?is_active=true",
        headers=auth_headers
    )
    
    assert response.status_code == 200
    result = response.json()
    
    assert "count" in result
    assert isinstance(result["count"], int)


async def test_get_training_plan_count_unauthorized(
    async_client: AsyncClient
):
    """Test getting training plan count without authentication."""
    response = await async_client.get("/api/v1/training-plans/stats/count")
    assert response.status_code == 401
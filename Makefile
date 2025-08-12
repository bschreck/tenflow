.PHONY: help start stop restart backend-start frontend-start backend-restart frontend-restart \
 logs logs-backend logs-frontend logs-db shell-backend shell-frontend shell-db clean build dev prod \
 migrate migrate-rev migrate-up migrate-down migrate-current migrate-history migrate-heads migrate-stamp \
 db-drop db-reset seed rebuild tools-up tools-down

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	
ensure-dev-start-prereqs: ## Ensure dev start prereqs are met
	./ensure-dev-start-prereqs.sh

start: ensure-dev-start-prereqs ## Start all services with Docker Compose
	docker compose up -d

stop: ensure-dev-start-prereqs ## Stop all services
	docker compose down

restart: ensure-dev-start-prereqs ## Restart all services
	docker compose restart

backend-start: ensure-dev-start-prereqs ## Start only the backend (and its deps)
	docker compose up -d backend

frontend-start: ensure-dev-start-prereqs ## Start only the frontend (and its deps)
	docker compose up -d frontend

backend-restart: ensure-dev-start-prereqs ## Restart backend container
	docker compose restart backend

frontend-restart: ensure-dev-start-prereqs ## Restart frontend container
	docker compose restart frontend

logs: ensure-dev-start-prereqs ## View logs for all services
	docker compose logs -f

logs-backend: ensure-dev-start-prereqs ## View backend logs
	docker compose logs -f backend

logs-frontend: ensure-dev-start-prereqs ## View frontend logs
	docker compose logs -f frontend

logs-db: ensure-dev-start-prereqs ## View postgres logs
	docker compose logs -f postgres

shell-backend: ensure-dev-start-prereqs ## Open shell in backend container
	docker compose exec backend /bin/bash

shell-frontend: ensure-dev-start-prereqs ## Open shell in frontend container
	docker compose exec frontend /bin/sh

shell-db: ensure-dev-start-prereqs ## Open PostgreSQL shell
	docker compose exec postgres psql -U postgres -d tenflow

clean: ensure-dev-start-prereqs ## Remove all containers and volumes
	docker compose down -v

build: ensure-dev-start-prereqs ## Build all services
	docker compose build

prod: ## Build for production
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d

migrate: ensure-dev-start-prereqs ## Run database migrations
	docker compose exec backend uv run alembic upgrade head


# Migration helpers
MIG_MSG ?= "update"
STEP ?= 1

migrate-rev: ensure-dev-start-prereqs ## Create a new autogenerate revision (usage: make migrate-rev MIG_MSG="message")
	docker compose exec backend uv run alembic revision --autogenerate -m $(MIG_MSG)

migrate-up: ensure-dev-start-prereqs ## Upgrade to head
	docker compose exec backend uv run alembic upgrade head

migrate-down: ensure-dev-start-prereqs ## Downgrade one or more steps (usage: make migrate-down STEP=1)
	docker compose exec backend uv run alembic downgrade -$(STEP)

migrate-current: ensure-dev-start-prereqs ## Show current revision
	docker compose exec backend uv run alembic current

migrate-history: ensure-dev-start-prereqs ## Show revision history
	docker compose exec backend uv run alembic history --verbose

migrate-heads: ensure-dev-start-prereqs ## Show head revisions
	docker compose exec backend uv run alembic heads --verbose

migrate-stamp: ensure-dev-start-prereqs ## Stamp the database with the latest head without running migrations
	docker compose exec backend uv run alembic stamp head

PYTEST_ARGS ?=

test-backend: ensure-dev-start-prereqs ## Run backend tests in a one-off container (no service needed)
	docker compose up -d postgres
	cd backend && uv run pytest tests $(PYTEST_ARGS)
	docker compose down postgres

test-backend-serial: ensure-dev-start-prereqs ## Run backend tests serially (one at a time)
	docker compose up -d postgres
	cd backend && uv run pytest tests -n 0 $(PYTEST_ARGS)
	docker compose down postgres

rebuild: ensure-dev-start-prereqs ## Rebuild and start all services
	docker compose up --build -d

db-drop: ensure-dev-start-prereqs ## Drop and recreate public schema (DANGER)
	docker compose exec backend bash -lc 'psql "$$DATABASE_URL" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"'

db-reset: ## Drop schema and re-run latest migrations
	$(MAKE) db-drop
	$(MAKE) migrate-up

seed: ensure-dev-start-prereqs ## Seed database with default users and demo data
	docker compose exec backend uv run python init_db.py

tools-up: ensure-dev-start-prereqs ## Start extra tools (pgAdmin) profile
	docker compose --profile tools up -d

tools-down: ensure-dev-start-prereqs ## Stop extra tools profile
	docker compose --profile tools down

modal-deploy:
	cd backend && MODAL_ENVIRONMENT=tenflow uv run modal deploy modal_deploy.py

modal-migrate:
	cd backend && MODAL_ENVIRONMENT=tenflow uv run modal run modal_deploy.py::run_migrations

format:
	cd backend && uv run ruff check --fix --output-format=github .
	cd backend && uv run ruff format
	cd frontend && npm run format && npx eslint . --fix

sync-model-types:
	cd backend && uv run python scripts/generate_typescript_types.py
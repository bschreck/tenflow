# Tenflow - Workflow Automation Platform

A modern workflow automation platform built with FastAPI (backend) and React + Vite (frontend).

## Features

- 🔐 **User Authentication**: Secure login and registration system
- 📊 **Dashboard**: Overview of workflows and execution statistics
- 🔄 **Workflow Builder**: Visual workflow creation and editing
- ⚡ **Workflow Execution**: Run workflows on-demand
- 📝 **Workflow Management**: Create, edit, delete, and organize workflows
- 👤 **User Settings**: Profile management and preferences

## Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **SQLModel**: Unified SQLAlchemy and Pydantic models
- **PostgreSQL**: Database
- **JWT**: Authentication
- **Alembic**: Database migrations

### Frontend
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety
- **Radix UI**: Headless UI components
- **Tailwind CSS**: Utility-first CSS framework
- **React Query**: Data fetching and caching
- **Zustand**: State management
- **React Router**: Routing

## Prerequisites

### Option 1: Local Development
- Python 3.8+
- Node.js 16+
- PostgreSQL 12+

### Option 2: Docker Development
- Docker
- Docker Compose

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd tenflow
```

## Quick Start with Docker

The easiest way to get started is using Docker Compose:

```bash
# Start all services (PostgreSQL, Backend, Frontend)
./docker-start.sh

# Or manually with docker compose
docker compose up --build
```

This will:
- Start a PostgreSQL database
- Create the database schema
- Initialize default users
- Start the backend API on http://localhost:8000
- Start the frontend dev server on http://localhost:5173

To stop all services:
```bash
./docker-stop.sh

# Or manually
docker compose down
```

## Manual Installation

### 2. Set up PostgreSQL

If not using Docker, create a PostgreSQL database:
```sql
CREATE DATABASE tenflow;
```

Or use the provided script:
```bash
cd backend
python create_database.py
```

### 3. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp env.example .env

# Update .env with your PostgreSQL credentials
# Edit .env and set:
# DATABASE_URL=postgresql://your_user:your_password@localhost:5432/tenflow

# Initialize database
python init_db.py
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

## Running the Application

### Option 1: Using startup scripts

Make the scripts executable:
```bash
chmod +x start-backend.sh start-frontend.sh
```

In one terminal:
```bash
./start-backend.sh
```

In another terminal:
```bash
./start-frontend.sh
```

### Option 2: Manual startup

#### Backend
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
cd frontend
npm run dev
```

## Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Default Credentials

The application comes with two default users:

**Admin User:**
- Username: `admin`
- Password: `admin123`

**Demo User:**
- Username: `demo`
- Password: `demo123`

⚠️ **Important**: Change these passwords immediately in production!

## Project Structure

```
tenflow/
├── backend/
│   ├── app/
│   │   ├── api/           # API endpoints
│   │   ├── core/          # Core utilities (auth, security)
│   │   ├── models.py      # SQLModel database models
│   │   ├── database.py    # Database configuration
│   │   ├── config.py      # Application settings
│   │   └── main.py        # FastAPI application
│   ├── requirements.txt   # Python dependencies
│   ├── init_db.py        # Database initialization script
│   └── env.example       # Environment variables template
│
└── frontend/
    ├── src/
    │   ├── components/    # React components
    │   ├── pages/        # Page components
    │   ├── lib/          # Utilities and API client
    │   ├── stores/       # Zustand stores
    │   ├── App.tsx       # Main application component
    │   └── main.tsx      # Application entry point
    ├── package.json      # Node dependencies
    └── vite.config.ts    # Vite configuration
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login

### Users
- `POST /api/v1/users/` - Create new user
- `GET /api/v1/users/me` - Get current user
- `PUT /api/v1/users/me` - Update current user
- `GET /api/v1/users/{id}` - Get user by ID
- `GET /api/v1/users/` - List all users (admin only)

### Workflows
- `GET /api/v1/workflows/` - List workflows
- `POST /api/v1/workflows/` - Create workflow
- `GET /api/v1/workflows/{id}` - Get workflow
- `PUT /api/v1/workflows/{id}` - Update workflow
- `DELETE /api/v1/workflows/{id}` - Delete workflow
- `POST /api/v1/workflows/{id}/run` - Execute workflow
- `GET /api/v1/workflows/{id}/runs` - Get workflow runs

## Development

### Docker Development

When using Docker Compose, both frontend and backend support hot reloading:

- **Backend**: Python files are mounted as volumes, and uvicorn runs with `--reload`
- **Frontend**: Source files are mounted, and Vite's HMR is fully functional
- **Database**: PostgreSQL data persists in a Docker volume

To view logs:
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
```

To rebuild after dependency changes:
```bash
docker compose up --build
```

### Local Development

#### Backend Development

The backend uses FastAPI with automatic reload enabled. Any changes to Python files will automatically restart the server.

#### Frontend Development

The frontend uses Vite with Hot Module Replacement (HMR). Changes to React components will be reflected immediately in the browser.

### Database Migrations

To create and apply database migrations:

```bash
cd backend
alembic init alembic
alembic revision --autogenerate -m "Description"
alembic upgrade head
```

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Production Deployment

For production deployment:

1. Update environment variables in `.env`
2. Set `SECRET_KEY` to a secure random string
3. Configure a production database
4. Build the frontend: `npm run build`
5. Serve the backend with a production ASGI server like Gunicorn
6. Use a reverse proxy like Nginx

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Support

For issues and questions, please create an issue in the repository.
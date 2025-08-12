"""
Modal deployment script for Tenflow FastAPI backend.

This script sets up and deploys the Tenflow backend to Modal's serverless platform.
"""

import modal

# Create Modal image with all required dependencies using uv sync
image = (
    modal.Image.debian_slim(python_version='3.12')
    .apt_install('git')  # In case we need git for any dependencies
    .uv_sync()  # Use uv to sync dependencies from pyproject.toml
    .workdir('/root')
    .add_local_file('alembic.ini', remote_path='/root/alembic.ini')
    .add_local_dir('alembic', remote_path='/root/alembic')
    .add_local_dir('src', remote_path='/root/src')
    .add_local_dir('scripts', remote_path='/root/scripts')
    .add_local_python_source('tenflow')
)

# Initialize Modal app
app = modal.App(
    name='tenflow-backend',
    image=image,
    secrets=[
        # Add your secrets here - create them using: modal secret create tenflow-secrets
        modal.Secret.from_name('tenflow-secrets')
    ],
)


@app.function(
    # Configure resources as needed
    cpu=1.0,
    memory=512,
    # Enable GPU if needed: gpu="any"
    # Set timeout for long-running requests
    timeout=300,
    # Allow concurrent requests
    max_containers=10,
)
@modal.asgi_app()
def fastapi_app():
    """
    Main FastAPI application entry point for Modal deployment.

    This function imports and returns the FastAPI app instance.
    The import is done inside the function to ensure all dependencies
    are available in the Modal environment.
    """
    # Import the FastAPI app from your main module
    from tenflow.main import app as fastapi_app

    return fastapi_app


@app.function()
def run_migrations():
    import alembic.config

    alembic_args = [
        '-q',
        '--raiseerr',
        'upgrade',
        'head',
    ]
    alembic.config.main(argv=alembic_args)


@app.function()
def health_check():
    """
    Simple health check function that can be called to verify the deployment.
    """
    return {'status': 'healthy', 'platform': 'modal'}


if __name__ == '__main__':
    # For local testing
    print('This script is meant to be deployed to Modal.')
    print('Run: modal deploy modal_deploy.py')

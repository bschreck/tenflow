from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    POSTGRES_DATABASE: str = 'tenflow'
    POSTGRES_USER: str = 'postgres'
    POSTGRES_PASSWORD: str = 'password'
    POSTGRES_HOST: str = 'localhost'
    POSTGRES_PORT: int = 5432

    # Security
    SECRET_KEY: str = 'your-secret-key-here-change-in-production'
    ALGORITHM: str = 'HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS
    ALLOWED_ORIGINS: str = 'http://localhost:5173'

    # App
    APP_NAME: str = 'Tenflow'
    API_V1_STR: str = '/api/v1'

    class Config:
        env_file = '.env'
        case_sensitive = True

    def get_postgres_url(self):
        return f'postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DATABASE}'

    def get_root_postgres_url(self):
        return f'postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/postgres'

    def get_allowed_origins(self):
        if self.ALLOWED_ORIGINS:
            origins = [origin.strip() for origin in self.ALLOWED_ORIGINS.split(',')]
            return origins
        else:
            return [self.FRONTEND_URL]


settings = Settings()

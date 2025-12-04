from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Application
    app_name: str = "CRM для журналистов"
    debug: bool = False
    
    # Database
    database_url: str = "postgresql+asyncpg://crm:crm_password@localhost:5432/crm"
    
    # JWT
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7  # 7 days
    
    # Telegram Bot
    telegram_bot_token: str = ""
    
    # Frontend URL (for links in notifications)
    frontend_url: str = "http://localhost:3000"
    
    # File uploads
    upload_dir: str = "../uploads"
    max_upload_size: int = 10 * 1024 * 1024  # 10MB
    
    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


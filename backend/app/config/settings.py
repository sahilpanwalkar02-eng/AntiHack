import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AntiHack Security API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./antihack.db"
    )
    
    # JWT Security Configuration
    JWT_SECRET_KEY: str = os.getenv(
        "JWT_SECRET_KEY", 
        "antihack_super_secret_jwt_key_2026_change_in_prod_4096bit"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30 # 30 days
    
    # CORS Security
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]
    
    # Upload Settings
    MAX_UPLOAD_SIZE_MB: int = 15
    UPLOAD_DIR: str = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "../../../uploads")
    )
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()

from datetime import datetime, timedelta, timezone
from typing import Any, Union, Optional
import jwt
import bcrypt
from app.config.settings import settings
from app.utils.logger import logger

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain password against hashed password using bcrypt."""
    try:
        if isinstance(plain_password, str):
            plain_bytes = plain_password.encode('utf-8')
        else:
            plain_bytes = plain_password

        if isinstance(hashed_password, str):
            hashed_bytes = hashed_password.encode('utf-8')
        else:
            hashed_bytes = hashed_password

        return bcrypt.checkpw(plain_bytes, hashed_bytes)
    except Exception as e:
        logger.error(f"Error verifying password: {e}")
        return False

def get_password_hash(password: str) -> str:
    """Hash password securely using Bcrypt with standard salt."""
    if isinstance(password, str):
        password_bytes = password.encode('utf-8')
    else:
        password_bytes = password
    
    # Truncate to 72 bytes if needed per bcrypt spec
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
        
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def create_access_token(subject: Union[str, Any], role: str, expires_delta: Optional[timedelta] = None) -> str:
    """Generate a JWT access token with UTC timezone payload claims."""
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "sub": str(subject),
        "role": role,
        "exp": expire,
        "iat": now,
        "type": "access"
    }
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def create_refresh_token(subject: Union[str, Any], role: str) -> str:
    """Generate a longer-lived JWT refresh token with UTC timezone payload claims."""
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    to_encode = {
        "sub": str(subject),
        "role": role,
        "exp": expire,
        "iat": now,
        "type": "refresh"
    }
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_token(token: str) -> Optional[dict]:
    """Decode and validate JWT token signature and expiration."""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        logger.warning("Attempted use of expired JWT token")
        return None
    except jwt.PyJWTError as e:
        logger.warning(f"Invalid JWT token: {e}")
        return None

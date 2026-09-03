from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.utils.security import decode_token
from app.repositories.user_repository import UserRepository
from app.models.user import User, UserRole

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    """Dependency to extract and validate current authenticated user from Bearer Token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise credentials_exception
    
    user_id: Optional[str] = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    user_repo = UserRepository(db)
    user = user_repo.get_by_id(int(user_id))
    
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user profile"
        )
        
    return user

def get_current_admin_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Dependency to enforce Admin role authorization."""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to platform administrators."
        )
    return current_user

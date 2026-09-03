from typing import Optional, Tuple
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import Token, LoginRequest
from app.models.user import User, UserRole
from app.utils.security import (
    verify_password, 
    create_access_token, 
    create_refresh_token,
    decode_token
)
from app.utils.logger import logger

class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)

    def register_user(self, user_in: UserCreate, is_admin: bool = False) -> Tuple[User, Token]:
        """Register new user, verify uniqueness, hash password, and issue tokens."""
        existing_user = self.user_repo.get_by_email(user_in.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email address already exists."
            )

        role = UserRole.ADMIN if is_admin else UserRole.USER
        user = self.user_repo.create(user_in, role=role)
        
        logger.info(f"New user registered: {user.email} (Role: {user.role})")

        # Automatically log user in upon registration
        access_token = create_access_token(subject=user.id, role=user.role.value)
        refresh_token = create_refresh_token(subject=user.id, role=user.role.value)
        
        token = Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user=UserResponse.model_validate(user)
        )
        return user, token

    def authenticate_user(self, login_data: LoginRequest) -> Token:
        """Authenticate user credentials and issue JWT tokens."""
        user = self.user_repo.get_by_email(login_data.email)
        if not user or not verify_password(login_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is deactivated. Contact security admin."
            )

        self.user_repo.update_last_login(user.id)

        access_token = create_access_token(subject=user.id, role=user.role.value)
        refresh_token = create_refresh_token(subject=user.id, role=user.role.value)

        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user=UserResponse.model_validate(user)
        )

    def refresh_access_token(self, refresh_token: str) -> Token:
        """Refresh JWT access token using valid refresh token."""
        payload = decode_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token."
            )

        user_id = int(payload.get("sub"))
        user = self.user_repo.get_by_id(user_id)
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User inactive or no longer exists."
            )

        new_access_token = create_access_token(subject=user.id, role=user.role.value)
        new_refresh_token = create_refresh_token(subject=user.id, role=user.role.value)

        return Token(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            token_type="bearer",
            user=UserResponse.model_validate(user)
        )

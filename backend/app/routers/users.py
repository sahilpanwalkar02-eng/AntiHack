from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.user import UserResponse, UserUpdate, PasswordChange
from app.repositories.user_repository import UserRepository
from app.middleware.security import get_current_user, get_current_admin_user
from app.models.user import User
from app.utils.security import verify_password

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/profile", response_model=UserResponse)
def get_user_profile(current_user: User = Depends(get_current_user)):
    """Retrieve profile of authenticated user."""
    return current_user

@router.put("/profile", response_model=UserResponse)
def update_user_profile(
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update profile details of authenticated user."""
    repo = UserRepository(db)
    updated_user = repo.update(current_user.id, user_in)
    return updated_user

@router.post("/change-password")
def change_password(
    data: PasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Change user password after verifying current password."""
    if not verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password verification failed."
        )
    repo = UserRepository(db)
    repo.update_password(current_user.id, data.new_password)
    return {"message": "Password updated successfully."}

@router.get("/", response_model=List[UserResponse])
def list_users(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """List all platform users (Admin only)."""
    repo = UserRepository(db)
    return repo.get_all(skip=skip, limit=limit)

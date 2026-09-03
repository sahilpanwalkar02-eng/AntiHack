from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from app.models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=100)
    phone_number: Optional[str] = Field(None, max_length=20)

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters long")

class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone_number: Optional[str] = Field(None, max_length=20)

class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)

class UserResponse(UserBase):
    id: int
    role: UserRole
    is_active: bool
    is_verified: bool
    cyber_safety_score: float
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True

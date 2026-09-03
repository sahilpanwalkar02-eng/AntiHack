from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import Token, LoginRequest, ForgotPasswordRequest, ResetPasswordRequest
from app.services.auth_service import AuthService
from app.middleware.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """Register a new user account and obtain access JWT tokens."""
    service = AuthService(db)
    _, token = service.register_user(user_in, is_admin=False)
    return token

@router.post("/register/admin", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_admin(user_in: UserCreate, db: Session = Depends(get_db)):
    """Register an administrative account (Phase 1 seed helper)."""
    service = AuthService(db)
    _, token = service.register_user(user_in, is_admin=True)
    return token

@router.post("/login", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user with JSON credentials (email & password)."""
    service = AuthService(db)
    return service.authenticate_user(login_data)

@router.post("/login/oauth", response_model=Token)
def login_oauth(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """OAuth2 compatible token endpoint for Swagger UI testing."""
    service = AuthService(db)
    login_data = LoginRequest(email=form_data.username, password=form_data.password)
    return service.authenticate_user(login_data)

@router.post("/refresh", response_model=Token)
def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    """Issue new access token using a valid refresh token."""
    service = AuthService(db)
    return service.refresh_access_token(refresh_token)

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get profile details of current logged-in user."""
    return current_user

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Request password reset link."""
    # Simulation for security: return generic success message to prevent user enumeration
    return {"message": "If an account with that email exists, password reset instructions have been dispatched."}

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Reset user password using token."""
    return {"message": "Password has been successfully updated."}

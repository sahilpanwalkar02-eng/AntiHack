from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.middleware.security import get_current_user, get_current_admin_user
from app.models.user import User
from app.repositories.complaint_repository import ComplaintRepository
from app.repositories.threat_scan_repository import ThreatScanRepository
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserResponse
from app.schemas.complaint import ComplaintResponse

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])

@router.get("/stats")
def get_platform_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """Get platform-level analytics (Admin only)."""
    user_repo = UserRepository(db)
    complaint_repo = ComplaintRepository(db)
    threat_repo = ThreatScanRepository(db)

    users = user_repo.get_all(limit=10000)
    complaints = complaint_repo.get_all_complaints()

    return {
        "total_users": len(users),
        "total_complaints": len(complaints),
        "active_users": sum(1 for u in users if u.is_active),
        "resolved_complaints": sum(1 for c in complaints if c.status.value == "RESOLVED"),
        "pending_complaints": sum(1 for c in complaints if c.status.value == "SUBMITTED"),
        "under_investigation": sum(1 for c in complaints if c.status.value == "UNDER_INVESTIGATION"),
    }

@router.get("/users", response_model=List[UserResponse])
def list_all_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """List all platform users (Admin only)."""
    repo = UserRepository(db)
    return repo.get_all(skip=skip, limit=limit)

@router.get("/complaints", response_model=List[ComplaintResponse])
def list_all_complaints(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """List all filed complaints (Admin only)."""
    repo = ComplaintRepository(db)
    complaints = repo.get_all_complaints()
    return [ComplaintResponse.model_validate(c) for c in complaints]

from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.file_scanner import FileScanResponse
from app.services.file_scanner_service import FileScannerService
from app.repositories.file_scan_repository import FileScanRepository
from app.middleware.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/file-scanner", tags=["File Payload Scanner"])

@router.post("/upload", response_model=FileScanResponse, status_code=status.HTTP_201_CREATED)
def upload_and_scan_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload PDF, APK, Image, or Executable file to compute SHA-256 hash and run VirusTotal scan."""
    service = FileScannerService(db)
    return service.scan_uploaded_file(user_id=current_user.id, file=file)

@router.get("/history", response_model=List[FileScanResponse])
def get_file_scan_history(
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve history of uploaded file threat scans."""
    repo = FileScanRepository(db)
    scans = repo.get_user_scans(user_id=current_user.id, limit=limit)
    return [FileScanResponse.model_validate(s) for s in scans]

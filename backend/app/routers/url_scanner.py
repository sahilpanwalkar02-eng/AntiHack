from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.url_scanner import URLScanRequest, URLScanResponse
from app.services.url_scanner_service import URLScannerService
from app.repositories.url_scan_repository import URLScanRepository
from app.middleware.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/url-scanner", tags=["URL Threat Scanner"])

@router.post("/scan", response_model=URLScanResponse, status_code=status.HTTP_200_OK)
def scan_url(
    request: URLScanRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Scan URL link for phishing, malware, SSL errors, and domain age risks."""
    service = URLScannerService(db)
    return service.scan_url(user_id=current_user.id, request=request)

@router.get("/history", response_model=List[URLScanResponse])
def get_url_scan_history(
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve user's URL scan history."""
    repo = URLScanRepository(db)
    scans = repo.get_user_scans(user_id=current_user.id, limit=limit)
    return [URLScanResponse.model_validate(s) for s in scans]

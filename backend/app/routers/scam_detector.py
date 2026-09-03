from typing import List
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.scam_detector import (
    ScamAnalysisRequest, 
    ScamAnalysisResponse, 
    ThreatScanHistoryItem
)
from app.services.ai_scam_detector_service import AIScamDetectorService
from app.repositories.threat_scan_repository import ThreatScanRepository
from app.middleware.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/scam-detector", tags=["AI Scam Detector"])

@router.post("/analyze", response_model=ScamAnalysisResponse, status_code=status.HTTP_200_OK)
def analyze_scam_payload(
    request: ScamAnalysisRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Analyze SMS, Email, WhatsApp, Telegram, or URL message payload for phishing/scam threats."""
    service = AIScamDetectorService(db)
    return service.analyze_payload(user_id=current_user.id, request=request)

@router.get("/history", response_model=List[ThreatScanHistoryItem])
def get_scan_history(
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve history of threat scans conducted by current user."""
    repo = ThreatScanRepository(db)
    return repo.get_user_scans(user_id=current_user.id, limit=limit)

@router.get("/{scan_id}", response_model=ScamAnalysisResponse)
def get_scan_details(
    scan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve details of a specific threat scan."""
    repo = ThreatScanRepository(db)
    scan = repo.get_by_id(scan_id, user_id=current_user.id)
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Threat scan report not found."
        )
    return scan

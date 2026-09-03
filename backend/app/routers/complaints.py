from typing import List, Optional
import os
from fastapi import APIRouter, Depends, Form, File, UploadFile, status, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.config.settings import settings
from app.schemas.complaint import ComplaintCreate, ComplaintResponse
from app.repositories.complaint_repository import ComplaintRepository
from app.middleware.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/complaints", tags=["Fraud Complaints"])

@router.post("/", response_model=ComplaintResponse, status_code=status.HTTP_201_CREATED)
def create_complaint(
    fraud_type: str = Form(...),
    description: str = Form(...),
    transaction_id: Optional[str] = Form(None),
    bank_name: Optional[str] = Form(None),
    phone_number: Optional[str] = Form(None),
    evidence: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """File a new cyber fraud complaint with transaction details and optional evidence attachment."""
    repo = ComplaintRepository(db)
    
    evidence_path = None
    if evidence:
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        evidence_filename = f"evidence_u{current_user.id}_{evidence.filename}"
        evidence_path = os.path.join(settings.UPLOAD_DIR, evidence_filename)
        with open(evidence_path, "wb") as f:
            f.write(evidence.file.read())

    complaint_in = ComplaintCreate(
        fraud_type=fraud_type,
        description=description,
        transaction_id=transaction_id,
        bank_name=bank_name,
        phone_number=phone_number
    )
    
    complaint = repo.create_complaint(user_id=current_user.id, complaint_in=complaint_in, evidence_path=evidence_path)
    return ComplaintResponse.model_validate(complaint)

@router.get("/", response_model=List[ComplaintResponse])
def get_user_complaints(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve all cybercrime complaints filed by current user."""
    repo = ComplaintRepository(db)
    complaints = repo.get_user_complaints(user_id=current_user.id)
    return [ComplaintResponse.model_validate(c) for c in complaints]

@router.get("/{complaint_id}", response_model=ComplaintResponse)
def get_complaint_details(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve details and timeline history for a specific complaint."""
    repo = ComplaintRepository(db)
    complaint = repo.get_by_id(complaint_id, user_id=current_user.id)
    if not complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Complaint not found."
        )
    return ComplaintResponse.model_validate(complaint)

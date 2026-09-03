from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.complaint import Complaint, ComplaintUpdate, ComplaintStatus
from app.schemas.complaint import ComplaintCreate

class ComplaintRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_complaint(self, user_id: int, complaint_in: ComplaintCreate, evidence_path: Optional[str] = None) -> Complaint:
        complaint = Complaint(
            user_id=user_id,
            fraud_type=complaint_in.fraud_type,
            description=complaint_in.description,
            transaction_id=complaint_in.transaction_id,
            bank_name=complaint_in.bank_name,
            phone_number=complaint_in.phone_number,
            evidence_file_path=evidence_path,
            status=ComplaintStatus.SUBMITTED
        )
        self.db.add(complaint)
        self.db.commit()
        self.db.refresh(complaint)

        # Create initial timeline record
        timeline = ComplaintUpdate(
            complaint_id=complaint.id,
            status=ComplaintStatus.SUBMITTED,
            comment="Complaint filed successfully. Awaiting administrative review.",
            updated_by="System"
        )
        self.db.add(timeline)
        self.db.commit()
        self.db.refresh(complaint)

        return complaint

    def get_by_id(self, complaint_id: int, user_id: Optional[int] = None) -> Optional[Complaint]:
        query = self.db.query(Complaint).filter(Complaint.id == complaint_id)
        if user_id:
            query = query.filter(Complaint.user_id == user_id)
        return query.first()

    def get_user_complaints(self, user_id: int) -> List[Complaint]:
        return self.db.query(Complaint).filter(Complaint.user_id == user_id).order_by(Complaint.created_at.desc()).all()

    def get_all_complaints(self) -> List[Complaint]:
        return self.db.query(Complaint).order_by(Complaint.created_at.desc()).all()

    def update_status(self, complaint_id: int, new_status: ComplaintStatus, comment: str, updated_by: str) -> Optional[Complaint]:
        complaint = self.db.query(Complaint).filter(Complaint.id == complaint_id).first()
        if not complaint:
            return None

        complaint.status = new_status
        timeline = ComplaintUpdate(
            complaint_id=complaint.id,
            status=new_status,
            comment=comment,
            updated_by=updated_by
        )
        self.db.add(timeline)
        self.db.commit()
        self.db.refresh(complaint)
        return complaint

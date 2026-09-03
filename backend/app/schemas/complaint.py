from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from app.models.complaint import ComplaintStatus

class ComplaintCreate(BaseModel):
    fraud_type: str = Field(..., min_length=2, max_length=100)
    description: str = Field(..., min_length=10)
    transaction_id: Optional[str] = Field(None, max_length=100)
    bank_name: Optional[str] = Field(None, max_length=100)
    phone_number: Optional[str] = Field(None, max_length=50)

class ComplaintUpdateItem(BaseModel):
    id: int
    status: ComplaintStatus
    comment: str
    updated_by: str
    created_at: datetime

    class Config:
        from_attributes = True

class ComplaintResponse(BaseModel):
    id: int
    user_id: int
    fraud_type: str
    description: str
    transaction_id: Optional[str] = None
    bank_name: Optional[str] = None
    phone_number: Optional[str] = None
    evidence_file_path: Optional[str] = None
    status: ComplaintStatus
    created_at: datetime
    updated_at: datetime
    updates: List[ComplaintUpdateItem] = []

    class Config:
        from_attributes = True

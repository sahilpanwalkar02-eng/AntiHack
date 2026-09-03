import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class ComplaintStatus(str, enum.Enum):
    SUBMITTED = "SUBMITTED"
    UNDER_INVESTIGATION = "UNDER_INVESTIGATION"
    RESOLVED = "RESOLVED"
    REJECTED = "REJECTED"

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    fraud_type = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    transaction_id = Column(String(100), nullable=True)
    bank_name = Column(String(100), nullable=True)
    phone_number = Column(String(50), nullable=True)
    evidence_file_path = Column(String(255), nullable=True)
    
    status = Column(Enum(ComplaintStatus), default=ComplaintStatus.SUBMITTED, nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    updates = relationship("ComplaintUpdate", back_populates="complaint", cascade="all, delete-orphan")

class ComplaintUpdate(Base):
    __tablename__ = "complaint_updates"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False, index=True)
    
    status = Column(Enum(ComplaintStatus), nullable=False)
    comment = Column(Text, nullable=False)
    updated_by = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    complaint = relationship("Complaint", back_populates="updates")

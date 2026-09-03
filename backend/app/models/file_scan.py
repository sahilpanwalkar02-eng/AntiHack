from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from app.database.session import Base

class UploadedFileScan(Base):
    __tablename__ = "uploaded_file_scans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    filename = Column(String(255), nullable=False)
    file_type = Column(String(100), nullable=False)
    file_size_bytes = Column(Integer, nullable=False)
    sha256_hash = Column(String(64), nullable=False, index=True)
    
    is_malicious = Column(Boolean, default=False, nullable=False)
    risk_score = Column(Float, default=0.0, nullable=False)
    virustotal_positives = Column(Integer, default=0, nullable=False)
    virustotal_total = Column(Integer, default=74, nullable=False)
    threat_name = Column(String(255), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

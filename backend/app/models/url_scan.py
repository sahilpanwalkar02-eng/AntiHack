import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, Enum, ForeignKey
from app.database.session import Base

class URLSafetyStatus(str, enum.Enum):
    SAFE = "SAFE"
    SUSPICIOUS = "SUSPICIOUS"
    DANGEROUS = "DANGEROUS"

class URLScan(Base):
    __tablename__ = "url_scans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    url = Column(Text, nullable=False)
    domain = Column(String(255), nullable=False)
    safety_status = Column(Enum(URLSafetyStatus), nullable=False)
    risk_score = Column(Float, nullable=False)
    
    google_safebrowsing_status = Column(String(100), default="CLEAN", nullable=False)
    virustotal_positives = Column(Integer, default=0, nullable=False)
    virustotal_total = Column(Integer, default=92, nullable=False)
    
    ssl_valid = Column(Boolean, default=True, nullable=False)
    ssl_issuer = Column(String(255), nullable=True)
    domain_age_days = Column(Integer, default=365, nullable=False)
    analysis_summary = Column(Text, nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<URLScan id={self.id} domain='{self.domain}' status='{self.safety_status}'>"

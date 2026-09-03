import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Enum, ForeignKey, JSON
from app.database.session import Base

class ChannelType(str, enum.Enum):
    SMS = "sms"
    EMAIL = "email"
    WHATSAPP = "whatsapp"
    TELEGRAM = "telegram"
    URL = "url"

class ThreatLevel(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class ThreatScan(Base):
    __tablename__ = "threat_scans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    channel_type = Column(Enum(ChannelType), nullable=False)
    input_content = Column(Text, nullable=False)
    sender_info = Column(String(255), nullable=True)
    
    risk_score = Column(Float, nullable=False) # 0.0 to 100.0
    threat_level = Column(Enum(ThreatLevel), nullable=False)
    reason = Column(Text, nullable=False)
    
    recommendations = Column(JSON, nullable=False) # List of string recommendations
    detected_patterns = Column(JSON, nullable=False) # List of matched indicators
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<ThreatScan id={self.id} type='{self.channel_type}' score={self.risk_score} level='{self.threat_level}'>"

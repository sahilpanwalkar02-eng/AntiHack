from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from app.models.threat_scan import ChannelType, ThreatLevel

class ScamAnalysisRequest(BaseModel):
    channel_type: ChannelType
    content: str = Field(..., min_length=3, description="Message or URL payload to analyze")
    sender_info: Optional[str] = Field(None, max_length=255, description="Sender phone number, email, or handle")

class ScamAnalysisResponse(BaseModel):
    scan_id: int
    channel_type: ChannelType
    input_content: str
    risk_score: float
    threat_level: ThreatLevel
    reason: str
    recommendations: List[str]
    detected_patterns: List[str]
    created_at: datetime

    class Config:
        from_attributes = True

class ThreatScanHistoryItem(BaseModel):
    id: int
    channel_type: ChannelType
    input_content: str
    risk_score: float
    threat_level: ThreatLevel
    created_at: datetime

    class Config:
        from_attributes = True

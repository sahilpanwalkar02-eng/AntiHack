from datetime import datetime
from typing import Optional
from pydantic import BaseModel, HttpUrl
from app.models.url_scan import URLSafetyStatus

class URLScanRequest(BaseModel):
    url: str

class URLScanResponse(BaseModel):
    id: int
    url: str
    domain: str
    safety_status: URLSafetyStatus
    risk_score: float
    google_safebrowsing_status: str
    virustotal_positives: int
    virustotal_total: int
    ssl_valid: bool
    ssl_issuer: Optional[str] = None
    domain_age_days: int
    analysis_summary: str
    created_at: datetime

    class Config:
        from_attributes = True

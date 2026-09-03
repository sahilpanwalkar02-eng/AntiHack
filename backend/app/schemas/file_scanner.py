from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class FileScanResponse(BaseModel):
    id: int
    filename: str
    file_type: str
    file_size_bytes: int
    sha256_hash: str
    is_malicious: bool
    risk_score: float
    virustotal_positives: int
    virustotal_total: int
    threat_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

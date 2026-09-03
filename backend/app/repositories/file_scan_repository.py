from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.file_scan import UploadedFileScan

class FileScanRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_scan(
        self,
        user_id: int,
        filename: str,
        file_type: str,
        file_size_bytes: int,
        sha256_hash: str,
        is_malicious: bool,
        risk_score: float,
        virustotal_positives: int,
        virustotal_total: int,
        threat_name: Optional[str] = None
    ) -> UploadedFileScan:
        scan = UploadedFileScan(
            user_id=user_id,
            filename=filename,
            file_type=file_type,
            file_size_bytes=file_size_bytes,
            sha256_hash=sha256_hash,
            is_malicious=is_malicious,
            risk_score=risk_score,
            virustotal_positives=virustotal_positives,
            virustotal_total=virustotal_total,
            threat_name=threat_name
        )
        self.db.add(scan)
        self.db.commit()
        self.db.refresh(scan)
        return scan

    def get_user_scans(self, user_id: int, limit: int = 20) -> List[UploadedFileScan]:
        return self.db.query(UploadedFileScan).filter(UploadedFileScan.user_id == user_id).order_by(UploadedFileScan.created_at.desc()).limit(limit).all()

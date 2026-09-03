from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.url_scan import URLScan, URLSafetyStatus

class URLScanRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_scan(
        self,
        user_id: int,
        url: str,
        domain: str,
        safety_status: URLSafetyStatus,
        risk_score: float,
        google_safebrowsing_status: str,
        virustotal_positives: int,
        virustotal_total: int,
        ssl_valid: bool,
        ssl_issuer: Optional[str],
        domain_age_days: int,
        analysis_summary: str
    ) -> URLScan:
        scan = URLScan(
            user_id=user_id,
            url=url,
            domain=domain,
            safety_status=safety_status,
            risk_score=risk_score,
            google_safebrowsing_status=google_safebrowsing_status,
            virustotal_positives=virustotal_positives,
            virustotal_total=virustotal_total,
            ssl_valid=ssl_valid,
            ssl_issuer=ssl_issuer,
            domain_age_days=domain_age_days,
            analysis_summary=analysis_summary
        )
        self.db.add(scan)
        self.db.commit()
        self.db.refresh(scan)
        return scan

    def get_user_scans(self, user_id: int, limit: int = 20) -> List[URLScan]:
        return self.db.query(URLScan).filter(URLScan.user_id == user_id).order_by(URLScan.created_at.desc()).limit(limit).all()

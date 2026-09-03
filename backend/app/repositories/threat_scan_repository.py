from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.threat_scan import ThreatScan, ChannelType, ThreatLevel

class ThreatScanRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_scan(
        self,
        user_id: int,
        channel_type: ChannelType,
        input_content: str,
        sender_info: Optional[str],
        risk_score: float,
        threat_level: ThreatLevel,
        reason: str,
        recommendations: List[str],
        detected_patterns: List[str]
    ) -> ThreatScan:
        scan = ThreatScan(
            user_id=user_id,
            channel_type=channel_type,
            input_content=input_content,
            sender_info=sender_info,
            risk_score=risk_score,
            threat_level=threat_level,
            reason=reason,
            recommendations=recommendations,
            detected_patterns=detected_patterns
        )
        self.db.add(scan)
        self.db.commit()
        self.db.refresh(scan)
        return scan

    def get_by_id(self, scan_id: int, user_id: int) -> Optional[ThreatScan]:
        return self.db.query(ThreatScan).filter(ThreatScan.id == scan_id, ThreatScan.user_id == user_id).first()

    def get_user_scans(self, user_id: int, limit: int = 20) -> List[ThreatScan]:
        return self.db.query(ThreatScan).filter(ThreatScan.user_id == user_id).order_by(ThreatScan.created_at.desc()).limit(limit).all()

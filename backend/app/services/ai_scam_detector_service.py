import re
from typing import List, Dict, Tuple
from sqlalchemy.orm import Session
from app.models.threat_scan import ChannelType, ThreatLevel, ThreatScan
from app.repositories.threat_scan_repository import ThreatScanRepository
from app.schemas.scam_detector import ScamAnalysisRequest, ScamAnalysisResponse

class AIScamDetectorService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = ThreatScanRepository(db)

    # Heuristic Rule Sets
    URGENCY_PATTERNS = [
        r"\b(immediate action|act now|account (will be|has been) (blocked|suspended|deactivated)|24 hours|within 2 hours|electricity disconnected|power supply off)\b",
        r"\b(urgent|critical update|last chance|final notice|emergency update|verify immediately)\b",
    ]

    BANKING_PATTERNS = [
        r"\b(update your pan|kyc update|sbi|hdfc|icici|axis|bank account|debit card|credit card|cvv|otp|net banking|atm pin)\b",
        r"\b(unauthorized transaction|refund credited|claim refund|income tax refund|cashback pending)\b",
    ]

    PRIZE_LOTTERY_PATTERNS = [
        r"\b(you have won|congratulations|lucky winner|claim your prize|free giftcard|lottery|draw winner|\$1,000,000|iphone 15|cash reward)\b",
    ]

    CREDENTIAL_LINK_PATTERNS = [
        r"http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+",
        r"\b(bit\.ly|tinyurl\.com|goo\.gl|t\.co|is\.gd|cutt\.ly|ngrok|xyz|top|club|site|online)\b",
        r"\b(login|verify|update-profile|account-security|secure-banking)\b",
    ]

    def analyze_payload(self, user_id: int, request: ScamAnalysisRequest) -> ScamAnalysisResponse:
        content = request.content.lower()
        channel = request.channel_type
        
        detected_indicators = []
        score = 0.0

        # Rule 1: Urgency & Threat Triggers (+25 points per match, max 35)
        urgency_matches = 0
        for pattern in self.URGENCY_PATTERNS:
            if re.search(pattern, content):
                urgency_matches += 1
        if urgency_matches > 0:
            score += min(35.0, urgency_matches * 20.0)
            detected_indicators.append("Urgent action / Pressure tactics detected")

        # Rule 2: Banking & KYC Impersonation (+30 points)
        banking_matches = 0
        for pattern in self.BANKING_PATTERNS:
            if re.search(pattern, content):
                banking_matches += 1
        if banking_matches > 0:
            score += min(35.0, banking_matches * 20.0)
            detected_indicators.append("Bank or KYC impersonation keywords detected")

        # Rule 3: Prize / Lottery Fraud (+25 points)
        for pattern in self.PRIZE_LOTTERY_PATTERNS:
            if re.search(pattern, content):
                score += 25.0
                detected_indicators.append("Unsolicited prize / Lottery claim trigger")
                break

        # Rule 4: Suspicious URL / Link Shortener (+25 points)
        for pattern in self.CREDENTIAL_LINK_PATTERNS:
            if re.search(pattern, content):
                score += 25.0
                detected_indicators.append("External link or shortened URL present")
                break

        # Additional Channel specific checks
        if channel == ChannelType.URL:
            score = max(score, 40.0 if "http" in content else 10.0)
            if any(ext in content for ext in [".xyz", ".top", ".apk", "ngrok", "login"]):
                score += 35.0
                detected_indicators.append("High-risk TLD or malicious payload extension")

        # Normalize score
        risk_score = round(min(100.0, max(5.0, score)), 1)

        # Categorize Threat Level
        if risk_score >= 80.0:
            threat_level = ThreatLevel.CRITICAL
            reason = "High probability of active phishing scam. Contains urgent pressure tactics, credential harvesting links, or bank spoofing."
        elif risk_score >= 50.0:
            threat_level = ThreatLevel.HIGH
            reason = "Suspicious message payload containing financial or verification request indicators."
        elif risk_score >= 25.0:
            threat_level = ThreatLevel.MEDIUM
            reason = "Contains external links or mild promotional language. Exercise caution."
        else:
            threat_level = ThreatLevel.LOW
            reason = "No prominent phishing or scam heuristics detected in the content."

        # Recommendations
        recommendations = self._generate_recommendations(threat_level, detected_indicators, channel)

        if not detected_indicators:
            detected_indicators.append("Standard message structure")

        # Persist scan result to DB
        scan = self.repo.create_scan(
            user_id=user_id,
            channel_type=channel,
            input_content=request.content,
            sender_info=request.sender_info,
            risk_score=risk_score,
            threat_level=threat_level,
            reason=reason,
            recommendations=recommendations,
            detected_patterns=detected_indicators
        )

        return ScamAnalysisResponse(
            scan_id=scan.id,
            channel_type=scan.channel_type,
            input_content=scan.input_content,
            risk_score=scan.risk_score,
            threat_level=scan.threat_level,
            reason=scan.reason,
            recommendations=scan.recommendations,
            detected_patterns=scan.detected_patterns,
            created_at=scan.created_at
        )

    def _generate_recommendations(self, level: ThreatLevel, indicators: List[str], channel: ChannelType) -> List[str]:
        recs = []
        if level in [ThreatLevel.CRITICAL, ThreatLevel.HIGH]:
            recs.append("DO NOT click any embedded links or open attachments in this message.")
            recs.append("DO NOT share OTPs, passwords, PAN numbers, or banking credentials.")
            recs.append("Verify the claim by directly accessing the official bank or service app independently.")
            recs.append("Report this number/sender to national cybercrime portal (1930 Helpline).")
        elif level == ThreatLevel.MEDIUM:
            recs.append("Verify the sender address or phone number before taking any action.")
            recs.append("Check the domain in our AntiHack URL Threat Scanner before clicking.")
        else:
            recs.append("Message appears safe, but maintain standard digital security vigilance.")
        
        return recs

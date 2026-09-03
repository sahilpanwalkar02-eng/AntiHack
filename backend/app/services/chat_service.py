from typing import List
from sqlalchemy.orm import Session
from app.models.chat_history import ChatHistory
from app.schemas.chat import ChatMessageResponse

class ChatbotService:
    def __init__(self, db: Session):
        self.db = db

    CYBER_KNOWLEDGE_BASE = {
        "digital arrest": "Digital Arrest is a fake police scam where scammers impersonate CBI, Police, or Customs officers over video call and threaten arrest for fake parcel packages. Never send money; legitimate law enforcement never demands payment via UPI or video calls.",
        "lost money": "If you lost money in a cyber scam: 1. Call National Cyber Crime Helpline 1930 immediately to freeze bank accounts. 2. File a complaint on cybercrime.gov.in. 3. Inform your bank within 24 hours.",
        "otp": "Never share OTPs with anyone. Banks and official services will NEVER call to ask for OTPs or PIN numbers.",
        "password": "Use unique 12+ character passwords with numbers & symbols. Enable 2-Factor Authentication (2FA) on all financial and email accounts.",
        "apk": "Do not install APK files sent via WhatsApp or SMS. Fake APKs contain Trojans that read your OTPs and drain bank accounts."
    }

    def process_message(self, user_id: int, user_message: str) -> ChatMessageResponse:
        # Persist user message
        user_entry = ChatHistory(user_id=user_id, role="user", message=user_message)
        self.db.add(user_entry)
        self.db.commit()

        # Generate Knowledgeable Cyber Defense Answer
        msg_lower = user_message.lower()
        reply_text = "I am AntiHack AI Cyber Assistant. "

        found_match = False
        for key, val in self.CYBER_KNOWLEDGE_BASE.items():
            if key in msg_lower:
                reply_text += val
                found_match = True
                break

        if not found_match:
            reply_text += "To protect your digital safety: Never share OTPs or passwords, avoid clicking unknown links, verify caller identities independently, and report any suspicious fraud immediately on our Complaints module."

        # Persist assistant response
        assistant_entry = ChatHistory(user_id=user_id, role="assistant", message=reply_text)
        self.db.add(assistant_entry)
        self.db.commit()
        self.db.refresh(assistant_entry)

        return ChatMessageResponse.model_validate(assistant_entry)

    def get_user_chat_history(self, user_id: int) -> List[ChatMessageResponse]:
        records = self.db.query(ChatHistory).filter(ChatHistory.user_id == user_id).order_by(ChatHistory.created_at.asc()).all()
        return [ChatMessageResponse.model_validate(r) for r in records]

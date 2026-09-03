from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.chat import ChatMessageCreate, ChatMessageResponse
from app.services.chat_service import ChatbotService
from app.middleware.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/chatbot", tags=["AI Cybersecurity Chatbot"])

@router.post("/message", response_model=ChatMessageResponse, status_code=status.HTTP_200_OK)
def send_message(
    payload: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Send a cybersecurity question to the AI assistant and get a response."""
    service = ChatbotService(db)
    return service.process_message(user_id=current_user.id, user_message=payload.message)

@router.get("/history", response_model=List[ChatMessageResponse])
def get_chat_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve chat history for the current user session."""
    service = ChatbotService(db)
    return service.get_user_chat_history(user_id=current_user.id)

from datetime import datetime
from pydantic import BaseModel, Field

class ChatMessageCreate(BaseModel):
    message: str = Field(..., min_length=1)

class ChatMessageResponse(BaseModel):
    id: int
    role: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True

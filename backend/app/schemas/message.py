from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class MessageCreate(BaseModel):
    text: str


class MessageOut(BaseModel):
    id: UUID
    task_id: UUID
    user_id: UUID
    text: str
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class FileOut(BaseModel):
    id: UUID
    task_id: UUID
    filename: str
    path: str
    uploaded_at: datetime
    
    class Config:
        from_attributes = True


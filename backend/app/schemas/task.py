from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime, date

from app.models.task import TaskStatus, TaskType
from app.schemas.client import ClientOut
from app.schemas.media import MediaOut
from app.schemas.user import UserOut


class TaskBase(BaseModel):
    client_id: UUID
    media_id: Optional[UUID] = None
    author_id: Optional[UUID] = None
    editor_id: Optional[UUID] = None
    manager_id: Optional[UUID] = None
    
    title: str
    description: Optional[str] = None
    task_type: TaskType = TaskType.ARTICLE
    language: str = "RU"
    
    google_doc_url: Optional[str] = None
    google_forms_url: Optional[str] = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    client_id: Optional[UUID] = None
    media_id: Optional[UUID] = None
    author_id: Optional[UUID] = None
    editor_id: Optional[UUID] = None
    manager_id: Optional[UUID] = None
    
    title: Optional[str] = None
    description: Optional[str] = None
    task_type: Optional[TaskType] = None
    language: Optional[str] = None
    
    google_doc_url: Optional[str] = None
    google_forms_url: Optional[str] = None
    
    publication_url: Optional[str] = None
    publication_date: Optional[date] = None
    client_gratitude: Optional[str] = None
    
    sent_to_whom: Optional[str] = None
    sent_method: Optional[str] = None


class TaskStatusChange(BaseModel):
    status: TaskStatus
    comment: Optional[str] = None
    postpone_reason: Optional[str] = None
    postpone_resume_date: Optional[date] = None


class TaskOut(BaseModel):
    id: UUID
    client_id: UUID
    media_id: Optional[UUID] = None
    author_id: Optional[UUID] = None
    editor_id: Optional[UUID] = None
    manager_id: Optional[UUID] = None
    
    title: str
    description: Optional[str] = None
    task_type: TaskType
    language: str
    status: TaskStatus
    
    google_doc_url: Optional[str] = None
    google_forms_url: Optional[str] = None
    
    created_at: datetime
    status_changed_at: datetime
    iteration: int
    
    postpone_reason: Optional[str] = None
    postpone_resume_date: Optional[date] = None
    
    publication_url: Optional[str] = None
    publication_date: Optional[date] = None
    client_gratitude: Optional[str] = None
    
    sent_to_whom: Optional[str] = None
    sent_method: Optional[str] = None
    
    # Nested objects
    client: Optional[ClientOut] = None
    media: Optional[MediaOut] = None
    author: Optional[UserOut] = None
    editor: Optional[UserOut] = None
    manager: Optional[UserOut] = None
    
    class Config:
        from_attributes = True


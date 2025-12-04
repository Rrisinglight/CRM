from sqlalchemy import Column, String, Text, DateTime, Integer, ForeignKey, Enum as SQLEnum, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from uuid import uuid4
import enum

from app.database import Base


class TaskStatus(str, enum.Enum):
    NEW = "new"
    IN_PROGRESS = "in_progress"
    EDITOR_REVIEW = "editor_review"
    CLIENT_APPROVAL = "client_approval"
    CLIENT_APPROVED = "client_approved"
    SENT_TO_MEDIA = "sent_to_media"
    PUBLISHED = "published"
    POSTPONED = "postponed"


class TaskType(str, enum.Enum):
    ARTICLE = "article"  # Написание статьи
    RECOMMENDATION = "recommendation"  # Рекомендательное письмо
    COVER_LETTER = "cover_letter"  # Сопроводительное письмо


class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    
    # Relations
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"), nullable=False)
    media_id = Column(UUID(as_uuid=True), ForeignKey("media.id"))
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    editor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    manager_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    
    # Basic info
    title = Column(String(255), nullable=False)  # ФИ клиента
    description = Column(Text)  # Краткое описание
    task_type = Column(SQLEnum(TaskType), default=TaskType.ARTICLE)
    language = Column(String(10), default="RU")  # RU/EN
    status = Column(SQLEnum(TaskStatus), default=TaskStatus.NEW)
    
    # Links
    google_doc_url = Column(String(500))
    google_forms_url = Column(String(500))
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    status_changed_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Iteration counter (increments on backward moves)
    iteration = Column(Integer, default=0)
    
    # Postponed status fields
    postpone_reason = Column(Text)
    postpone_resume_date = Column(Date)
    
    # Published status fields
    publication_url = Column(String(500))
    publication_date = Column(Date)
    client_gratitude = Column(Text)  # Благодарность клиента
    
    # Sent to media fields
    sent_to_whom = Column(String(255))  # Кому отправлено
    sent_method = Column(String(100))  # Способ отправки
    
    # Relationships
    client = relationship("Client", foreign_keys=[client_id])
    media = relationship("Media", foreign_keys=[media_id])
    author = relationship("User", foreign_keys=[author_id])
    editor = relationship("User", foreign_keys=[editor_id])
    manager = relationship("User", foreign_keys=[manager_id])


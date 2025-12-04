from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from uuid import uuid4

from app.database import Base


class File(Base):
    __tablename__ = "files"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    
    task_id = Column(UUID(as_uuid=True), ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False)
    
    filename = Column(String(255), nullable=False)  # Original filename
    path = Column(String(255), nullable=False)  # Stored filename
    
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    task = relationship("Task", foreign_keys=[task_id])


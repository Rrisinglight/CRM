from sqlalchemy import Column, String, Text, DateTime, Integer, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from uuid import uuid4

from app.database import Base
from app.models.task import TaskStatus


class StatusHistory(Base):
    __tablename__ = "status_history"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    
    task_id = Column(UUID(as_uuid=True), ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    from_status = Column(SQLEnum(TaskStatus), nullable=False)
    to_status = Column(SQLEnum(TaskStatus), nullable=False)
    comment = Column(Text)
    
    iteration = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    task = relationship("Task", foreign_keys=[task_id])
    user = relationship("User", foreign_keys=[user_id])


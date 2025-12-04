from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from uuid import uuid4

from app.database import Base


class Client(Base):
    __tablename__ = "clients"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    avatar_url = Column(String(500))
    
    company = Column(String(200))
    position = Column(String(200))
    
    phone = Column(String(50))
    email = Column(String(255))
    telegram_username = Column(String(100))
    
    lawyer_name = Column(String(200))
    lawyer_contact = Column(String(200))
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


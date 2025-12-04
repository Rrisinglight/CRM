from sqlalchemy import Column, String, Text, JSON, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from uuid import uuid4

from app.database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    avatar_url = Column(String(500))
    
    phone = Column(String(50))
    telegram_username = Column(String(100))
    
    topics = Column(JSON, default=list)  # ["финансы", "IT", "культура"]
    bio = Column(Text)
    languages = Column(JSON, default=["RU"])  # ["RU", "EN"]
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


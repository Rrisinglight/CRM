from sqlalchemy import Column, String, Text, JSON, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from uuid import uuid4

from app.database import Base


class Media(Base):
    __tablename__ = "media"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    
    name = Column(String(200), nullable=False)
    logo_url = Column(String(500))
    description = Column(Text)
    
    category = Column(String(100))  # деловое, lifestyle, IT, региональное
    language = Column(String(10), default="RU")
    website_url = Column(String(500))
    
    contacts = Column(JSON, default=dict)  # {"editor": "...", "email": "..."}
    notes = Column(Text)  # Примечания, требования к материалам
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


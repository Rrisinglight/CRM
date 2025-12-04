from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class MediaBase(BaseModel):
    name: str
    logo_url: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    language: str = "RU"
    website_url: Optional[str] = None
    contacts: Optional[dict] = {}
    notes: Optional[str] = None


class MediaCreate(MediaBase):
    pass


class MediaUpdate(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    language: Optional[str] = None
    website_url: Optional[str] = None
    contacts: Optional[dict] = None
    notes: Optional[str] = None


class MediaOut(BaseModel):
    id: UUID
    name: str
    logo_url: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    language: str
    website_url: Optional[str] = None
    contacts: dict = {}
    notes: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


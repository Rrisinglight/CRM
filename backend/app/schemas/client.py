from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import datetime


class ClientBase(BaseModel):
    first_name: str
    last_name: str
    company: Optional[str] = None
    position: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    telegram_username: Optional[str] = None
    lawyer_name: Optional[str] = None
    lawyer_contact: Optional[str] = None


class ClientCreate(ClientBase):
    pass


class ClientUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    avatar_url: Optional[str] = None
    company: Optional[str] = None
    position: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    telegram_username: Optional[str] = None
    lawyer_name: Optional[str] = None
    lawyer_contact: Optional[str] = None


class ClientOut(BaseModel):
    id: UUID
    first_name: str
    last_name: str
    avatar_url: Optional[str] = None
    company: Optional[str] = None
    position: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    telegram_username: Optional[str] = None
    lawyer_name: Optional[str] = None
    lawyer_contact: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone: Optional[str] = None
    telegram_username: Optional[str] = None
    topics: Optional[list[str]] = []
    bio: Optional[str] = None
    languages: Optional[list[str]] = ["RU"]


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    telegram_username: Optional[str] = None
    avatar_url: Optional[str] = None
    topics: Optional[list[str]] = None
    bio: Optional[str] = None
    languages: Optional[list[str]] = None


class UserOut(BaseModel):
    id: UUID
    email: str
    first_name: str
    last_name: str
    avatar_url: Optional[str] = None
    phone: Optional[str] = None
    telegram_username: Optional[str] = None
    topics: list[str] = []
    bio: Optional[str] = None
    languages: list[str] = ["RU"]
    created_at: datetime
    
    class Config:
        from_attributes = True


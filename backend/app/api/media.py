from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from typing import Optional
from uuid import UUID

from app.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.media import Media
from app.schemas.media import MediaCreate, MediaUpdate, MediaOut

router = APIRouter()


@router.get("/", response_model=list[MediaOut])
async def get_media_list(
    search: Optional[str] = None,
    category: Optional[str] = None,
    language: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(Media)
    
    if search:
        query = query.where(
            or_(
                Media.name.ilike(f"%{search}%"),
                Media.description.ilike(f"%{search}%"),
            )
        )
    if category:
        query = query.where(Media.category == category)
    if language:
        query = query.where(Media.language == language)
    
    query = query.order_by(Media.name)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{media_id}", response_model=MediaOut)
async def get_media(
    media_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Media).where(Media.id == media_id))
    media = result.scalar_one_or_none()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    return media


@router.post("/", response_model=MediaOut)
async def create_media(
    media_data: MediaCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    media = Media(**media_data.model_dump())
    db.add(media)
    await db.commit()
    await db.refresh(media)
    return media


@router.patch("/{media_id}", response_model=MediaOut)
async def update_media(
    media_id: UUID,
    media_data: MediaUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Media).where(Media.id == media_id))
    media = result.scalar_one_or_none()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    
    update_data = media_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(media, field, value)
    
    await db.commit()
    await db.refresh(media)
    return media


@router.delete("/{media_id}")
async def delete_media(
    media_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Media).where(Media.id == media_id))
    media = result.scalar_one_or_none()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    
    await db.delete(media)
    await db.commit()
    return {"ok": True}


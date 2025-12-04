from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from uuid import UUID

from app.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.message import Message
from app.schemas.message import MessageCreate, MessageOut
from app.ws.board import manager

router = APIRouter()


@router.get("/task/{task_id}", response_model=list[MessageOut])
async def get_task_messages(
    task_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Message)
        .where(Message.task_id == task_id)
        .order_by(Message.created_at.asc())
    )
    return result.scalars().all()


@router.post("/task/{task_id}", response_model=MessageOut)
async def create_message(
    task_id: UUID,
    message_data: MessageCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    message = Message(
        task_id=task_id,
        user_id=current_user.id,
        text=message_data.text,
    )
    db.add(message)
    await db.commit()
    await db.refresh(message)
    
    # Broadcast new message
    await manager.broadcast({
        "type": "new_message",
        "task_id": str(task_id),
        "message_id": str(message.id),
        "user_id": str(current_user.id),
    })
    
    return message


@router.post("/task/{task_id}/read")
async def mark_messages_read(
    task_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark all messages in task as read for current user"""
    await db.execute(
        update(Message)
        .where(Message.task_id == task_id)
        .where(Message.user_id != current_user.id)
        .values(is_read=True)
    )
    await db.commit()
    return {"ok": True}


@router.get("/task/{task_id}/unread")
async def get_unread_count(
    task_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get count of unread messages in task"""
    from sqlalchemy import func
    result = await db.execute(
        select(func.count(Message.id))
        .where(Message.task_id == task_id)
        .where(Message.user_id != current_user.id)
        .where(Message.is_read == False)
    )
    count = result.scalar()
    return {"unread": count}


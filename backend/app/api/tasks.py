from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func
from sqlalchemy.orm import selectinload
from typing import Optional
from uuid import UUID
from datetime import datetime

from app.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.task import Task, TaskStatus, TaskType
from app.models.status_history import StatusHistory
from app.schemas.task import TaskCreate, TaskUpdate, TaskOut, TaskStatusChange
from app.services.undo import save_undo_state, get_undo_state
from app.ws.board import manager

router = APIRouter()

# Pipeline order for determining forward/backward moves
PIPELINE_ORDER = [
    TaskStatus.NEW,
    TaskStatus.IN_PROGRESS,
    TaskStatus.EDITOR_REVIEW,
    TaskStatus.CLIENT_APPROVAL,
    TaskStatus.CLIENT_APPROVED,
    TaskStatus.SENT_TO_MEDIA,
    TaskStatus.PUBLISHED,
]


def is_forward_move(from_status: TaskStatus, to_status: TaskStatus) -> bool:
    """Check if move is forward in the pipeline"""
    if from_status == TaskStatus.POSTPONED or to_status == TaskStatus.POSTPONED:
        return False
    try:
        from_idx = PIPELINE_ORDER.index(from_status)
        to_idx = PIPELINE_ORDER.index(to_status)
        return to_idx == from_idx + 1
    except ValueError:
        return False


@router.get("/", response_model=list[TaskOut])
async def get_tasks(
    status: Optional[TaskStatus] = None,
    author_id: Optional[UUID] = None,
    editor_id: Optional[UUID] = None,
    manager_id: Optional[UUID] = None,
    client_id: Optional[UUID] = None,
    media_id: Optional[UUID] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(Task).options(
        selectinload(Task.client),
        selectinload(Task.media),
        selectinload(Task.author),
        selectinload(Task.editor),
        selectinload(Task.manager),
    )
    
    if status:
        query = query.where(Task.status == status)
    if author_id:
        query = query.where(Task.author_id == author_id)
    if editor_id:
        query = query.where(Task.editor_id == editor_id)
    if manager_id:
        query = query.where(Task.manager_id == manager_id)
    if client_id:
        query = query.where(Task.client_id == client_id)
    if media_id:
        query = query.where(Task.media_id == media_id)
    if search:
        query = query.where(
            or_(
                Task.title.ilike(f"%{search}%"),
                Task.description.ilike(f"%{search}%"),
            )
        )
    
    # Sort: overdue first, then by created_at
    query = query.order_by(Task.status_changed_at.asc())
    
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{task_id}", response_model=TaskOut)
async def get_task(
    task_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Task)
        .options(
            selectinload(Task.client),
            selectinload(Task.media),
            selectinload(Task.author),
            selectinload(Task.editor),
            selectinload(Task.manager),
        )
        .where(Task.id == task_id)
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.post("/", response_model=TaskOut)
async def create_task(
    task_data: TaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = Task(**task_data.model_dump())
    db.add(task)
    await db.commit()
    await db.refresh(task)
    
    # Broadcast to connected clients
    await manager.broadcast({
        "type": "task_created",
        "task_id": str(task.id),
    })
    
    return task


@router.patch("/{task_id}", response_model=TaskOut)
async def update_task(
    task_id: UUID,
    task_data: TaskUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = task_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)
    
    await db.commit()
    await db.refresh(task)
    
    await manager.broadcast({
        "type": "task_updated",
        "task_id": str(task.id),
    })
    
    return task


@router.patch("/{task_id}/status", response_model=TaskOut)
async def change_task_status(
    task_id: UUID,
    status_change: TaskStatusChange,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    old_status = task.status
    new_status = status_change.status
    
    # Save undo state
    await save_undo_state(str(task_id), {
        "status": old_status.value,
        "status_changed_at": task.status_changed_at.isoformat(),
        "iteration": task.iteration,
    })
    
    # Check if comment required (backward/lateral move)
    is_forward = is_forward_move(old_status, new_status)
    if not is_forward and not status_change.comment:
        raise HTTPException(
            status_code=400,
            detail="Comment required for backward or lateral moves"
        )
    
    # Update iteration on backward move
    if not is_forward and old_status != TaskStatus.POSTPONED:
        task.iteration += 1
    
    # Update task
    task.status = new_status
    task.status_changed_at = datetime.utcnow()
    
    # Handle postponed status
    if new_status == TaskStatus.POSTPONED:
        task.postpone_reason = status_change.postpone_reason
        task.postpone_resume_date = status_change.postpone_resume_date
    
    # Record history
    history = StatusHistory(
        task_id=task.id,
        user_id=current_user.id,
        from_status=old_status,
        to_status=new_status,
        comment=status_change.comment,
        iteration=task.iteration,
    )
    db.add(history)
    
    await db.commit()
    await db.refresh(task)
    
    await manager.broadcast({
        "type": "task_status_changed",
        "task_id": str(task.id),
        "from_status": old_status.value,
        "to_status": new_status.value,
    })
    
    return task


@router.post("/{task_id}/undo", response_model=TaskOut)
async def undo_status_change(
    task_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Undo last status change within 20 seconds"""
    previous_state = await get_undo_state(str(task_id))
    if not previous_state:
        raise HTTPException(
            status_code=400,
            detail="No undo available (expired or already used)"
        )
    
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Restore previous state
    task.status = TaskStatus(previous_state["status"])
    task.status_changed_at = datetime.fromisoformat(previous_state["status_changed_at"])
    task.iteration = previous_state["iteration"]
    
    # Delete the last history entry
    last_history = await db.execute(
        select(StatusHistory)
        .where(StatusHistory.task_id == task_id)
        .order_by(StatusHistory.created_at.desc())
        .limit(1)
    )
    history_entry = last_history.scalar_one_or_none()
    if history_entry:
        await db.delete(history_entry)
    
    await db.commit()
    await db.refresh(task)
    
    await manager.broadcast({
        "type": "task_undo",
        "task_id": str(task.id),
    })
    
    return task


@router.post("/{task_id}/take")
async def take_task(
    task_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Take task as author and move to in_progress"""
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    if task.status != TaskStatus.NEW:
        raise HTTPException(status_code=400, detail="Can only take new tasks")
    
    task.author_id = current_user.id
    task.status = TaskStatus.IN_PROGRESS
    task.status_changed_at = datetime.utcnow()
    
    # Record history
    history = StatusHistory(
        task_id=task.id,
        user_id=current_user.id,
        from_status=TaskStatus.NEW,
        to_status=TaskStatus.IN_PROGRESS,
        comment="Взял в работу",
        iteration=task.iteration,
    )
    db.add(history)
    
    await db.commit()
    await db.refresh(task)
    
    await manager.broadcast({
        "type": "task_taken",
        "task_id": str(task.id),
        "user_id": str(current_user.id),
    })
    
    return task


@router.delete("/{task_id}")
async def delete_task(
    task_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    await db.delete(task)
    await db.commit()
    
    await manager.broadcast({
        "type": "task_deleted",
        "task_id": str(task_id),
    })
    
    return {"ok": True}


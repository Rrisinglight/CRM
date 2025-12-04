from fastapi import APIRouter, Depends, HTTPException, UploadFile, File as FastAPIFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID, uuid4
from pathlib import Path
import aiofiles

from app.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.file import File
from app.schemas.file import FileOut
from app.config import get_settings

router = APIRouter()
settings = get_settings()


@router.get("/task/{task_id}", response_model=list[FileOut])
async def get_task_files(
    task_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(File)
        .where(File.task_id == task_id)
        .order_by(File.uploaded_at.desc())
    )
    return result.scalars().all()


@router.post("/task/{task_id}", response_model=FileOut)
async def upload_file(
    task_id: UUID,
    file: UploadFile = FastAPIFile(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check file size
    content = await file.read()
    if len(content) > settings.max_upload_size:
        raise HTTPException(status_code=400, detail="File too large")
    
    # Generate unique filename
    ext = Path(file.filename).suffix
    unique_filename = f"{uuid4()}{ext}"
    file_path = Path(settings.upload_dir) / unique_filename
    
    # Save file
    async with aiofiles.open(file_path, "wb") as f:
        await f.write(content)
    
    # Create database record
    db_file = File(
        task_id=task_id,
        filename=file.filename,
        path=unique_filename,
    )
    db.add(db_file)
    await db.commit()
    await db.refresh(db_file)
    
    return db_file


@router.delete("/{file_id}")
async def delete_file(
    file_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(File).where(File.id == file_id))
    file = result.scalar_one_or_none()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Delete physical file
    file_path = Path(settings.upload_dir) / file.path
    if file_path.exists():
        file_path.unlink()
    
    # Delete database record
    await db.delete(file)
    await db.commit()
    
    return {"ok": True}


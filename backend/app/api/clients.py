from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from typing import Optional
from uuid import UUID

from app.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.client import Client
from app.schemas.client import ClientCreate, ClientUpdate, ClientOut

router = APIRouter()


@router.get("/", response_model=list[ClientOut])
async def get_clients(
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(Client)
    
    if search:
        query = query.where(
            or_(
                Client.first_name.ilike(f"%{search}%"),
                Client.last_name.ilike(f"%{search}%"),
                Client.company.ilike(f"%{search}%"),
            )
        )
    
    query = query.order_by(Client.last_name, Client.first_name)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{client_id}", response_model=ClientOut)
async def get_client(
    client_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Client).where(Client.id == client_id))
    client = result.scalar_one_or_none()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client


@router.post("/", response_model=ClientOut)
async def create_client(
    client_data: ClientCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    client = Client(**client_data.model_dump())
    db.add(client)
    await db.commit()
    await db.refresh(client)
    return client


@router.patch("/{client_id}", response_model=ClientOut)
async def update_client(
    client_id: UUID,
    client_data: ClientUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Client).where(Client.id == client_id))
    client = result.scalar_one_or_none()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    update_data = client_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(client, field, value)
    
    await db.commit()
    await db.refresh(client)
    return client


@router.delete("/{client_id}")
async def delete_client(
    client_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Client).where(Client.id == client_id))
    client = result.scalar_one_or_none()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    await db.delete(client)
    await db.commit()
    return {"ok": True}


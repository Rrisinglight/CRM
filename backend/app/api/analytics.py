from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from datetime import datetime, timedelta
from typing import Optional
from uuid import UUID

from app.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.task import Task, TaskStatus
from app.models.status_history import StatusHistory

router = APIRouter()


def get_period_dates(period: str, compare_period: Optional[str] = None):
    """Calculate start/end dates for period"""
    now = datetime.utcnow()
    
    periods = {
        "month": timedelta(days=30),
        "quarter": timedelta(days=90),
        "half_year": timedelta(days=180),
        "year": timedelta(days=365),
    }
    
    delta = periods.get(period, timedelta(days=30))
    start = now - delta
    end = now
    
    compare_start = None
    compare_end = None
    if compare_period:
        compare_delta = periods.get(compare_period, delta)
        compare_start = start - compare_delta
        compare_end = start
    
    return start, end, compare_start, compare_end


@router.get("/summary")
async def get_summary(
    period: str = Query("month", regex="^(month|quarter|half_year|year)$"),
    author_id: Optional[UUID] = None,
    editor_id: Optional[UUID] = None,
    manager_id: Optional[UUID] = None,
    client_id: Optional[UUID] = None,
    media_id: Optional[UUID] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get summary metrics for the period"""
    start, end, _, _ = get_period_dates(period)
    
    # Base query filters
    filters = []
    if author_id:
        filters.append(Task.author_id == author_id)
    if editor_id:
        filters.append(Task.editor_id == editor_id)
    if manager_id:
        filters.append(Task.manager_id == manager_id)
    if client_id:
        filters.append(Task.client_id == client_id)
    if media_id:
        filters.append(Task.media_id == media_id)
    
    # WIP (tasks in active statuses)
    wip_statuses = [
        TaskStatus.NEW, TaskStatus.IN_PROGRESS,
        TaskStatus.EDITOR_REVIEW, TaskStatus.CLIENT_APPROVAL
    ]
    wip_query = select(func.count(Task.id)).where(
        Task.status.in_(wip_statuses),
        *filters
    )
    wip_result = await db.execute(wip_query)
    wip = wip_result.scalar()
    
    # Overdue (>3 days in current stage)
    three_days_ago = datetime.utcnow() - timedelta(days=3)
    overdue_query = select(func.count(Task.id)).where(
        Task.status.in_(wip_statuses),
        Task.status_changed_at < three_days_ago,
        *filters
    )
    overdue_result = await db.execute(overdue_query)
    overdue = overdue_result.scalar()
    
    # On editor review
    editor_review_query = select(func.count(Task.id)).where(
        Task.status == TaskStatus.EDITOR_REVIEW,
        *filters
    )
    editor_review_result = await db.execute(editor_review_query)
    editor_review = editor_review_result.scalar()
    
    # Published in period
    published_query = select(func.count(Task.id)).where(
        Task.status == TaskStatus.PUBLISHED,
        Task.status_changed_at >= start,
        Task.status_changed_at <= end,
        *filters
    )
    published_result = await db.execute(published_query)
    published = published_result.scalar()
    
    return {
        "period": period,
        "wip": wip,
        "overdue": overdue,
        "editor_review": editor_review,
        "published": published,
    }


@router.get("/cycles")
async def get_cycles(
    period: str = Query("month", regex="^(month|quarter|half_year|year)$"),
    compare_period: Optional[str] = Query(None, regex="^(month|quarter|half_year|year)$"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get average cycle times"""
    start, end, compare_start, compare_end = get_period_dates(period, compare_period)
    
    # Calculate average time from NEW to PUBLISHED
    # This is simplified - in production you'd calculate from StatusHistory
    
    result = {
        "period": period,
        "new_to_client_approved": 0,  # days
        "new_to_editor_approved": 0,
        "new_to_published": 0,
    }
    
    if compare_period:
        result["compare_period"] = compare_period
        result["compare_new_to_client_approved"] = 0
        result["compare_new_to_editor_approved"] = 0
        result["compare_new_to_published"] = 0
    
    return result


@router.get("/stages")
async def get_stages(
    period: str = Query("month", regex="^(month|quarter|half_year|year)$"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get stage duration breakdown"""
    start, end, _, _ = get_period_dates(period)
    
    # Count tasks per stage
    stages = {}
    for status in TaskStatus:
        query = select(func.count(Task.id)).where(Task.status == status)
        result = await db.execute(query)
        stages[status.value] = result.scalar()
    
    # Calculate % without delays per stage
    three_days_ago = datetime.utcnow() - timedelta(days=3)
    stages_no_delay = {}
    for status in TaskStatus:
        total_query = select(func.count(Task.id)).where(Task.status == status)
        total_result = await db.execute(total_query)
        total = total_result.scalar()
        
        on_time_query = select(func.count(Task.id)).where(
            Task.status == status,
            Task.status_changed_at >= three_days_ago
        )
        on_time_result = await db.execute(on_time_query)
        on_time = on_time_result.scalar()
        
        stages_no_delay[status.value] = (on_time / total * 100) if total > 0 else 100
    
    return {
        "period": period,
        "stages": stages,
        "stages_no_delay_percent": stages_no_delay,
    }


@router.get("/publications")
async def get_publications(
    period: str = Query("month", regex="^(month|quarter|half_year|year)$"),
    compare_period: Optional[str] = Query(None, regex="^(month|quarter|half_year|year)$"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get publications over time"""
    start, end, compare_start, compare_end = get_period_dates(period, compare_period)
    
    # Get published tasks grouped by date
    query = select(
        func.date(Task.status_changed_at).label("date"),
        func.count(Task.id).label("count")
    ).where(
        Task.status == TaskStatus.PUBLISHED,
        Task.status_changed_at >= start,
        Task.status_changed_at <= end,
    ).group_by(func.date(Task.status_changed_at)).order_by("date")
    
    result = await db.execute(query)
    publications = [{"date": str(row.date), "count": row.count} for row in result]
    
    response = {
        "period": period,
        "publications": publications,
    }
    
    if compare_period and compare_start and compare_end:
        compare_query = select(
            func.date(Task.status_changed_at).label("date"),
            func.count(Task.id).label("count")
        ).where(
            Task.status == TaskStatus.PUBLISHED,
            Task.status_changed_at >= compare_start,
            Task.status_changed_at <= compare_end,
        ).group_by(func.date(Task.status_changed_at)).order_by("date")
        
        compare_result = await db.execute(compare_query)
        response["compare_period"] = compare_period
        response["compare_publications"] = [
            {"date": str(row.date), "count": row.count} for row in compare_result
        ]
    
    return response


@router.get("/roles")
async def get_roles(
    period: str = Query("month", regex="^(month|quarter|half_year|year)$"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get workload by roles"""
    start, end, _, _ = get_period_dates(period)
    
    # Tasks by author
    authors_query = select(
        Task.author_id,
        func.count(Task.id).label("total"),
        func.sum(func.cast(Task.status == TaskStatus.PUBLISHED, type_=int)).label("published")
    ).where(
        Task.author_id.isnot(None)
    ).group_by(Task.author_id)
    
    authors_result = await db.execute(authors_query)
    authors = [
        {"user_id": str(row.author_id), "total": row.total, "published": row.published or 0}
        for row in authors_result
    ]
    
    # Tasks by editor
    editors_query = select(
        Task.editor_id,
        func.count(Task.id).label("total"),
        func.sum(func.cast(Task.status == TaskStatus.PUBLISHED, type_=int)).label("published")
    ).where(
        Task.editor_id.isnot(None)
    ).group_by(Task.editor_id)
    
    editors_result = await db.execute(editors_query)
    editors = [
        {"user_id": str(row.editor_id), "total": row.total, "published": row.published or 0}
        for row in editors_result
    ]
    
    # Tasks by manager
    managers_query = select(
        Task.manager_id,
        func.count(Task.id).label("total"),
        func.sum(func.cast(Task.status == TaskStatus.PUBLISHED, type_=int)).label("published")
    ).where(
        Task.manager_id.isnot(None)
    ).group_by(Task.manager_id)
    
    managers_result = await db.execute(managers_query)
    managers = [
        {"user_id": str(row.manager_id), "total": row.total, "published": row.published or 0}
        for row in managers_result
    ]
    
    return {
        "period": period,
        "authors": authors,
        "editors": editors,
        "managers": managers,
    }


@router.get("/calendar")
async def get_calendar(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get calendar heatmap data for last month"""
    start = datetime.utcnow() - timedelta(days=30)
    end = datetime.utcnow()
    
    # Publications per day
    query = select(
        func.date(Task.status_changed_at).label("date"),
        func.count(Task.id).label("count")
    ).where(
        Task.status == TaskStatus.PUBLISHED,
        Task.status_changed_at >= start,
        Task.status_changed_at <= end,
    ).group_by(func.date(Task.status_changed_at))
    
    result = await db.execute(query)
    publications = {str(row.date): row.count for row in result}
    
    # Delays per day (tasks that became overdue)
    delays_query = select(
        func.date(Task.status_changed_at).label("date"),
        func.count(Task.id).label("count")
    ).where(
        Task.status_changed_at >= start,
        Task.status_changed_at <= end,
        Task.status_changed_at < datetime.utcnow() - timedelta(days=3),
    ).group_by(func.date(Task.status_changed_at))
    
    delays_result = await db.execute(delays_query)
    delays = {str(row.date): row.count for row in delays_result}
    
    return {
        "publications": publications,
        "delays": delays,
    }


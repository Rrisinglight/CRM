"""
Scheduler for periodic CRM tasks and notifications.

Features:
- Check for overdue tasks and send notifications
- Send follow-up reminders for tasks sent to media
- Send resume reminders for postponed tasks
- Send periodic reports
"""

import asyncio
import logging
from datetime import datetime, timedelta, date
from typing import Optional

from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import async_session
from app.models.task import Task, TaskStatus
from app.models.user import User
from app.config import get_settings
from app.bot.telegram_bot import (
    bot,
    send_overdue_notification,
    send_followup_reminder,
    send_resume_reminder,
    send_periodic_report,
)

settings = get_settings()
logger = logging.getLogger(__name__)


class NotificationScheduler:
    """Scheduler for automated notifications"""

    def __init__(self):
        self._running = False
        self._tasks: list[asyncio.Task] = []

    async def start(self):
        """Start all scheduled tasks"""
        self._running = True
        logger.info("Starting notification scheduler...")

        # Start periodic tasks
        self._tasks = [
            asyncio.create_task(self._check_overdue_loop()),
            asyncio.create_task(self._check_followup_loop()),
            asyncio.create_task(self._check_resume_loop()),
            asyncio.create_task(self._periodic_reports_loop()),
        ]

    async def stop(self):
        """Stop all scheduled tasks"""
        self._running = False
        for task in self._tasks:
            task.cancel()
        await asyncio.gather(*self._tasks, return_exceptions=True)
        logger.info("Notification scheduler stopped")

    # ==================== Overdue Tasks ====================

    async def _check_overdue_loop(self):
        """Periodically check for overdue tasks"""
        while self._running:
            try:
                await self._check_overdue_tasks()
            except Exception as e:
                logger.error(f"Error checking overdue tasks: {e}")

            # Check every hour
            await asyncio.sleep(3600)

    async def _check_overdue_tasks(self):
        """Find and notify about overdue tasks (>3 days on stage)"""
        three_days_ago = datetime.utcnow() - timedelta(days=3)

        async with async_session() as db:
            # Active statuses where overdue matters
            active_statuses = [
                TaskStatus.NEW,
                TaskStatus.IN_PROGRESS,
                TaskStatus.EDITOR_REVIEW,
                TaskStatus.CLIENT_APPROVAL,
            ]

            query = (
                select(Task)
                .where(
                    Task.status.in_(active_statuses),
                    Task.status_changed_at < three_days_ago,
                )
            )

            result = await db.execute(query)
            overdue_tasks = result.scalars().all()

            for task in overdue_tasks:
                days = (datetime.utcnow() - task.status_changed_at).days

                # Notify responsible person based on stage
                identifier = None
                if task.status == TaskStatus.NEW and task.manager_id:
                    user = await db.get(User, task.manager_id)
                    identifier = user.telegram_username or user.email if user else None
                elif task.status == TaskStatus.IN_PROGRESS and task.author_id:
                    user = await db.get(User, task.author_id)
                    identifier = user.telegram_username or user.email if user else None
                elif task.status == TaskStatus.EDITOR_REVIEW and task.editor_id:
                    user = await db.get(User, task.editor_id)
                    identifier = user.telegram_username or user.email if user else None
                elif task.status == TaskStatus.CLIENT_APPROVAL and task.manager_id:
                    user = await db.get(User, task.manager_id)
                    identifier = user.telegram_username or user.email if user else None

                if identifier:
                    await send_overdue_notification(
                        identifier=identifier,
                        task_title=task.title,
                        task_id=str(task.id),
                        days=days,
                        crm_url=settings.frontend_url if hasattr(settings, 'frontend_url') else "",
                    )
                    logger.info(f"Sent overdue notification for task {task.id} to {identifier}")

    # ==================== Follow-up Reminders ====================

    async def _check_followup_loop(self):
        """Periodically check for follow-up reminders"""
        while self._running:
            try:
                await self._check_followup_tasks()
            except Exception as e:
                logger.error(f"Error checking follow-up tasks: {e}")

            # Check every 6 hours
            await asyncio.sleep(6 * 3600)

    async def _check_followup_tasks(self):
        """Find tasks sent to media that need follow-up"""
        # Tasks sent more than 5 days ago
        five_days_ago = datetime.utcnow() - timedelta(days=5)

        async with async_session() as db:
            query = (
                select(Task)
                .where(
                    Task.status == TaskStatus.SENT_TO_MEDIA,
                    Task.status_changed_at < five_days_ago,
                )
            )

            result = await db.execute(query)
            tasks = result.scalars().all()

            for task in tasks:
                if task.manager_id:
                    user = await db.get(User, task.manager_id)
                    identifier = user.telegram_username or user.email if user else None

                    if identifier and task.media:
                        days = (datetime.utcnow() - task.status_changed_at).days
                        await send_followup_reminder(
                            identifier=identifier,
                            task_title=task.title,
                            task_id=str(task.id),
                            media_name=task.media.name if task.media else "Unknown",
                            days_since_sent=days,
                            crm_url=settings.frontend_url if hasattr(settings, 'frontend_url') else "",
                        )
                        logger.info(f"Sent follow-up reminder for task {task.id}")

    # ==================== Resume Reminders ====================

    async def _check_resume_loop(self):
        """Periodically check for postponed tasks approaching resume date"""
        while self._running:
            try:
                await self._check_resume_tasks()
            except Exception as e:
                logger.error(f"Error checking resume tasks: {e}")

            # Check every day at 9:00
            await asyncio.sleep(24 * 3600)

    async def _check_resume_tasks(self):
        """Find postponed tasks with approaching resume date"""
        today = date.today()
        three_days_later = today + timedelta(days=3)

        async with async_session() as db:
            query = (
                select(Task)
                .where(
                    Task.status == TaskStatus.POSTPONED,
                    Task.postpone_resume_date.isnot(None),
                    Task.postpone_resume_date <= three_days_later,
                    Task.postpone_resume_date >= today,
                )
            )

            result = await db.execute(query)
            tasks = result.scalars().all()

            for task in tasks:
                # Notify manager or author
                user_id = task.manager_id or task.author_id
                if user_id:
                    user = await db.get(User, user_id)
                    identifier = user.telegram_username or user.email if user else None

                    if identifier:
                        await send_resume_reminder(
                            identifier=identifier,
                            task_title=task.title,
                            task_id=str(task.id),
                            resume_date=task.postpone_resume_date.strftime("%d.%m.%Y"),
                            crm_url=settings.frontend_url if hasattr(settings, 'frontend_url') else "",
                        )
                        logger.info(f"Sent resume reminder for task {task.id}")

    # ==================== Periodic Reports ====================

    async def _periodic_reports_loop(self):
        """Send periodic reports based on schedule"""
        while self._running:
            try:
                await self._send_periodic_reports()
            except Exception as e:
                logger.error(f"Error sending periodic reports: {e}")

            # Check daily at 10:00
            await asyncio.sleep(24 * 3600)

    async def _send_periodic_reports(self):
        """Send periodic reports to all users"""
        today = date.today()

        # Determine which reports to send
        periods_to_send = []

        # Monthly report: first day of month
        if today.day == 1:
            periods_to_send.append("month")

        # Quarterly report: first day of quarter
        if today.month in [1, 4, 7, 10] and today.day == 1:
            periods_to_send.append("quarter")

        # Half-year report: Jan 1 or Jul 1
        if today.month in [1, 7] and today.day == 1:
            periods_to_send.append("half_year")

        # Yearly report: Jan 1
        if today.month == 1 and today.day == 1:
            periods_to_send.append("year")

        if not periods_to_send:
            return

        async with async_session() as db:
            # Get all users
            result = await db.execute(select(User))
            users = result.scalars().all()

            for period in periods_to_send:
                # Calculate metrics
                metrics = await self._calculate_metrics(db, period)

                for user in users:
                    identifier = user.telegram_username or user.email
                    if identifier:
                        await send_periodic_report(
                            identifier=identifier,
                            period=period,
                            **metrics,
                            crm_url=settings.frontend_url if hasattr(settings, 'frontend_url') else "",
                        )

                logger.info(f"Sent {period} reports to {len(users)} users")

    async def _calculate_metrics(self, db: AsyncSession, period: str) -> dict:
        """Calculate metrics for a period"""
        from sqlalchemy import func

        # Period start date
        period_days = {
            "month": 30,
            "quarter": 90,
            "half_year": 180,
            "year": 365,
        }
        days = period_days.get(period, 30)
        start_date = datetime.utcnow() - timedelta(days=days)

        # WIP count
        wip_statuses = [
            TaskStatus.NEW, TaskStatus.IN_PROGRESS,
            TaskStatus.EDITOR_REVIEW, TaskStatus.CLIENT_APPROVAL,
        ]
        wip_result = await db.execute(
            select(func.count(Task.id)).where(Task.status.in_(wip_statuses))
        )
        wip = wip_result.scalar() or 0

        # Overdue count
        three_days_ago = datetime.utcnow() - timedelta(days=3)
        overdue_result = await db.execute(
            select(func.count(Task.id)).where(
                Task.status.in_(wip_statuses),
                Task.status_changed_at < three_days_ago,
            )
        )
        overdue = overdue_result.scalar() or 0

        # Editor review count
        editor_result = await db.execute(
            select(func.count(Task.id)).where(Task.status == TaskStatus.EDITOR_REVIEW)
        )
        editor_review = editor_result.scalar() or 0

        # Published count in period
        published_result = await db.execute(
            select(func.count(Task.id)).where(
                Task.status == TaskStatus.PUBLISHED,
                Task.status_changed_at >= start_date,
            )
        )
        published = published_result.scalar() or 0

        return {
            "wip": wip,
            "overdue": overdue,
            "editor_review": editor_review,
            "published": published,
        }


# Global scheduler instance
scheduler = NotificationScheduler()


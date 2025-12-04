"""
Telegram Bot module for CRM notifications.

Usage:
    from app.bot import (
        bot,
        send_overdue_notification,
        send_followup_reminder,
        send_resume_reminder,
        send_periodic_report,
        send_new_task_notification,
        get_user_avatar_url,
    )
"""

from app.bot.telegram_bot import (
    bot,
    CRMBot,
    send_overdue_notification,
    send_followup_reminder,
    send_resume_reminder,
    send_periodic_report,
    send_new_task_notification,
    get_user_avatar_url,
)

from app.bot.scheduler import scheduler, NotificationScheduler

__all__ = [
    "bot",
    "CRMBot",
    "scheduler",
    "NotificationScheduler",
    "send_overdue_notification",
    "send_followup_reminder",
    "send_resume_reminder",
    "send_periodic_report",
    "send_new_task_notification",
    "get_user_avatar_url",
]

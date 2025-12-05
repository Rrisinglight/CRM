"""
Telegram Bot module for CRM notifications.

Usage:
    from app.bot import (
        get_bot,
        notify_overdue,
        notify_followup,
        notify_resume,
        notify_new_task,
        send_report,
        get_avatar_url,
    )
"""

from app.bot.telegram_bot import (
    get_bot,
    CRMTelegramBot,
    notify_overdue,
    notify_followup,
    notify_resume,
    notify_new_task,
    send_report,
    get_avatar_url,
)

from app.bot.scheduler import scheduler, NotificationScheduler

__all__ = [
    "get_bot",
    "CRMTelegramBot",
    "scheduler",
    "NotificationScheduler",
    "notify_overdue",
    "notify_followup",
    "notify_resume",
    "notify_new_task",
    "send_report",
    "get_avatar_url",
]

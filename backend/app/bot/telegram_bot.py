"""
Telegram Bot for CRM notifications using python-telegram-bot v21+

Features:
- User registration and account linking
- Task notifications (overdue, follow-up, resume, assignment)
- Periodic reports with scheduling
- Avatar fetching from Telegram
- Interactive menus and inline keyboards
"""

import asyncio
import logging
from typing import Optional, Dict, Any
from datetime import datetime, time, timedelta
from enum import Enum

from telegram import (
    Update,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    ReplyKeyboardMarkup,
    ReplyKeyboardRemove,
    BotCommand,
)
from telegram.ext import (
    Application,
    CommandHandler,
    CallbackQueryHandler,
    MessageHandler,
    ConversationHandler,
    ContextTypes,
    filters,
    JobQueue,
)
from telegram.error import TelegramError, Forbidden, BadRequest
from telegram.constants import ParseMode

from app.config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)


# ==================== Conversation States ====================

class LinkState(Enum):
    WAITING_EMAIL = 1


class ReportSettingsState(Enum):
    CHOOSING_FREQUENCY = 1
    CHOOSING_DAY = 2


# ==================== User Storage ====================

class UserStorage:
    """
    Simple in-memory user storage.
    Replace with database calls in production.
    """
    
    def __init__(self):
        self._users: Dict[int, Dict[str, Any]] = {}  # chat_id -> user_data
        self._email_index: Dict[str, int] = {}  # email -> chat_id
        self._username_index: Dict[str, int] = {}  # username -> chat_id
    
    def register_user(
        self,
        chat_id: int,
        email: str,
        username: Optional[str] = None,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None
    ):
        """Register or update user"""
        self._users[chat_id] = {
            "email": email,
            "username": username,
            "first_name": first_name,
            "last_name": last_name,
            "registered_at": datetime.utcnow(),
            "settings": {
                "notify_overdue": True,
                "notify_followup": True,
                "notify_resume": True,
                "notify_new_task": True,
                "report_frequency": None,  # None, "daily", "weekly", "monthly"
                "report_day": 1,  # day of week (0-6) or day of month
            }
        }
        self._email_index[email.lower()] = chat_id
        if username:
            self._username_index[username.lower()] = chat_id
    
    def unregister_user(self, chat_id: int):
        """Remove user registration"""
        if chat_id in self._users:
            user = self._users[chat_id]
            email = user.get("email", "").lower()
            username = user.get("username", "")
            
            if email in self._email_index:
                del self._email_index[email]
            if username and username.lower() in self._username_index:
                del self._username_index[username.lower()]
            del self._users[chat_id]
            return True
        return False
    
    def get_chat_id(self, identifier: str) -> Optional[int]:
        """Get chat_id by email or username"""
        identifier = identifier.lower().lstrip("@")
        
        if identifier in self._email_index:
            return self._email_index[identifier]
        if identifier in self._username_index:
            return self._username_index[identifier]
        return None
    
    def get_user(self, chat_id: int) -> Optional[Dict[str, Any]]:
        """Get user data by chat_id"""
        return self._users.get(chat_id)
    
    def update_settings(self, chat_id: int, **kwargs):
        """Update user notification settings"""
        if chat_id in self._users:
            self._users[chat_id]["settings"].update(kwargs)
    
    def get_all_users(self) -> Dict[int, Dict[str, Any]]:
        """Get all registered users"""
        return self._users.copy()


# Global storage instance
storage = UserStorage()


# ==================== Bot Class ====================

class CRMTelegramBot:
    """Main bot class for CRM Telegram integration"""
    
    def __init__(self, token: str):
        self.token = token
        self.application: Optional[Application] = None
        self._running = False
    
    async def setup(self):
        """Initialize and configure the bot application"""
        self.application = (
            Application.builder()
            .token(self.token)
            .build()
        )
        
        # Set bot commands menu
        await self._set_commands()
        
        # Register handlers
        self._add_handlers()
        
        # Setup scheduled jobs
        self._setup_jobs()
        
        logger.info("Telegram bot configured successfully")
    
    async def _set_commands(self):
        """Set bot command menu"""
        commands = [
            BotCommand("start", "Начать работу с ботом"),
            BotCommand("help", "Справка по командам"),
            BotCommand("link", "Связать аккаунт с CRM"),
            BotCommand("unlink", "Отвязать аккаунт"),
            BotCommand("status", "Статус подключения"),
            BotCommand("report", "Запросить отчёт"),
            BotCommand("settings", "Настройки уведомлений"),
            BotCommand("cancel", "Отменить текущее действие"),
        ]
        
        try:
            bot = self.application.bot
            await bot.set_my_commands(commands)
        except TelegramError as e:
            logger.error(f"Failed to set bot commands: {e}")
    
    def _add_handlers(self):
        """Register all handlers"""
        app = self.application
        
        # Conversation handler for account linking
        link_conv = ConversationHandler(
            entry_points=[CommandHandler("link", self._link_start)],
            states={
                LinkState.WAITING_EMAIL: [
                    MessageHandler(filters.TEXT & ~filters.COMMAND, self._link_email)
                ],
            },
            fallbacks=[CommandHandler("cancel", self._cancel)],
        )
        
        # Simple command handlers
        app.add_handler(CommandHandler("start", self._cmd_start))
        app.add_handler(CommandHandler("help", self._cmd_help))
        app.add_handler(link_conv)
        app.add_handler(CommandHandler("unlink", self._cmd_unlink))
        app.add_handler(CommandHandler("status", self._cmd_status))
        app.add_handler(CommandHandler("report", self._cmd_report))
        app.add_handler(CommandHandler("settings", self._cmd_settings))
        app.add_handler(CommandHandler("cancel", self._cancel))
        
        # Callback query handler for inline buttons
        app.add_handler(CallbackQueryHandler(self._handle_callback))
        
        # Error handler
        app.add_error_handler(self._handle_error)
    
    def _setup_jobs(self):
        """Setup scheduled jobs for periodic reports"""
        job_queue = self.application.job_queue
        
        # Check for overdue tasks every hour
        job_queue.run_repeating(
            self._job_check_overdue,
            interval=timedelta(hours=1),
            first=timedelta(minutes=5),
            name="check_overdue"
        )
        
        # Check for resume reminders every day at 9:00
        job_queue.run_daily(
            self._job_check_resume,
            time=time(hour=9, minute=0),
            name="check_resume"
        )
        
        # Send periodic reports (daily at 18:00)
        job_queue.run_daily(
            self._job_send_reports,
            time=time(hour=18, minute=0),
            name="send_reports"
        )
        
        logger.info("Scheduled jobs configured")
    
    # ==================== Command Handlers ====================
    
    async def _cmd_start(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /start command"""
        user = update.effective_user
        
        welcome_text = (
            f"👋 Привет, <b>{user.first_name}</b>!\n\n"
            "Я бот CRM-системы для журналистов.\n\n"
            "<b>Что я умею:</b>\n"
            "📌 Уведомления о просроченных задачах\n"
            "📝 Напоминания о follow-up со СМИ\n"
            "🔔 Напоминания о возобновлении задач\n"
            "📊 Периодические отчёты по аналитике\n\n"
            "Для начала свяжите свой аккаунт командой /link"
        )
        
        keyboard = [
            [
                InlineKeyboardButton("🔗 Связать аккаунт", callback_data="start_link"),
                InlineKeyboardButton("📖 Помощь", callback_data="show_help"),
            ],
        ]
        
        await update.message.reply_text(
            welcome_text,
            parse_mode=ParseMode.HTML,
            reply_markup=InlineKeyboardMarkup(keyboard)
        )
    
    async def _cmd_help(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /help command"""
        help_text = (
            "📖 <b>Команды бота:</b>\n\n"
            "/start — Начало работы\n"
            "/link — Связать аккаунт с CRM\n"
            "/unlink — Отвязать аккаунт\n"
            "/status — Статус подключения\n"
            "/report — Запросить отчёт\n"
            "/settings — Настройки уведомлений\n"
            "/cancel — Отменить действие\n\n"
            "<b>Автоматические уведомления:</b>\n"
            "• ⚠️ Просрочка задачи (>3 дней)\n"
            "• 📝 Follow-up со СМИ\n"
            "• 🔔 Возобновление отложенных задач\n"
            "• 🆕 Назначение на задачу\n"
            "• 📊 Периодические отчёты"
        )
        
        await update.message.reply_text(help_text, parse_mode=ParseMode.HTML)
    
    async def _link_start(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Start account linking conversation"""
        await update.message.reply_text(
            "🔗 <b>Связывание аккаунта</b>\n\n"
            "Введите ваш email из CRM-системы:",
            parse_mode=ParseMode.HTML,
            reply_markup=ReplyKeyboardRemove()
        )
        return LinkState.WAITING_EMAIL
    
    async def _link_email(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Process email for account linking"""
        email = update.message.text.strip().lower()
        user = update.effective_user
        chat_id = update.effective_chat.id
        
        # Simple email validation
        if "@" not in email or "." not in email:
            await update.message.reply_text(
                "❌ Неверный формат email. Попробуйте ещё раз:"
            )
            return LinkState.WAITING_EMAIL
        
        # Register user
        storage.register_user(
            chat_id=chat_id,
            email=email,
            username=user.username,
            first_name=user.first_name,
            last_name=user.last_name
        )
        
        await update.message.reply_text(
            f"✅ <b>Аккаунт успешно связан!</b>\n\n"
            f"📧 Email: <code>{email}</code>\n"
            f"👤 Telegram: @{user.username or 'не указан'}\n\n"
            f"Теперь вы будете получать уведомления.\n"
            f"Настройте их в /settings",
            parse_mode=ParseMode.HTML
        )
        
        logger.info(f"User linked: {email} (chat_id: {chat_id})")
        return ConversationHandler.END
    
    async def _cmd_unlink(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /unlink command"""
        chat_id = update.effective_chat.id
        
        if storage.unregister_user(chat_id):
            await update.message.reply_text(
                "✅ Аккаунт отвязан.\n"
                "Вы больше не будете получать уведомления."
            )
        else:
            await update.message.reply_text(
                "ℹ️ Ваш аккаунт не был связан с CRM.\n"
                "Используйте /link для подключения."
            )
    
    async def _cmd_status(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /status command"""
        chat_id = update.effective_chat.id
        user_data = storage.get_user(chat_id)
        
        if user_data:
            settings_data = user_data["settings"]
            status_icons = {
                True: "✅",
                False: "❌"
            }
            
            text = (
                "📊 <b>Статус подключения</b>\n\n"
                f"✅ Аккаунт связан\n"
                f"📧 {user_data['email']}\n\n"
                f"<b>Уведомления:</b>\n"
                f"{status_icons[settings_data['notify_overdue']]} Просрочки\n"
                f"{status_icons[settings_data['notify_followup']]} Follow-up\n"
                f"{status_icons[settings_data['notify_resume']]} Возобновление\n"
                f"{status_icons[settings_data['notify_new_task']]} Новые задачи\n"
            )
        else:
            text = (
                "📊 <b>Статус подключения</b>\n\n"
                "❌ Аккаунт не связан\n\n"
                "Используйте /link для подключения."
            )
        
        await update.message.reply_text(text, parse_mode=ParseMode.HTML)
    
    async def _cmd_report(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /report command"""
        keyboard = [
            [
                InlineKeyboardButton("📅 Месяц", callback_data="report:month"),
                InlineKeyboardButton("📆 Квартал", callback_data="report:quarter"),
            ],
            [
                InlineKeyboardButton("📊 Полгода", callback_data="report:half_year"),
                InlineKeyboardButton("📈 Год", callback_data="report:year"),
            ],
        ]
        
        await update.message.reply_text(
            "📊 <b>Запрос отчёта</b>\n\n"
            "Выберите период:",
            parse_mode=ParseMode.HTML,
            reply_markup=InlineKeyboardMarkup(keyboard)
        )
    
    async def _cmd_settings(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /settings command"""
        chat_id = update.effective_chat.id
        user_data = storage.get_user(chat_id)
        
        if not user_data:
            await update.message.reply_text(
                "❌ Сначала свяжите аккаунт: /link"
            )
            return
        
        settings_data = user_data["settings"]
        
        def toggle_text(enabled: bool, name: str) -> str:
            return f"{'🔔' if enabled else '🔕'} {name}: {'ВКЛ' if enabled else 'ВЫКЛ'}"
        
        keyboard = [
            [InlineKeyboardButton(
                toggle_text(settings_data["notify_overdue"], "Просрочки"),
                callback_data="toggle:notify_overdue"
            )],
            [InlineKeyboardButton(
                toggle_text(settings_data["notify_followup"], "Follow-up"),
                callback_data="toggle:notify_followup"
            )],
            [InlineKeyboardButton(
                toggle_text(settings_data["notify_resume"], "Возобновление"),
                callback_data="toggle:notify_resume"
            )],
            [InlineKeyboardButton(
                toggle_text(settings_data["notify_new_task"], "Новые задачи"),
                callback_data="toggle:notify_new_task"
            )],
            [InlineKeyboardButton("📊 Периодические отчёты", callback_data="report_settings")],
        ]
        
        await update.message.reply_text(
            "⚙️ <b>Настройки уведомлений</b>\n\n"
            "Нажмите для включения/выключения:",
            parse_mode=ParseMode.HTML,
            reply_markup=InlineKeyboardMarkup(keyboard)
        )
    
    async def _cancel(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /cancel command"""
        await update.message.reply_text(
            "❌ Действие отменено.",
            reply_markup=ReplyKeyboardRemove()
        )
        return ConversationHandler.END
    
    # ==================== Callback Handler ====================
    
    async def _handle_callback(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle inline button callbacks"""
        query = update.callback_query
        await query.answer()
        
        data = query.data
        chat_id = query.message.chat_id
        
        # Start linking
        if data == "start_link":
            await query.edit_message_text(
                "🔗 <b>Связывание аккаунта</b>\n\n"
                "Отправьте команду:\n"
                "/link\n\n"
                "И затем введите ваш email из CRM.",
                parse_mode=ParseMode.HTML
            )
        
        # Show help
        elif data == "show_help":
            await query.edit_message_text(
                "📖 <b>Справка</b>\n\n"
                "Используйте /help для полного списка команд.",
                parse_mode=ParseMode.HTML
            )
        
        # Report request
        elif data.startswith("report:"):
            period = data.split(":")[1]
            period_names = {
                "month": "месяц",
                "quarter": "квартал", 
                "half_year": "полугодие",
                "year": "год"
            }
            
            await query.edit_message_text(
                f"📊 <b>Отчёт за {period_names.get(period, period)}</b>\n\n"
                "⏳ Формирование отчёта...\n\n"
                "<i>Данные будут получены из CRM</i>",
                parse_mode=ParseMode.HTML
            )
            
            # Here you would fetch actual data from CRM API
            # For now, sending placeholder
            await asyncio.sleep(1)
            await query.edit_message_text(
                f"📊 <b>Отчёт за {period_names.get(period, period)}</b>\n\n"
                "📋 Задач в работе: <b>—</b>\n"
                "⏰ Просрочено: <b>—</b>\n"
                "✏️ На проверке: <b>—</b>\n"
                "✅ Опубликовано: <b>—</b>\n\n"
                "<i>Подключите CRM API для данных</i>",
                parse_mode=ParseMode.HTML
            )
        
        # Toggle settings
        elif data.startswith("toggle:"):
            setting_key = data.split(":")[1]
            user_data = storage.get_user(chat_id)
            
            if user_data:
                current = user_data["settings"].get(setting_key, False)
                storage.update_settings(chat_id, **{setting_key: not current})
                
                await query.answer(
                    f"{'🔔 Включено' if not current else '🔕 Выключено'}",
                    show_alert=False
                )
                
                # Refresh settings menu
                await self._refresh_settings_menu(query, chat_id)
        
        # Report settings
        elif data == "report_settings":
            keyboard = [
                [InlineKeyboardButton("📅 Ежедневно", callback_data="set_report:daily")],
                [InlineKeyboardButton("📆 Еженедельно", callback_data="set_report:weekly")],
                [InlineKeyboardButton("📊 Ежемесячно", callback_data="set_report:monthly")],
                [InlineKeyboardButton("🚫 Отключить", callback_data="set_report:none")],
                [InlineKeyboardButton("◀️ Назад", callback_data="back_settings")],
            ]
            
            await query.edit_message_text(
                "📊 <b>Периодические отчёты</b>\n\n"
                "Выберите частоту отправки:",
                parse_mode=ParseMode.HTML,
                reply_markup=InlineKeyboardMarkup(keyboard)
            )
        
        # Set report frequency
        elif data.startswith("set_report:"):
            frequency = data.split(":")[1]
            freq_value = frequency if frequency != "none" else None
            storage.update_settings(chat_id, report_frequency=freq_value)
            
            freq_names = {
                "daily": "ежедневно",
                "weekly": "еженедельно",
                "monthly": "ежемесячно",
                "none": "отключены"
            }
            
            await query.answer(
                f"Отчёты: {freq_names.get(frequency, frequency)}",
                show_alert=True
            )
            
            # Go back to settings
            await self._refresh_settings_menu(query, chat_id)
        
        # Back to settings
        elif data == "back_settings":
            await self._refresh_settings_menu(query, chat_id)
    
    async def _refresh_settings_menu(self, query, chat_id: int):
        """Refresh settings menu after changes"""
        user_data = storage.get_user(chat_id)
        if not user_data:
            return
        
        settings_data = user_data["settings"]
        
        def toggle_text(enabled: bool, name: str) -> str:
            return f"{'🔔' if enabled else '🔕'} {name}: {'ВКЛ' if enabled else 'ВЫКЛ'}"
        
        keyboard = [
            [InlineKeyboardButton(
                toggle_text(settings_data["notify_overdue"], "Просрочки"),
                callback_data="toggle:notify_overdue"
            )],
            [InlineKeyboardButton(
                toggle_text(settings_data["notify_followup"], "Follow-up"),
                callback_data="toggle:notify_followup"
            )],
            [InlineKeyboardButton(
                toggle_text(settings_data["notify_resume"], "Возобновление"),
                callback_data="toggle:notify_resume"
            )],
            [InlineKeyboardButton(
                toggle_text(settings_data["notify_new_task"], "Новые задачи"),
                callback_data="toggle:notify_new_task"
            )],
            [InlineKeyboardButton("📊 Периодические отчёты", callback_data="report_settings")],
        ]
        
        await query.edit_message_text(
            "⚙️ <b>Настройки уведомлений</b>\n\n"
            "Нажмите для включения/выключения:",
            parse_mode=ParseMode.HTML,
            reply_markup=InlineKeyboardMarkup(keyboard)
        )
    
    # ==================== Scheduled Jobs ====================
    
    async def _job_check_overdue(self, context: ContextTypes.DEFAULT_TYPE):
        """Check for overdue tasks and send notifications"""
        logger.debug("Running overdue check job")
        # In production: query database for overdue tasks and notify users
    
    async def _job_check_resume(self, context: ContextTypes.DEFAULT_TYPE):
        """Check for tasks that need to be resumed"""
        logger.debug("Running resume check job")
        # In production: query database for tasks with resume date = today
    
    async def _job_send_reports(self, context: ContextTypes.DEFAULT_TYPE):
        """Send periodic reports to users"""
        logger.debug("Running periodic reports job")
        # In production: generate and send reports to users with enabled settings
    
    # ==================== Error Handler ====================
    
    async def _handle_error(self, update: object, context: ContextTypes.DEFAULT_TYPE):
        """Handle errors"""
        logger.error(f"Telegram error: {context.error}")
        
        if isinstance(context.error, Forbidden):
            logger.warning("Bot was blocked by user")
        elif isinstance(context.error, BadRequest):
            logger.error(f"Bad request: {context.error}")
    
    # ==================== Public Notification Methods ====================
    
    async def send_notification(
        self,
        identifier: str,
        text: str,
        reply_markup: Optional[InlineKeyboardMarkup] = None
    ) -> bool:
        """Send notification to user by email or username"""
        chat_id = storage.get_chat_id(identifier)
        if not chat_id:
            logger.warning(f"User not found: {identifier}")
            return False
        
        try:
            await self.application.bot.send_message(
                chat_id=chat_id,
                text=text,
                parse_mode=ParseMode.HTML,
                reply_markup=reply_markup
            )
            return True
        except TelegramError as e:
            logger.error(f"Failed to send notification to {identifier}: {e}")
            return False
    
    async def notify_overdue(
        self,
        identifier: str,
        task_title: str,
        task_id: str,
        days: int,
        crm_url: str = ""
    ):
        """Send overdue task notification"""
        user_data = storage.get_user(storage.get_chat_id(identifier) or 0)
        if user_data and not user_data["settings"]["notify_overdue"]:
            return
        
        text = (
            "⚠️ <b>Задача просрочена</b>\n\n"
            f"📌 {task_title}\n"
            f"⏰ На этапе: <b>{days} дней</b>\n\n"
            "Требуется ваше внимание!"
        )
        
        keyboard = None
        if crm_url:
            keyboard = InlineKeyboardMarkup([
                [InlineKeyboardButton("📋 Открыть задачу", url=f"{crm_url}/tasks/{task_id}")]
            ])
        
        await self.send_notification(identifier, text, keyboard)
    
    async def notify_followup(
        self,
        identifier: str,
        task_title: str,
        task_id: str,
        media_name: str,
        days_since_sent: int,
        crm_url: str = ""
    ):
        """Send follow-up reminder"""
        user_data = storage.get_user(storage.get_chat_id(identifier) or 0)
        if user_data and not user_data["settings"]["notify_followup"]:
            return
        
        text = (
            "📝 <b>Напоминание о follow-up</b>\n\n"
            f"📌 {task_title}\n"
            f"📰 СМИ: {media_name}\n"
            f"📅 В редакции: <b>{days_since_sent} дней</b>\n\n"
            "Рекомендуем уточнить статус."
        )
        
        keyboard = None
        if crm_url:
            keyboard = InlineKeyboardMarkup([
                [InlineKeyboardButton("📋 Открыть задачу", url=f"{crm_url}/tasks/{task_id}")]
            ])
        
        await self.send_notification(identifier, text, keyboard)
    
    async def notify_resume(
        self,
        identifier: str,
        task_title: str,
        task_id: str,
        resume_date: str,
        crm_url: str = ""
    ):
        """Send task resume reminder"""
        user_data = storage.get_user(storage.get_chat_id(identifier) or 0)
        if user_data and not user_data["settings"]["notify_resume"]:
            return
        
        text = (
            "🔔 <b>Возобновление задачи</b>\n\n"
            f"📌 {task_title}\n"
            f"📅 Дата: {resume_date}\n\n"
            "Пора вернуть задачу в работу!"
        )
        
        keyboard = [[InlineKeyboardButton("✅ Вернуть в работу", callback_data=f"action:resume:{task_id}")]]
        if crm_url:
            keyboard.insert(0, [InlineKeyboardButton("📋 Открыть", url=f"{crm_url}/tasks/{task_id}")])
        
        await self.send_notification(identifier, text, InlineKeyboardMarkup(keyboard))
    
    async def notify_new_task(
        self,
        identifier: str,
        task_title: str,
        task_id: str,
        client_name: str,
        task_type: str,
        role: str,
        crm_url: str = ""
    ):
        """Notify about new task assignment"""
        user_data = storage.get_user(storage.get_chat_id(identifier) or 0)
        if user_data and not user_data["settings"]["notify_new_task"]:
            return
        
        type_labels = {
            "article": "📰 Статья",
            "recommendation": "📝 Рекомендательное",
            "cover_letter": "✉️ Сопроводительное",
        }
        
        role_labels = {
            "author": "Автор",
            "editor": "Редактор",
            "manager": "Менеджер",
        }
        
        text = (
            "🆕 <b>Новое назначение</b>\n\n"
            f"📌 {task_title}\n"
            f"👤 Клиент: {client_name}\n"
            f"📋 Тип: {type_labels.get(task_type, task_type)}\n"
            f"🎯 Роль: <b>{role_labels.get(role, role)}</b>"
        )
        
        keyboard = None
        if crm_url:
            keyboard = InlineKeyboardMarkup([
                [InlineKeyboardButton("📋 Открыть задачу", url=f"{crm_url}/tasks/{task_id}")]
            ])
        
        await self.send_notification(identifier, text, keyboard)
    
    async def send_report(
        self,
        identifier: str,
        period: str,
        wip: int,
        overdue: int,
        editor_review: int,
        published: int,
        crm_url: str = ""
    ):
        """Send periodic analytics report"""
        period_names = {
            "month": "месяц",
            "quarter": "квартал",
            "half_year": "полугодие",
            "year": "год",
        }
        
        trend = "📈" if published > 0 else "📉"
        overdue_warn = " ⚠️" if overdue > 0 else ""
        
        text = (
            f"📊 <b>Отчёт за {period_names.get(period, period)}</b>\n\n"
            f"📋 В работе: <b>{wip}</b>\n"
            f"⏰ Просрочено: <b>{overdue}</b>{overdue_warn}\n"
            f"✏️ На проверке: <b>{editor_review}</b>\n"
            f"✅ Опубликовано: <b>{published}</b> {trend}"
        )
        
        keyboard = None
        if crm_url:
            keyboard = InlineKeyboardMarkup([
                [InlineKeyboardButton("📊 Подробнее", url=f"{crm_url}/analytics?period={period}")]
            ])
        
        await self.send_notification(identifier, text, keyboard)
    
    async def get_avatar_url(self, identifier: str) -> Optional[str]:
        """Get user's Telegram avatar URL"""
        chat_id = storage.get_chat_id(identifier)
        if not chat_id:
            return None
        
        try:
            photos = await self.application.bot.get_user_profile_photos(
                user_id=chat_id,
                limit=1
            )
            if photos.total_count > 0:
                file = await self.application.bot.get_file(photos.photos[0][0].file_id)
                return f"https://api.telegram.org/file/bot{self.token}/{file.file_path}"
            return None
        except TelegramError as e:
            logger.error(f"Failed to get avatar: {e}")
            return None
    
    # ==================== Bot Lifecycle ====================
    
    async def start(self):
        """Start the bot"""
        if not self.application:
            await self.setup()
        
        self._running = True
        logger.info("Starting Telegram bot (polling)...")
        
        await self.application.initialize()
        await self.application.start()
        await self.application.updater.start_polling(
            drop_pending_updates=True,
            allowed_updates=Update.ALL_TYPES
        )
    
    async def stop(self):
        """Stop the bot"""
        if self.application and self._running:
            logger.info("Stopping Telegram bot...")
            self._running = False
            await self.application.updater.stop()
            await self.application.stop()
            await self.application.shutdown()


# ==================== Global Instance and Helpers ====================

_bot: Optional[CRMTelegramBot] = None


def get_bot() -> Optional[CRMTelegramBot]:
    """Get the global bot instance"""
    global _bot
    if _bot is None and settings.telegram_bot_token:
        _bot = CRMTelegramBot(settings.telegram_bot_token)
    return _bot


async def start_bot():
    """Start the global bot instance"""
    bot = get_bot()
    if bot:
        await bot.start()


async def stop_bot():
    """Stop the global bot instance"""
    if _bot:
        await _bot.stop()


# Convenience functions for external use
async def notify_overdue(identifier: str, task_title: str, task_id: str, days: int, crm_url: str = ""):
    bot = get_bot()
    if bot and bot.application:
        await bot.notify_overdue(identifier, task_title, task_id, days, crm_url)


async def notify_followup(identifier: str, task_title: str, task_id: str, media_name: str, days: int, crm_url: str = ""):
    bot = get_bot()
    if bot and bot.application:
        await bot.notify_followup(identifier, task_title, task_id, media_name, days, crm_url)


async def notify_resume(identifier: str, task_title: str, task_id: str, resume_date: str, crm_url: str = ""):
    bot = get_bot()
    if bot and bot.application:
        await bot.notify_resume(identifier, task_title, task_id, resume_date, crm_url)


async def notify_new_task(identifier: str, task_title: str, task_id: str, client_name: str, task_type: str, role: str, crm_url: str = ""):
    bot = get_bot()
    if bot and bot.application:
        await bot.notify_new_task(identifier, task_title, task_id, client_name, task_type, role, crm_url)


async def send_report(identifier: str, period: str, wip: int, overdue: int, editor_review: int, published: int, crm_url: str = ""):
    bot = get_bot()
    if bot and bot.application:
        await bot.send_report(identifier, period, wip, overdue, editor_review, published, crm_url)


async def get_avatar_url(identifier: str) -> Optional[str]:
    bot = get_bot()
    if bot and bot.application:
        return await bot.get_avatar_url(identifier)
    return None

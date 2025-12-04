
# CRM для журналистов

Система управления задачами для команды журналистов с канбан-доской, адаптивными карточками и Telegram-интеграцией.

## Стек технологий

- **Backend**: Python (FastAPI) + SQLAlchemy + PostgreSQL
- **Frontend**: SvelteKit + Skeleton UI + Tailwind CSS
- **Reverse Proxy**: Nginx

## Установка и запуск

### Требования

- Python 3.11+
- Node.js 20+
- PostgreSQL 16+
- Nginx

### 1. Настройка базы данных

```bash
# Создание базы данных
sudo -u postgres psql
CREATE DATABASE crm;
CREATE USER crm WITH PASSWORD 'crm_password';
GRANT ALL PRIVILEGES ON DATABASE crm TO crm;
\q
```

### 2. Backend

```bash
cd backend

# Создание виртуального окружения
python3 -m venv venv
source venv/bin/activate

# Установка зависимостей
pip install -r requirements.txt

# Настройка переменных окружения
cp .env.example .env
# Отредактируйте .env с вашими настройками

# Миграции
alembic upgrade head

# Запуск
uvicorn main:app --host 127.0.0.1 --port 8000
```

### 3. Frontend

```bash
cd frontend

# Установка зависимостей
npm install

# Разработка
npm run dev

# Сборка для продакшена
npm run build
node build
```

### 4. Nginx

```bash
# Копирование конфига
sudo cp nginx/crm.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/crm.conf /etc/nginx/sites-enabled/

# Проверка и перезапуск
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Systemd сервисы (продакшен)

#### Backend

```ini
# /etc/systemd/system/crm-backend.service
[Unit]
Description=CRM Backend
After=postgresql.service

[Service]
User=www-data
WorkingDirectory=/var/www/crm/backend
Environment="DATABASE_URL=postgresql+asyncpg://crm:password@localhost/crm"
ExecStart=/var/www/crm/backend/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

#### Frontend

```ini
# /etc/systemd/system/crm-frontend.service
[Unit]
Description=CRM Frontend
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/crm/frontend
ExecStart=/usr/bin/node build
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable crm-backend crm-frontend
sudo systemctl start crm-backend crm-frontend
```

## Структура проекта

```
crm/
├── backend/
│   ├── app/
│   │   ├── api/           # REST endpoints
│   │   ├── models/        # SQLAlchemy модели
│   │   ├── schemas/       # Pydantic схемы
│   │   ├── services/      # Бизнес-логика
│   │   ├── bot/           # Telegram-бот
│   │   └── ws/            # WebSocket
│   ├── alembic/           # Миграции
│   └── main.py
├── frontend/
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/
│   │   │   │   ├── kanban/    # Канбан-доска
│   │   │   │   ├── cards/     # Адаптивные карточки
│   │   │   │   ├── search/    # Поиск с плашками
│   │   │   │   └── chat/      # Чат карточки
│   │   │   └── stores/        # Svelte stores
│   │   └── routes/            # Страницы
│   └── package.json
├── uploads/                   # Загруженные файлы
└── nginx/
    └── crm.conf
```

## Этапы канбана

1. **Новые** — новые задачи без назначенных ответственных
2. **В работе** — автор пишет текст
3. **На проверке редактора** — редактор проверяет
4. **На согласовании у клиента** — ждём обратную связь от клиента
5. **Согласовано клиентом** — готово к отправке в СМИ
6. **Отправлено в СМИ** — материал отправлен в редакцию
7. **Опубликовано** — материал опубликован
8. **Отложено** — задача приостановлена

## API

- `POST /api/auth/register` — регистрация
- `POST /api/auth/login` — вход
- `GET /api/tasks/` — список задач
- `POST /api/tasks/` — создание задачи
- `PATCH /api/tasks/{id}/status` — смена статуса
- `POST /api/tasks/{id}/undo` — отмена (20 сек)
- `GET /api/clients/` — клиенты
- `GET /api/media/` — СМИ
- `GET /api/analytics/summary` — аналитика
- `WS /api/ws/board` — WebSocket обновления

## Telegram-бот

Для настройки бота:

1. Создайте бота через @BotFather
2. Добавьте токен в `.env`:
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token
   ```
3. Бот будет отправлять:
   - Уведомления о просрочках
   - Напоминания о follow-up
   - Периодические отчёты

## Разработка

```bash
# Backend (с авторелоадом)
cd backend
source venv/bin/activate
uvicorn main:app --reload

# Frontend (dev server)
cd frontend
npm run dev
```

## Лицензия

MIT


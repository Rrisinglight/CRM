#!/usr/bin/env python3
"""
Standalone script to run the Telegram bot.

Usage:
    python run_bot.py

Or with systemd:
    [Service]
    ExecStart=/path/to/venv/bin/python /path/to/run_bot.py
"""

import asyncio
import logging
import signal
import sys

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
    ]
)
logger = logging.getLogger(__name__)


async def main():
    """Main entry point for the bot"""
    from app.bot.telegram_bot import bot
    from app.bot.scheduler import scheduler

    # Signal handlers for graceful shutdown
    loop = asyncio.get_event_loop()
    stop_event = asyncio.Event()

    def signal_handler():
        logger.info("Received shutdown signal")
        stop_event.set()

    for sig in (signal.SIGINT, signal.SIGTERM):
        loop.add_signal_handler(sig, signal_handler)

    try:
        # Initialize and start bot
        await bot.initialize()
        await bot.start()
        logger.info("Telegram bot started successfully")

        # Start scheduler
        await scheduler.start()
        logger.info("Notification scheduler started")

        # Wait for shutdown signal
        await stop_event.wait()

    except Exception as e:
        logger.error(f"Error running bot: {e}")
        raise

    finally:
        # Graceful shutdown
        logger.info("Shutting down...")
        await scheduler.stop()
        await bot.stop()
        logger.info("Bot stopped")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Bot stopped by user")
    except Exception as e:
        logger.error(f"Bot crashed: {e}")
        sys.exit(1)


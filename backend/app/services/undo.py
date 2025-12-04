from datetime import datetime, timedelta
import asyncio

# In-memory storage for undo states
# Key: task_id, Value: {"state": dict, "expires_at": datetime}
_undo_states: dict[str, dict] = {}


async def save_undo_state(task_id: str, previous_state: dict):
    """Save task state for undo within 20 seconds"""
    _undo_states[task_id] = {
        "state": previous_state,
        "expires_at": datetime.utcnow() + timedelta(seconds=20)
    }
    # Schedule cleanup
    asyncio.create_task(_cleanup_after(task_id, 20))


async def get_undo_state(task_id: str) -> dict | None:
    """Get previous state for undo (if not expired)"""
    data = _undo_states.get(task_id)
    if data and data["expires_at"] > datetime.utcnow():
        del _undo_states[task_id]
        return data["state"]
    return None


async def _cleanup_after(task_id: str, seconds: int):
    """Remove undo state after expiration"""
    await asyncio.sleep(seconds)
    _undo_states.pop(task_id, None)


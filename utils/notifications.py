import core.config as config
import utils.webhook as webhook
from utils.webhook import StopReason

_PROGRESS_MILESTONES = {
    "Classic Year Early Jan",
    "Senior Year Early Jan",
    "URA Finals - Pre-race",
}

_last_progress_year = ""
_stop_sent = False


def _webhook_enabled():
    return bool(getattr(config, "WEBHOOK_URL", "").strip())


def on_started():
    global _stop_sent
    _stop_sent = False
    if not _webhook_enabled():
        return
    webhook.send_started()


def on_stopped(reason: StopReason):
    global _stop_sent
    if _stop_sent:
        return
    _stop_sent = True
    if not _webhook_enabled():
        return
    webhook.send_stopped(reason)


def on_progress(state_obj: dict):
    global _last_progress_year
    if not _webhook_enabled():
        return
    if not getattr(config, "WEBHOOK_PROGRESS_ENABLED", True):
        return
    year = state_obj.get("year", "")
    if year not in _PROGRESS_MILESTONES or year == _last_progress_year:
        return
    _last_progress_year = year
    webhook.send_progress(state_obj)


def reset_progress_tracking():
    global _last_progress_year, _stop_sent
    _last_progress_year = ""
    _stop_sent = False


def on_skills_bought(skills: list[str]):
    if not _webhook_enabled():
        return
    if not getattr(config, "WEBHOOK_SKILL_BUY_ENABLED", True):
        return
    webhook.send_skills_bought(skills)

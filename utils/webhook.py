import json
import queue
import threading
import urllib.request
from datetime import datetime, timezone
from enum import Enum

import core.bot as bot
import core.config as config
from utils.log import info

_TIMEOUT = 5
_USERNAME = "Tazuna (Uma-Auto)"
_FOOTER = "Uma-Auto Notifier"

_COLOR_SUCCESS = 0x2ECC71
_COLOR_ERROR = 0xE74C3C
_COLOR_WARNING = 0xF1C40F
_COLOR_INFO = 0x3498DB


class StopReason(str, Enum):
    FINISHED = "finished"
    STUCK = "stuck"
    CLAW_MACHINE = "claw machine"
    UNKNOWN = "unknown"


_STOP_STYLES = {
    StopReason.FINISHED: (_COLOR_SUCCESS, f"🎉 Training Finished! - (Instance {bot.instance})"),
    StopReason.STUCK: (_COLOR_ERROR, f"🚨 Tazuna Got Stuck - (Instance {bot.instance})"),
    StopReason.CLAW_MACHINE: (_COLOR_WARNING, f"🕹️ Claw Machine - Manual Play Required - (Instance {bot.instance})"),
    StopReason.UNKNOWN: (_COLOR_ERROR, f"⚠️ Uma-Auto Stopped - (Instance {bot.instance})"),
}

_MILESTONE_LABELS = {
    "Classic Year Early Jan": "Classic Year",
    "Senior Year Early Jan": "Senior Year",
    "URA Finals - Pre-race": "URA Finals",
}

_delivery_queue: queue.Queue = queue.Queue()


def _delivery_worker():
    while True:
        url, payload = _delivery_queue.get()
        try:
            req = urllib.request.Request(url, data=payload, method="POST")
            req.add_header("Content-Type", "application/json")
            req.add_header("User-Agent", "UmaAuto/1.0")
            with urllib.request.urlopen(req, timeout=_TIMEOUT):
                pass
        except Exception as exc:
            info(f"Webhook delivery failed: {exc}")
        finally:
            _delivery_queue.task_done()


threading.Thread(target=_delivery_worker, daemon=True, name="webhook-delivery").start()


def _url():
    return getattr(config, "WEBHOOK_URL", "").strip()


def _config_name():
    return getattr(config, "CONFIG_NAME", "unknown")


def _timestamp():
    return datetime.now(timezone.utc).isoformat()


def _field(name, value, inline=True):
    return {"name": name, "value": value, "inline": inline}


def _embed(title, color, fields, footer=None):
    return {
        "title": title,
        "color": color,
        "fields": fields + [_field("Config", f"`{_config_name()}`")],
        "timestamp": _timestamp(),
        "footer": {"text": footer or _FOOTER},
    }


def _post(embed):
    url = _url()
    if not url:
        return
    payload = json.dumps({"username": _USERNAME, "embeds": [embed]}).encode("utf-8")
    _delivery_queue.put((url, payload))


def send_started():
    _post(_embed(title=f"🥕 Uma-Auto Started - (Instance {bot.instance})", color=_COLOR_INFO, fields=[]))


def send_stopped(reason: StopReason):
    color, title = _STOP_STYLES.get(reason, _STOP_STYLES[StopReason.UNKNOWN])
    _post(_embed(title=title, color=color, fields=[]))


def send_progress(state_obj: dict):
    stats = state_obj.get("current_stats", {})
    year_key = state_obj.get("year", "")
    label = _MILESTONE_LABELS.get(year_key, year_key)

    def stat(key):
        val = stats.get(key, -1)
        return str(val) if val != -1 else "?"

    energy = state_obj.get("energy_level", "?")
    max_energy = state_obj.get("max_energy", "?")

    _post(
        _embed(
            title=f"📊 {label} - Stat Snapshot - (Instance {bot.instance})",
            color=_COLOR_INFO,
            fields=[
                _field("Speed", stat("spd")),
                _field("Stamina", stat("sta")),
                _field("Power", stat("pwr")),
                _field("Guts", stat("guts")),
                _field("Wit", stat("wit")),
                _field("Skill Pts", stat("sp")),
                _field("Energy", f"{energy}/{max_energy}", inline=False),
            ],
        )
    )


def send_skills_bought(skills: list[str]):
    skill_list = "\n".join(f"- {s}" for s in skills)
    _post(
        _embed(
            title=f"🎓 Skills Purchased - (Instance {bot.instance})",
            color=_COLOR_SUCCESS,
            fields=[_field("Skills", skill_list, inline=False)],
        )
    )

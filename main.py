import time
import threading
from typing import Optional

import pygetwindow as gw
import uvicorn
import keyboard
import pyautogui

from core.execute import career_lobby
import core.state as state
from server.main import app

# Hotkey to start/stop the bot
HOTKEY = "f1"


def focus_umamusume() -> bool:
    """
    Focuses the 'Umamusume' window. Restores it if minimized,
    or toggles minimize/restore to bring it to foreground.
    """
    try:
        windows = gw.getWindowsWithTitle("Umamusume")
        target_window = next((w for w in windows if w.title.strip() == "Umamusume"), None)
        if target_window is None:
            print("[ERROR] Umamusume window not found.")
            return False

        if target_window.isMinimized:
            target_window.restore()
        else:
            target_window.minimize()
            time.sleep(0.2)
            target_window.restore()
            time.sleep(0.5)
        return True
    except Exception as e:
        print(f"[ERROR] Exception while focusing window: {e}")
        return False


def main() -> None:
    """Main bot execution loop."""
    print("[INFO] Uma Auto starting!")
    if focus_umamusume():
        state.reload_config()
        career_lobby()
    else:
        print("[ERROR] Failed to focus Umamusume window. Bot cannot start.")


def hotkey_listener() -> None:
    """Threaded listener to start/stop the bot with a hotkey."""
    while True:
        keyboard.wait(HOTKEY)
        if not state.is_bot_running:
            print("[BOT] Starting...")
            state.is_bot_running = True
            t = threading.Thread(target=main, daemon=True)
            t.start()
        else:
            print("[BOT] Stopping...")
            state.is_bot_running = False
        time.sleep(0.5)  # Prevent rapid toggling


def start_server(host: str = "127.0.0.1", port: int = 8000) -> None:
    """
    Start the local configuration server using Uvicorn.
    Checks screen resolution before launching.
    """
    screen_res = pyautogui.size()
    if screen_res.width != 1920 or screen_res.height != 1080:
        print(f"[ERROR] Your resolution is {screen_res.width}x{screen_res.height}. "
              "Please set your screen to 1920x1080.")
        return

    print(f"[INFO] Press '{HOTKEY}' to start/stop the bot.")
    print(f"[SERVER] Open http://{host}:{port} to configure the bot.")

    config = uvicorn.Config(app, host=host, port=port, workers=1, log_level="warning")
    server = uvicorn.Server(config)
    server.run()


if __name__ == "__main__":
    # Start the hotkey listener in a separate daemon thread
    threading.Thread(target=hotkey_listener, daemon=True).start()
    # Start the configuration server
    start_server()

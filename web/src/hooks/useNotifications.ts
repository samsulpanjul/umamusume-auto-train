import { useEffect } from "react";
import type { Config } from "../types";

export function useNotifications(config: Config) {
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/notifications-poll");
        const data = await res.json();
        
        if (data.notifications && data.notifications.length > 0) {
          data.notifications.forEach((type: string) => {
            if (!config.notifications_enabled) return;

            let soundFile = "";
            if (type === "error") soundFile = config.error_notification;
            if (type === "info") soundFile = config.info_notification;
            if (type === "success") soundFile = config.success_notification;

            if (soundFile) {
              const audio = new Audio(`/notifications/${soundFile}`);
              audio.play().catch(e => console.error("Failed to play notification sound:", e));
            }
          });
        }
      } catch (error) {
        // Silently fail polling
      }
    };

    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [config.notifications_enabled, config.error_notification]);
}

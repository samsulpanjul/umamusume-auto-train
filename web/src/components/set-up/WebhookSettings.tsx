import { useState, useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import Tooltips from "@/components/_c/Tooltips";

const WEBHOOK_STORAGE_KEY = "webhook_url";
const PROGRESS_STORAGE_KEY = "webhook_progress_enabled";

function readStoredUrl(): string {
  return localStorage.getItem(WEBHOOK_STORAGE_KEY) || "";
}

function readStoredProgress(): boolean {
  return localStorage.getItem(PROGRESS_STORAGE_KEY) !== "false";
}

function syncToServer(url: string, progress: boolean) {
  fetch("/api/webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ webhook_url: url, webhook_progress_enabled: progress }),
  }).catch(console.error);
}

function persistAndSync(url: string, progress: boolean) {
  localStorage.setItem(WEBHOOK_STORAGE_KEY, url);
  localStorage.setItem(PROGRESS_STORAGE_KEY, progress.toString());
  syncToServer(url, progress);
}

export default function WebhookSettings() {
  const [webhookUrl, setWebhookUrl] = useState(readStoredUrl);
  const [progressEnabled, setProgressEnabled] = useState(readStoredProgress);
  const hasSynced = useRef(false);

  useEffect(() => {
    if (hasSynced.current) return;
    hasSynced.current = true;
    syncToServer(readStoredUrl(), readStoredProgress());
  }, []);

  const commitUrl = () => {
    persistAndSync(webhookUrl, progressEnabled);
  };

  const toggleProgress = () => {
    const next = !progressEnabled;
    setProgressEnabled(next);
    persistAndSync(webhookUrl, next);
  };

  const hasWebhook = !!webhookUrl.trim();

  return (
    <>
      <label className="col-span-3 uma-label">
        <span className="font-base min-w-[160px]">Discord Webhook URL</span>
        <Input
          type="text"
          className="w-full flex-1"
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          onBlur={commitUrl}
          placeholder="https://discord.com/api/webhooks/..."
        />
        <Tooltips>
          Sends Discord notifications when the bot starts, stops, gets stuck, or purchases skills.
        </Tooltips>
      </label>
      <label className={`uma-label ${hasWebhook ? "" : "disabled"}`}>
        <Checkbox
          checked={progressEnabled}
          disabled={!hasWebhook}
          onCheckedChange={toggleProgress}
        />
        <span className="font-base">Yearly Progress Updates</span>
        <Tooltips>
          Sends a stat snapshot at the start of Classic Year, Senior Year, and URA Finals.
        </Tooltips>
      </label>
    </>
  );
}

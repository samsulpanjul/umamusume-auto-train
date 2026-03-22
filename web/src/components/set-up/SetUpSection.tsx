import { Cog } from "lucide-react";
import type { Config, UpdateConfigType } from "@/types";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import Tooltips from "@/components/_c/Tooltips";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect, useState } from "react";
import WebhookSettings from "./WebhookSettings";

type Props = {
  config: Config;
  updateConfig: UpdateConfigType;
};

export default function SetUpSection({ config, updateConfig }: Props) {
  const {
    window_name,
    sleep_time_multiplier,
    use_adb,
    device_id,
    ocr_use_gpu,
    notifications_enabled,
    info_notification,
    error_notification,
    success_notification,
    notification_volume
  } = config;
  const [notificationSounds, setNotificationSounds] = useState<string[]>([]);

  useEffect(() => {
    fetch("/notifs")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setNotificationSounds(data);
        }
      })
      .catch((err) => console.error("Failed to fetch notification sounds", err));
  }, []);

  return (
    <div className="section-card">
      <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
        <Cog className="text-primary" />
        Trainer Set-Up
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        <label className="uma-label col-span-3">
          <span className="font-base">
            Sleep Time Multiplier
          </span>
          <Input className="w-24" step={0.1} type="number"
            value={sleep_time_multiplier}
            onChange={(e) => updateConfig("sleep_time_multiplier", e.target.valueAsNumber)} />
          <Tooltips>
            {"This value decides how much the bot will wait between some detections.\n\
            If your game is fast, set it lower (not recommended to go below 0.6)\n\
            If your game is slow, set it higher (should not need to go above 1.6)\n\
            Default: 1.1"}
          </Tooltips>
        </label>
        <label className="uma-label">
          <Checkbox
            checked={use_adb}
            onCheckedChange={() => updateConfig("use_adb", !use_adb)}
          />
          <span className="font-base">Use ADB</span>
          <Tooltips>If enabled bot will use ADB to connect to your emulator.
            You need to find the device ID which is the IP address of your emulator and its ADB port and enter it correctly as IP:Port.</Tooltips>
        </label>
        <label className={`uma-label ${!use_adb ? "" : "disabled"}`}>
          <div className="flex gap-2 items-center">
            <span className="font-base">
              Window Name
            </span>
            <Tooltips>
              {"If you're using an emulator but not ADB, set this to your emulator's window name (case-sensitive).\n\
               Otherwise this has no effect on Steam or ADB versions."}
            </Tooltips>
          </div>
          <Input className="w-48" value={window_name} onChange={(e) => updateConfig("window_name", e.target.value)} />
        </label>
        <label className={`uma-label ${use_adb ? "" : "disabled"}`}>
          <span className="font-base">Device ID</span><Tooltips>Needs to be in the format of "IP:Port", example 127.0.0.1:5555</Tooltips>
          <Input
            type="text"
            className="w-48"
            value={device_id}
            onChange={(e) => updateConfig("device_id", e.target.value)}
          />
        </label>
        <label className="uma-label">
          <Checkbox
            checked={ocr_use_gpu}
            onCheckedChange={() => updateConfig("ocr_use_gpu", !ocr_use_gpu)}
          />
          <span className="font-base">Use GPU for OCR</span>
          <Tooltips>Uses GPU acceleration for EasyOCR if available. Disable this if GPU OCR causes crashes or your environment does not support CUDA.</Tooltips>
        </label>
        <label className="col-span-3 uma-label">
          <Checkbox checked={notifications_enabled} onCheckedChange={() => updateConfig("notifications_enabled", !notifications_enabled)} />
          <span className="font-base">Enable Notification Sounds</span><Tooltips>Enables sounds to play as notifications. You can use custom sounds by adding them to assets/notifications folder of the bot.</Tooltips>
        </label>
        <label className={`uma-label ${notifications_enabled ? "" : "disabled"}`}>
          <div className="flex gap-2 items-center">
            <span className="font-base">
              Info Sound
            </span><Tooltips>Plays for other things, currently unused (v1.3.44).</Tooltips>
          </div>
          <Select value={info_notification} onValueChange={(v) => updateConfig("info_notification", v)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select sound" />
            </SelectTrigger>
            <SelectContent>
              {notificationSounds.map((sound) => (
                <SelectItem key={sound} value={sound}>
                  {sound}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <label className={`uma-label ${notifications_enabled ? "" : "disabled"}`}>
          <div className="flex gap-2 items-center">
            <span className="font-base">
              Error Sound
            </span><Tooltips>Plays when the bot gets stuck.</Tooltips>
          </div>
          <Select value={error_notification} onValueChange={(v) => updateConfig("error_notification", v)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select sound" />
            </SelectTrigger>
            <SelectContent>
              {notificationSounds.map((sound) => (
                <SelectItem key={sound} value={sound}>
                  {sound}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <label className={`uma-label ${notifications_enabled ? "" : "disabled"}`}>
          <div className="flex gap-2 items-center">
            <span className="font-base">
              Success Sound
            </span><Tooltips>Plays when the bot has finished a run.</Tooltips>
          </div>
          <Select value={success_notification} onValueChange={(v) => updateConfig("success_notification", v)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select sound" />
            </SelectTrigger>
            <SelectContent>
              {notificationSounds.map((sound) => (
                <SelectItem key={sound} value={sound}>
                  {sound}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <label className={`uma-label ${notifications_enabled ? "" : "disabled"} col-span-3`}>
          <div className="flex items-center gap-4">
            <span className="font-base min-w-[160px]">
              Notification Volume
            </span>

            <input
              type="range"
              min={0}
              max={1}
              step="any"
              value={notification_volume}
              onChange={(e) =>
                updateConfig(
                  "notification_volume",
                  Math.round(parseFloat(e.target.value) * 100) / 100
                )
              }
              className="w-64 accent-primary"
            />

            <span className="w-14 text-right tabular-nums">
              {Math.round(notification_volume * 100)}%
            </span>
          </div>
        </label>
        <WebhookSettings />
      </div>
    </div>
  );
}

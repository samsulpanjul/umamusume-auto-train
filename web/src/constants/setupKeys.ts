import type { Config } from "../types";

export const SETUP_KEYS = [
  "sleep_time_multiplier",
  "use_adb",
  "window_name",
  "device_id",
  "ocr_use_gpu",
  "notifications_enabled",
  "info_notification",
  "error_notification",
  "success_notification",
  "notification_volume",
  "preset_id"
] as const satisfies readonly (keyof Config)[];

export type SetupKey = (typeof SETUP_KEYS)[number];
export type SetupConfig = Pick<Config, SetupKey>;

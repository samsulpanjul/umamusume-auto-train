import { Calculator } from "lucide-react";
import type { Config, UpdateConfigType } from "@/types";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import Tooltips from "@/components/_c/Tooltips";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect, useState } from "react";
import FunctionModUmaCard from "./subsections/FunctionModUmaCard"

type Props = {
  config: Config;
  updateConfig: UpdateConfigType;
};

export default function FunctionModsSection({ config, updateConfig }: Props) {
  const {
    window_name,
    sleep_time_multiplier,
    use_adb,
    device_id,
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
        <Calculator className="text-primary" />
        Function Modifications
      </h2>
      <div className="flex">
        <div className="flex-20 px-8">
          Trainings
          <div className="flex">
            <div className="text-3xl flex-2 mb-6 border">
              Speed
              <div className="flex mb-6">
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
              <div className="flex mb-6">
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
              <div className="flex mb-6">
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
            </div>
            <div className="text-3xl flex-2 mb-6 border">
              Stamina
              <div className="flex mb-6">
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
              <div className="flex mb-6">
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
              <div className="flex mb-6">
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
            </div>
            <div className="text-3xl flex-2 mb-6 border">
              Power
              <div className="flex mb-6">
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
              <div className="flex mb-6">
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
              <div className="flex mb-6">
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
            </div>
            <div className="text-3xl flex-2 mb-6 border">
              <h2>
                Guts
              </h2>
              <div className="flex mb-6">
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
              <div className="flex mb-6">
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
              <div className="flex mb-6">
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
            </div>
            <div className="text-3xl flex-2 mb-6 border">
              Wit
              <div className="flex mb-6">
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
              <div className="flex mb-6">
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
              <div className="flex mb-6">
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 border-l pl-6">
          Supports
            <FunctionModUmaCard/>
            <FunctionModUmaCard/>
            <FunctionModUmaCard/>
            <FunctionModUmaCard/>
            <FunctionModUmaCard/>
            <FunctionModUmaCard/>
        </div>
      </div>
      <div className="border" />
      <div>
      </div>
    </div>
  );
}

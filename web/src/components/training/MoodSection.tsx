import { Heart } from "lucide-react";
import type { Config, UpdateConfigType } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOOD } from "@/constants";
import Tooltips from "@/components/_c/Tooltips";

type Props = {
  config: Config;
  updateConfig: UpdateConfigType;
};

export default function TrainingSection({ config, updateConfig }: Props) {
  const { minimum_mood, minimum_mood_junior_year } = config;

  return (
    <div className="section-card">
      <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
        <Heart className="text-primary" />
        Mood
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        <label className="uma-label">Min Mood (Junior)
          <Select
            name="mood-junior"
            value={minimum_mood_junior_year}
            onValueChange={(val) => updateConfig("minimum_mood_junior_year", val)}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Mood" />
            </SelectTrigger>
            <SelectContent>
              {MOOD.map((m) => ( <SelectItem key={m} value={m}> {m}</SelectItem> ))}
            </SelectContent>
          </Select><Tooltips>Minimum acceptable mood for junior year, bot will not do anything else if it sees mood below this value and directly try to do recreation (unless it has mood improvement disabling statuses)</Tooltips>
        </label>

        <label className="uma-label">Min Mood
          <Select
            name="mood"
            value={minimum_mood}
            onValueChange={(val) => updateConfig("minimum_mood", val)}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Mood" />
            </SelectTrigger>
            <SelectContent>
              {MOOD.map((m) => ( <SelectItem key={m} value={m}>{m}</SelectItem> ))}</SelectContent>
          </Select><Tooltips>Minimum acceptable mood for classic and senior year, bot will not do anything else if it sees mood below this value and directly try to do recreation (unless it has mood improvement disabling statuses)</Tooltips>
        </label>
      </div>
    </div>
  );
}

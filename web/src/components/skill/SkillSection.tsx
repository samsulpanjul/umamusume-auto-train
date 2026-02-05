import { BrainCircuit } from "lucide-react";
import type { Config, UpdateConfigType } from "@/types";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

type Props = {
  config: Config;
  updateConfig: UpdateConfigType;
};

export default function SkillSection({ config, updateConfig }: Props) {
  const { skill } = config;

  return (
    <div className="section-card">
      <h2 className="text-3xl font-semibold mb-4 flex items-center gap-3">
        <BrainCircuit className="text-primary" />
        Skills
      </h2>
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-2">
        <label className="uma-label col-span-3">
          <Checkbox
            id="buy-auto-skill"
            checked={skill.is_auto_buy_skill}
            onCheckedChange={() => updateConfig("skill", { ...skill, is_auto_buy_skill: !skill.is_auto_buy_skill, })} />
          <span className="shrink-0">Auto Buy Skills</span>
        </label>

        <label className={`uma-label ${skill.is_auto_buy_skill ? "" : "disabled"}`}>
          <Checkbox
            checked={skill.check_skill_before_races}
            onCheckedChange={() => updateConfig("skill", { ...skill, check_skill_before_races: !skill.check_skill_before_races })}
          />
          <span className="shrink-0">Check Skills Before Races</span>
        </label>
        <label className={`uma-label ${skill.is_auto_buy_skill ? "" : "disabled"}`}>
          <span>Turns Before Checking Skills</span>
          <Input
            className="w-18"
            step={1}
            type="number"
            value={skill.skill_check_turns}
            onChange={(e) => updateConfig("skill", { ...skill, skill_check_turns: e.target.valueAsNumber })}
          />
        </label>
        <label className={`uma-label ${skill.is_auto_buy_skill ? "" : "disabled"}`}>
          <span>Points Before Checking Skills</span>
          <Input
            className="w-22"
            type="number"
            min={0}
            value={skill.skill_pts_check}
            onChange={(e) => updateConfig("skill", { ...skill, skill_pts_check: e.target.valueAsNumber, })}
          />
        </label>

      </div>
    </div>
  );
}

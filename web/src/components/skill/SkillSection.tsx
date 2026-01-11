import { BrainCircuit } from "lucide-react";
import IsAutoBuy from "./IsAutoBuy";
import SkillPtsCheck from "./SkillPtsCheck";
import SkillList from "./SkillList";
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
    <div className="bg-card p-6 rounded-xl shadow-lg border border-border/20">
      <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
        <BrainCircuit className="text-primary" />
        Skill
      </h2>
      <div className="flex flex-col gap-6">
        <IsAutoBuy
          isAutoBuySkill={skill.is_auto_buy_skill}
          setAutoBuySkill={(val) =>
            updateConfig("skill", { ...skill, is_auto_buy_skill: val })
          }
        />
        <label htmlFor="check-skill-before-races" className="flex gap-2 items-center">
          <Checkbox
            id="check-skill-before-races"
            checked={skill.check_skill_before_races}
            onCheckedChange={() => updateConfig("skill", { ...skill, check_skill_before_races: !skill.check_skill_before_races })}
          />
          <span className="text-lg font-medium">Check Skill Before Races</span>
        </label>
        <label htmlFor="skill-check-turns" className="flex gap-2 items-center">
          <span className="text-lg font-medium">Skill Check Turns</span>
          <Input
            id="skill-check-turns"
            className="w-24"
            step={1}
            type="number"
            value={skill.skill_check_turns}
            onChange={(e) => updateConfig("skill", { ...skill, skill_check_turns: e.target.valueAsNumber })}
          />
        </label>
        <SkillPtsCheck
          skillPtsCheck={skill.skill_pts_check}
          setSkillPtsCheck={(val) =>
            updateConfig("skill", { ...skill, skill_pts_check: val })
          }
        />
        <SkillList
          list={skill.skill_list}
          addSkillList={(val) =>
            updateConfig("skill", {
              ...skill,
              skill_list: [val, ...skill.skill_list],
            })
          }
          deleteSkillList={(val) =>
            updateConfig("skill", {
              ...skill,
              skill_list: skill.skill_list.filter((s) => s !== val),
            })
          }
        />
      </div>
    </div>
  );
}

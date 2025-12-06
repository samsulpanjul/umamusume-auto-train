import { BrainCircuit } from "lucide-react";
import IsAutoBuy from "./IsAutoBuy";
import SkillPtsCheck from "./SkillPtsCheck";
import SkillList from "./SkillList";
import type { Config, UpdateConfigType } from "@/types";

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

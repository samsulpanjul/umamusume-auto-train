import { AlertCircle, BrainCircuit } from "lucide-react";
import SkillList from "./SkillList";
import { Button } from "@/components/ui/button";
import type { Config, UpdateConfigType } from "@/types";

type Props = {
  config: Config;
  updateConfig: UpdateConfigType;
};

export default function SkillSection({ config, updateConfig }: Props) {
  const { skill } = config;

  return (
    <div className="section-card">
      <div className="flex flex-row">
        <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3 w-fit">
          <BrainCircuit className="text-primary" />
          Skill List
        </h2>
        {!skill.is_auto_buy_skill && (
          <div className="flex flex-1 h-fit items-center justify-center">
            <div className="flex items-center h-fit gap-2 px-4 rounded-full text-sm font-medium animate-in fade-in zoom-in duration-300 border bg-secondary/10 border-secondary/20 text-secondary -mt-1">
              <AlertCircle size={22} />
              Notice: You haven't enabled auto skill learning.{" "}
              <Button
                className="rounded-full p-2"
                variant="ghost"
                onClick={() => updateConfig("skill", { ...skill, is_auto_buy_skill: true })}
              >
                Enable?
              </Button>
            </div>
          </div>
        )}
      </div>
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
  );
}

import { LightbulbIcon } from "lucide-react";
import HintList from "./HintList";
import SelectedHintList from "./SelectedHintList";
import type { HintChoicesType, HintData } from "@/types/hintType";
import type { Config, UpdateConfigType } from "@/types";
import { useEffect, useMemo, useState } from "react";

type Props = {
  config: Config;
  updateConfig: UpdateConfigType;
};

export default function HintSection({ config, updateConfig }: Props) {
  const { hint } = config;
  const { hint_choices } = hint;
  const [data, setData] = useState<HintData | null>(null);

  useEffect(() => {
    const getHintData = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/Asinius/umamusume-auto-train/main/data/hints.json"
        );
        const hints = await res.json();
        setData(hints);
      } catch (error) {
        console.error("Failed to fetch hints:", error);
      }
    };
    getHintData();
  }, []);

  const handleAddHintList = (val: HintChoicesType) => {
    const existingIndex = hint_choices.findIndex(
      (hint) => hint.character_name === val.character_name && hint.hint_name === val.hint_name
    );
    const newHintChoices =
      existingIndex !== -1
        ? hint_choices.map((hint, i) =>
            i === existingIndex ? val : hint
          )
        : [...hint_choices, val];

    updateConfig("hint", { ...hint, hint_choices: newHintChoices });
  };

  const deleteHintList = (val: HintChoicesType) =>
    updateConfig("hint", {
      ...hint,
      hint_choices: hint_choices.filter((h) => !(h.hint_name == val.hint_name && h.character_name == val.character_name)),
    });

  const groupedHints = useMemo(() => {
    const hints = data?.hintArraySchema?.hints ?? [];
    console.log(hints);
    return Object.values(
      hints.reduce(
        (acc, hint) => {
          console.log(hint.character_name);
          if (!acc[hint.character_name]) {
            acc[hint.character_name] = {
              hint_names: hint.hint_names,
              character_name: hint.character_name,
            };
          }          
          return acc;
        },
        
        {} as Record<
          string,
          {
            character_name: string;
            hint_names: string[];
          }
        >
      )
    );
  }, [data]);

  console.log("Grouped Hints");
  console.log(groupedHints);

  return (
    <div className="bg-card p-6 rounded-xl shadow-lg border border-border/20">
      <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
        <LightbulbIcon className="text-primary" /> Hints
      </h2>
      <div className="flex gap-6 mt-6">
        <HintList
          hintChoicesConfig={hint_choices}
          addHintList={handleAddHintList}
          deleteHintList={deleteHintList}
          data={data}
          groupedChoices={groupedHints}
        />
        <SelectedHintList
          data={data}
          hintChoicesConfig={hint_choices}
          addHintList={handleAddHintList}
          deleteHintList={deleteHintList}
          clearHintList={() =>
            updateConfig("hint", { ...hint, hint_choices: [] })
          }
        />
      </div>
    </div>
  );
}

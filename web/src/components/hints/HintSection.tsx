import { TicketsIcon } from "lucide-react";
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
      (hint) => hint === val
    );

    const newHintChoices =
      existingIndex !== -1
        ? hint_choices
        : [...hint_choices, val];

    updateConfig("hint", { ...hint, hint_choices: newHintChoices });
  };

  const deleteHintList = (val: HintChoicesType) =>
    updateConfig("hint", {
      ...hint,
      hint_choices: hint_choices.filter((h) => h !== val),
    });

  const groupedHints = useMemo(() => {
    const hints = data?.hintArraySchema?.hints ?? [];

    return Object.values(
      hints.reduce(
        (acc, hint) => {
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

  return (
    <div className="bg-card p-6 rounded-xl shadow-lg border border-border/20">
      <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
        <TicketsIcon className="text-primary" /> Hint
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
          groupedChoices={groupedHints}
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

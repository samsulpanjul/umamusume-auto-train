import type { Stat } from "@/types/stat.type";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

type Props = {
  hintHuntingEnabled: boolean;
  setHintHuntingEnabled: (enabled: boolean) => void;
  hintWeights: Stat;
  setHintWeights: (stat: string, value: number) => void;
};

export default function HintHunting({ hintHuntingEnabled, hintWeights, setHintHuntingEnabled, setHintWeights }: Props) {
  return (
    <div className="flex flex-col gap-2 w-fit">
      <p className="text-lg font-medium">Hint Hunting</p>
      <div className="flex items-center gap-2">
      <label htmlFor="hint-hunting" className="flex gap-2 items-center">
        <Checkbox
          id="hint-hunting"
          checked={hintHuntingEnabled}
          onCheckedChange={() =>
            setHintHuntingEnabled(!hintHuntingEnabled)
          }
        />
        <span className="text-lg font-medium shrink-0">
          Enable Hint Hunting
        </span>
      </label>
      </div>
      <div className="flex flex-col gap-2">
        {Object.entries(hintWeights).map(([stat, val]) => (
          <label key={stat} className="flex items-center gap-4">
            <span className="inline-block w-16">{stat.toUpperCase()}</span>
            <Input
              type="number"
              value={val}
              min={0}
              step={0.1}
              onChange={(e) => setHintWeights(stat, e.target.valueAsNumber)}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

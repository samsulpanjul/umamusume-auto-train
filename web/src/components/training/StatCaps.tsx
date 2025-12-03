import type { Stat } from "@/types";
import { Input } from "../ui/input";

type Props = {
  statCaps: Stat;
  setStatCaps: (keys: string, value: number) => void;
};

export default function StatCaps({ statCaps, setStatCaps }: Props) {
  return (
    <div className="flex flex-col gap-2 w-fit">
      <p className="text-lg font-medium">Stat Caps</p>
      <div className="flex flex-col gap-2">
        {Object.entries(statCaps).map(([stat, val]) => (
          <label key={stat} className="flex items-center gap-4">
            <span className="inline-block w-16">{stat.toUpperCase()}</span>
            <Input
              type="number"
              value={val}
              min={0}
              onChange={(e) => setStatCaps(stat, e.target.valueAsNumber)}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

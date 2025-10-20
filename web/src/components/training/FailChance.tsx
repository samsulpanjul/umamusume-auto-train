import { Input } from "@/components/ui/input";

type Props = {
  maximumFailure: number;
  setFail: (newFail: number) => void;
};

export default function FailChance({ maximumFailure, setFail }: Props) {
  return (
    <label htmlFor="fail" className="flex flex-col gap-2">
      <span className="text-lg font-medium">Max Failure Chance</span>
      <div className="flex items-center gap-2">
        <Input
          className="w-24"
          type="number"
          name="fail"
          id="fail"
          min={0}
          value={maximumFailure}
          onChange={(e) => setFail(e.target.valueAsNumber)}
        />
        <span className="text-muted-foreground">%</span>
      </div>
    </label>
  );
}

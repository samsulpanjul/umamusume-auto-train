import { Input } from "@/components/ui/input";

type Props = {
  sleepMultiplier: number;
  setSleepMultiplier: (newVal: number) => void;
};

export default function SleepMultiplier({
  sleepMultiplier,
  setSleepMultiplier,
}: Props) {
  return (
    <label htmlFor="sleep-multiplier" className="flex flex-col gap-2">
      <span className="text-lg font-medium">Sleep Time Multiplier</span>
      <Input
        id="sleep-multiplier"
        className="w-24"
        step={0.1}
        type="number"
        value={sleepMultiplier}
        onChange={(e) => setSleepMultiplier(e.target.valueAsNumber)}
      />
    </label>
  );
}

import { Input } from "./ui/input";

type Props = {
  maximumFailure: number;
  setFail: (newFail: number) => void;
};

export default function FailChance({ maximumFailure, setFail }: Props) {
  return (
    <label htmlFor="fail" className="flex gap-2 items-center place-self-start px-2">
      <span className="text-xl shrink-0">Maximum Failure Chance</span>
      <Input className="w-24 shrink-0" type="number" name="fail" id="fail" min={0} value={maximumFailure} onChange={(e) => setFail(e.target.valueAsNumber)} />
      <span>%</span>
    </label>
  );
}

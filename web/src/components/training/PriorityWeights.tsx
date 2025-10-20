import { Input } from "../ui/input";

type Props = {
  priorityWeights: number[];
  setPriorityWeights: (weight: number, index: number) => void;
};

export default function PriorityWeights({ priorityWeights, setPriorityWeights }: Props) {
  return (
    <div className="flex flex-col gap-2 w-fit">
      <p className="text-lg font-medium">Priority Weight Multiplier</p>
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }, (_, i) => (
          <Input type="number" key={i} step={0.05} value={priorityWeights[i]} onChange={(e) => setPriorityWeights(e.target.valueAsNumber, i)} />
        ))}
      </div>
    </div>
  );
}

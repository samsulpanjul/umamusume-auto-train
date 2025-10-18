import { PRIORITY_WEIGHT } from "../../constants";
import Tooltips from "../_c/Tooltips";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

type Props = {
  priorityWeight: string;
  setPriorityWeight: (newWeight: string) => void;
};

export default function PriorityWeight({ priorityWeight, setPriorityWeight }: Props) {
  return (
    <div className="w-fit">
      <label htmlFor="priority-weight" className="flex flex-col gap-2">
        <span className="text-lg font-medium">Priority Weight Level</span>
        <RadioGroup value={priorityWeight} onValueChange={(val) => setPriorityWeight(val)}>
          {Object.entries(PRIORITY_WEIGHT).map(([weight, description]) => (
            <div key={weight} className="flex items-center gap-2">
              <RadioGroupItem value={weight} id={weight} />
              <label htmlFor={weight}>{weight}</label>
              <Tooltips>{description}</Tooltips>
            </div>
          ))}
        </RadioGroup>
      </label>
    </div>
  );
}

import { Checkbox } from "../ui/checkbox";

type Props = {
  prioritizeG1Race: boolean;
  setPrioritizeG1: (newState: boolean) => void;
};

export default function PrioritizeG1({
  prioritizeG1Race,
  setPrioritizeG1,
}: Props) {
  return (
    <div className="w-fit">
      <label htmlFor="prioritize-g1" className="flex gap-2 items-center">
        <Checkbox
          id="prioritize-g1"
          checked={prioritizeG1Race}
          onCheckedChange={() => setPrioritizeG1(!prioritizeG1Race)}
        />
        <span className="text-lg font-medium shrink-0">Run Race Schedule?</span>
      </label>
    </div>
  );
}

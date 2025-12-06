import { Checkbox } from "../ui/checkbox";

type Props = {
  isUseOptimalEventChoice: boolean;
  setIsUseOptimalEventChoice: (newState: boolean) => void;
};

export default function IsOptimalEvent({ isUseOptimalEventChoice, setIsUseOptimalEventChoice }: Props) {
  return (
    <label htmlFor="is-optimal-event" className="flex gap-2 items-center">
      <Checkbox id="is-optimal-event" checked={isUseOptimalEventChoice} onCheckedChange={() => setIsUseOptimalEventChoice(!isUseOptimalEventChoice)} />
      <span className="text-lg font-medium shrink-0">Use Optimal Event?</span>
    </label>
  );
}

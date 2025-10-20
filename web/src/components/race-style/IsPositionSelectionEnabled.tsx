import { Checkbox } from "../ui/checkbox";

type Props = {
  positionSelectionEnabled: boolean;
  setPositionSelectionEnabled: (newState: boolean) => void;
};

export default function IsPositionSelectionEnabled({ positionSelectionEnabled, setPositionSelectionEnabled }: Props) {
  return (
    <label htmlFor="position-selection-enabled" className="flex gap-2 items-center">
      <Checkbox id="position-selection-enabled" checked={positionSelectionEnabled} onCheckedChange={() => setPositionSelectionEnabled(!positionSelectionEnabled)} />
      <span className="text-lg font-medium shrink-0">Position Selection Enabled</span>
    </label>
  );
}

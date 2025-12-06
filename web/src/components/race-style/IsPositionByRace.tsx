import { Checkbox } from "../ui/checkbox";

type Props = {
  enablePositionsByRace: boolean;
  setPositionByRace: (newState: boolean) => void;
  positionSelectionEnabled: boolean;
};

export default function IsPositionByRace({ enablePositionsByRace, setPositionByRace, positionSelectionEnabled }: Props) {
  return (
    <label htmlFor="position-by-race" className="flex gap-2 items-center">
      <Checkbox disabled={!positionSelectionEnabled} id="position-by-race" checked={enablePositionsByRace} onCheckedChange={() => setPositionByRace(!enablePositionsByRace)} />
      <span className="text-lg font-medium shrink-0">Position By Race?</span>
    </label>
  );
}

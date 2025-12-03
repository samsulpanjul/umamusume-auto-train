import { POSITION } from "@/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type PositionByRace = {
  sprint: string;
  mile: string;
  medium: string;
  long: string;
};

type Props = {
  positionByRace: PositionByRace;
  setPositionByRace: (key: string, val: string) => void;
  enablePositionsByRace: boolean;
  positionSelectionEnabled: boolean;
};

export default function PositionByRace({ positionByRace, setPositionByRace, enablePositionsByRace, positionSelectionEnabled }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-lg font-medium">Position By Race:</p>
      <div className="flex flex-col gap-2">
        {Object.entries(positionByRace).map(([key, val]) => (
          <label key={key} htmlFor={key} className="flex gap-2 items-center w-44 justify-between">
            <span className="capitalize">{key}</span>
            <Select disabled={!(enablePositionsByRace && positionSelectionEnabled)} value={val} onValueChange={(val) => setPositionByRace(key, val)}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent>
                {POSITION.map((pos) => (
                  <SelectItem key={pos} value={pos}>
                    {pos.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
        ))}
      </div>
    </div>
  );
}

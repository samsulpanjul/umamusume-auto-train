import { MODE } from "@/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type Props = {
  trainingMode: string;
  setTrainingMode: (val: string) => void;
};

export default function TrainingMode({ trainingMode, setTrainingMode}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-lg font-medium shrink-0">Training Mode</span>
      <Select value={trainingMode} onValueChange={(val) => setTrainingMode(val)}>
        <SelectTrigger className="w-24">
          <SelectValue placeholder="Mode" />
        </SelectTrigger>
        <SelectContent>
          {MODE.map((pos) => (
            <SelectItem key={pos} value={pos}>
              {pos.toUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
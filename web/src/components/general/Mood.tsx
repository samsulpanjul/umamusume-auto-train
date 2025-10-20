import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOOD } from "@/constants";

type Props = {
  minimumMood: string;
  setMood: (newMood: string) => void;
  minimumMoodJunior: string;
  setMoodJunior: (newMood: string) => void;
};

export default function Mood({
  minimumMood,
  setMood,
  minimumMoodJunior,
  setMoodJunior,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <span className="text-lg font-medium">Min Mood (Junior)</span>
        <Select
          name="mood-junior"
          value={minimumMoodJunior}
          onValueChange={(val) => setMoodJunior(val)}
        >
          <SelectTrigger className="w-36 mt-2">
            <SelectValue placeholder="Mood" />
          </SelectTrigger>
          <SelectContent>
            {MOOD.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <span className="text-lg font-medium">Min Mood</span>
        <Select
          name="mood"
          value={minimumMood}
          onValueChange={(val) => setMood(val)}
        >
          <SelectTrigger className="w-36 mt-2">
            <SelectValue placeholder="Mood" />
          </SelectTrigger>
          <SelectContent>
            {MOOD.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

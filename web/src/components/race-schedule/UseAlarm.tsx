import { Checkbox } from "../ui/checkbox";

type Props = {
  useAlarm: boolean;
  setUseAlarm: (newState: boolean) => void;
};

export default function UseAlarm({ useAlarm, setUseAlarm }: Props) {
  return (
    <div className="w-fit">
      <label htmlFor="use-alarm" className="flex gap-2 items-center">
        <Checkbox id="use-alarm" checked={useAlarm} onCheckedChange={() => setUseAlarm(!useAlarm)} />
        <span className="text-lg font-medium shrink-0">Use Alarm Clocks?</span>
      </label>
    </div>
  );
}

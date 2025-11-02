import Tooltips from "@/components/_c/Tooltips";
import { Checkbox } from "../ui/checkbox";

type Props = {
  useClock: boolean;
  setUseClock: (newState: boolean) => void;
};

export default function useClock({ useClock, setUseClock }: Props) {
  return (
    <div className="w-fit">
      <label htmlFor="use-alarm-clock" className="flex gap-2 items-center">
        <Checkbox id="use-alarm-clock" checked={useClock} onCheckedChange={() => setUseClock(!useClock)} />
        <span className="text-lg font-medium shrink-0">Use Alarm Clock</span>
        <Tooltips>
          Lets you try again on Career goal race. <br />Defaul value: False
        </Tooltips>
      </label>
    </div>
  );
}

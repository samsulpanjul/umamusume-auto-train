import Tooltips from "@/components/_c/Tooltips";
import { Checkbox } from "../ui/checkbox";

type Props = {
  isSkipClawMachine: boolean;
  setSkipClawMachine: (value: boolean) => void;
};

export default function isSkipClaw({ isSkipClawMachine, setSkipClawMachine }: Props) {
  return (
    <label htmlFor="skip-claw-machine" className="flex gap-2 items-center">
      <Checkbox id="skip-claw-machine" checked={isSkipClawMachine} onCheckedChange={() => setSkipClawMachine(!isSkipClawMachine)} />
      <span className="text-lg font-medium shrink-0">Skip Claw Machine?</span>
      <Tooltips>
      Enabling this will auto play the claw machine.
      </Tooltips>
    </label>
  );
}

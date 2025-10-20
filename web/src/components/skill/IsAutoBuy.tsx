import { Checkbox } from "../ui/checkbox";

type Props = {
  isAutoBuySkill: boolean;
  setAutoBuySkill: (value: boolean) => void;
};

export default function IsAutoBuy({ isAutoBuySkill, setAutoBuySkill }: Props) {
  return (
    <label htmlFor="buy-auto-skill" className="flex gap-2 items-center">
      <Checkbox id="buy-auto-skill" checked={isAutoBuySkill} onCheckedChange={() => setAutoBuySkill(!isAutoBuySkill)} />
      <span className="text-lg font-medium shrink-0">Auto Buy Skill? </span>
    </label>
  );
}

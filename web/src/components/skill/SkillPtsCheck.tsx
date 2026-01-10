import { Input } from "../ui/input";

type Props = {
  skillPtsCheck: number;
  setSkillPtsCheck: (value: number) => void;
};

export default function SkillPtsCheck({ skillPtsCheck, setSkillPtsCheck }: Props) {
  return (
    <label htmlFor="skill-pts-check" className="flex gap-2 items-center">
      <span className="text-lg font-medium shrink-0">Skill Pts Check</span>
      <Input id="skill-pts-check" className="w-24" type="number" min={0} value={skillPtsCheck} onChange={(e) => setSkillPtsCheck(e.target.valueAsNumber)} />
    </label>
  );
}

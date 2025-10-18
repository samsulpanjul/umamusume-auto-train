import { Input } from "../ui/input";

type Props = {
  name: string;
  value: number;
  setValue: (value: number) => void;
  children: React.ReactNode;
};

export default function EnergyInput({ name, value, setValue, children }: Props) {
  return (
    <label htmlFor={name} className="flex flex-col gap-2">
      <span className="text-lg font-medium shrink-0">{children}</span>
      <Input className="w-24 shrink-0" type="number" name={name} id={name} min={0} value={value} onChange={(e) => setValue(Number(e.target.valueAsNumber))} />
    </label>
  );
}

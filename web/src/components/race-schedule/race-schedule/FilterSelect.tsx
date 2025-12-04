import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  label: string;
  icon: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
};

export default function FilterSelect({
  label,
  icon,
  value,
  onValueChange,
  options,
}: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        {icon}
        {label}
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`All ${label}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

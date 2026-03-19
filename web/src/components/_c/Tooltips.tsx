import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CircleQuestionMarkIcon } from "lucide-react";

const sizeClasses = {
  default: "size-5",
  xs: "size-3",
  sm: "size-4",
  lg: "size-6",
} as const;

type Props = {
  children: React.ReactNode;
  size?: keyof typeof sizeClasses;
};

export default function Tooltips({ children, size = "default" }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <CircleQuestionMarkIcon className={sizeClasses[size]} />
      </TooltipTrigger>
      <TooltipContent style={{ whiteSpace: "pre-line" }}>{children}</TooltipContent>
    </Tooltip>
  );
}

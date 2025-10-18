import Tooltips from "@/components/_c/Tooltips";
import { Input } from "@/components/ui/input";

type Props = {
  windowName: string;
  setWindowName: (newVal: string) => void;
};

export default function WindowName({ windowName, setWindowName }: Props) {
  return (
    <label htmlFor="window-name" className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <span className="text-lg font-medium">Window Name</span>
        <Tooltips>
          If you're using an emulator, set this to your emulator's window name
          (case-sensitive).
        </Tooltips>
      </div>
      <Input
        id="window-name"
        className="w-52"
        value={windowName}
        onChange={(e) => setWindowName(e.target.value)}
      />
    </label>
  );
}

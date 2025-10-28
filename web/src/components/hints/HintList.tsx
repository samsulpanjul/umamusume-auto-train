import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { MessageCircleWarning, X } from "lucide-react";
import { useState } from "react";
import type { HintChoicesType, HintType } from "@/types/hintType";
import type { HintData } from "@/types/hintType";
import MainHintList from "./_c/HintList/Main";
import SidebarHintList from "./_c/HintList/Sidebar";

type Props = {
  data: HintData | null;
  groupedChoices: HintType[];
  hintChoicesConfig: HintChoicesType[];
  addHintList: (newList: HintChoicesType) => void;
  deleteHintList: (hintName: HintChoicesType) => void;
};

export default function HintList({ data, groupedChoices, hintChoicesConfig, addHintList, deleteHintList }: Props) {
  const [selected, setSelected] = useState<string>("");

  console.log(selected);
  console.log(groupedChoices);
  const hintSelected = selected ? groupedChoices?.filter((val) => selected.toLowerCase().includes(val.character_name.toLowerCase())) : [];

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2 shadow-sm hover:shadow-md transition">
            <MessageCircleWarning className="w-4 h-4" />
            Hint List
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-7xl w-full h-[90vh] flex flex-col overflow-hidden p-0 [&>button]:hidden">
          {/* HEADER */}
          <DialogHeader className="px-6 py-4 border-b bg-muted/30 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                <MessageCircleWarning className="w-5 h-5 text-primary" />
                Hint Database
              </DialogTitle>

              {selected && (
                <Badge variant="secondary" className="flex items-center gap-1 text-sm">
                  Filter: {selected}
                  <button onClick={() => setSelected("")} className="ml-1 hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          </DialogHeader>

          {/* BODY */}
          <div className="flex-1 flex overflow-hidden">
            {/* SIDEBAR */}
            <SidebarHintList selected={selected} setSelected={setSelected} data={data} />

            {/* MAIN CONTENT */}
            <MainHintList deleteHintList={deleteHintList} addHintList={addHintList} hintChoicesConfig={hintChoicesConfig} hintSelected={hintSelected} selected={selected} setSelected={setSelected} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import HintCard from "./_c/HintCard";
import type { HintChoicesType, HintData } from "@/types/hintType";
import { Badge } from "../ui/badge";
import { Search, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { useMemo, useState } from "react";

type Props = {
  data: HintData | null;
  hintChoicesConfig: HintChoicesType[];
  addHintList: (hint: HintChoicesType) => void;
  deleteHintList: (hint: HintChoicesType) => void;
  clearHintList: () => void;
};

export default function SelectedHintList({ data, hintChoicesConfig, addHintList, deleteHintList, clearHintList }: Props) {
  const allData = [...(data?.supportCardArraySchema?.supportCards ?? [])];

  const [search, setSearch] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const characterList = [
    ...new Set(
      hintChoicesConfig.flatMap((hint) => {
        const nameStr = hint.character_name || "";
        return nameStr
          .toLowerCase()
          .split(",")
          .map((name) => name.trim());
      })
    ),
  ];

  const selectedHints = hintChoicesConfig;

  const filtered = useMemo(() => {
    const val = search.toLowerCase().toLowerCase();
    return selectedHints?.filter((ev) => ev.character_name.toLowerCase().includes(val));
  }, [selectedHints, search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setSearch("");
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          Selected Hints
          {hintChoicesConfig.length > 0 && (
            <Badge variant="secondary" className="ml-1 text-xs px-2">
              {hintChoicesConfig.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="h-[85vh] w-full max-w-[90vw] p-0 overflow-hidden [&>button]:hidden">
        {/* Header */}
        <DialogHeader className="p-4 border-b flex flex-row items-center justify-between bg-muted/40">
          <DialogTitle className="text-lg font-semibold">Selected Hints</DialogTitle>

          {hintChoicesConfig.length > 0 && (
            <Button variant="destructive" size="sm" onClick={clearHintList} className="flex items-center gap-1">
              <Trash2 className="w-4 h-4" /> Clear All Hints
            </Button>
          )}
        </DialogHeader>

        <div className="flex h-[75vh]">
          {/* LEFT SIDE */}
          <div className="border-r p-4 flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search hints or characters..." value={search} onChange={handleSearch} className="pl-10" />
            </div>

            <div className="overflow-y-auto px-2">
              <p className="text-sm font-medium mb-2 text-muted-foreground">Filter</p>
              <div className="grid grid-cols-3 gap-3 p-1">
                {allData
                  ?.filter((item) => characterList.includes(item.name.toLowerCase()))
                  .map((item) => (
                    <button key={item.name} onClick={() => setSearch(item.name)} className="flex flex-col items-center w-20">
                      <img src={item.image_url} alt={item.name} className={`object-cover rounded-lg border ${item.name.toLowerCase() === search.toLowerCase() ? "ring-2" : "hover:ring-2"} hover:ring-primary transition`} />
                      <p className="text-xs mt-1 text-muted-foreground truncate w-full text-center">{item.name}</p>
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex-1 overflow-y-auto p-4">
            {filtered?.length > 0 ? (
              <div className="flex flex-col gap-4">
                {filtered.map((hint) => <HintCard key={hint.hint_name} addHintList={addHintList} hint={hint} hintChoicesConfig={hintChoicesConfig} deleteHintList={deleteHintList} />
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                <p className="text-base font-medium">No hints selected yet</p>
                <p className="text-sm">Select some from the list to see them here</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

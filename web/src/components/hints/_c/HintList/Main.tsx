import type { HintChoicesType, HintType } from "@/types/hintType";
import { Badge } from "@/components/ui/badge";
import HintCard from "../HintCard";
import { Card, CardContent } from "@/components/ui/card";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";

type Props = {
  hintSelected: HintType[];
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  hintChoicesConfig: HintChoicesType[];
  addHintList: (hint: HintChoicesType) => void;
  deleteHintList: (hint: HintChoicesType) => void;
};

export default function MainHintList({ hintSelected, selected, setSelected, hintChoicesConfig, addHintList, deleteHintList }: Props) {
  const [search, setSearch] = useState<string>("");

  const filtered = useMemo(() => {
    const val = search.toLowerCase().trim();
    return hintSelected.filter((hint) => hint.hint_names.some((hint_name) => hint_name.toLowerCase().includes(val)));
  }, [hintSelected, search]);

  useEffect(() => {
    setSearch("");
  }, [selected]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-background">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{selected ? `Hints for: ${selected}` : "All Hints"}</h3>
          <Badge variant="outline" className="text-xs">
            {filtered.reduce((count, innerList) => count + innerList.hint_names.length, 0)} hints found
          </Badge>
        </div>
        <Input value={search} onChange={handleSearch} placeholder="Search hints..." />

        <div className="space-y-4">
          {filtered.length > 0 ? (
            filtered.map((hintdata) => hintdata.hint_names.map((hint_name) => <HintCard addHintList={addHintList} hint={{character_name: hintdata.character_name, hint_name: hint_name, priority: ""}}
             hintChoicesConfig={hintChoicesConfig} deleteHintList={deleteHintList} key={hint_name} />)
          )) : (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center text-muted-foreground">
                <Filter className="w-12 h-12 mx-auto mb-3 opacity-50" />
                {selected ? (
                  <>
                    <p className="font-medium mb-1">No hints found for this filter.</p>
                    <Button variant="outline" size="sm" onClick={() => setSelected("")}>
                      Clear Filter
                    </Button>
                  </>
                ) : (
                  <p>Select a scenario, character, or support card from the sidebar to view hints.</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

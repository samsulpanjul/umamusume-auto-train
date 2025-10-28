import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Sparkles, X } from "lucide-react";
import HintDialog from "../HintDialog";
import { Button } from "@/components/ui/button";
import type { HintData } from "@/types/hintType";

type Props = {
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  data: HintData | null;
};

export default function SidebarEventList({ selected, setSelected, data }: Props) {
  return (
    <div className="w-80 border-r bg-muted/10 p-4 space-y-6 overflow-y-auto">
      <div>
        <h3 className="font-semibold text-sm flex items-center gap-2 mb-1">
          <Filter className="w-4 h-4" />
          Filter Options
        </h3>
        <p className="text-xs text-muted-foreground">Filter hints by support card</p>
      </div>
      {/* Support Card Filter */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            Support Card
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HintDialog
            button="Select Support Card"
            data={data?.supportCardArraySchema.supportCards ?? []}
            setSelected={(selectedCard) => {
              setSelected(selectedCard);
            }}
          />
        </CardContent>
      </Card>

      {selected && (
        <Button variant="outline" onClick={() => setSelected("")} className="w-full flex items-center gap-2">
          <X className="w-4 h-4" />
          Clear Filter
        </Button>
      )}
    </div>
  );
}

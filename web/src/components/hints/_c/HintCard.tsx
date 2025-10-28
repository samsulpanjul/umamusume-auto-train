import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { HintChoicesType } from "@/types/hintType";

type Props = {
  hintChoicesConfig: HintChoicesType[];
  hint: HintChoicesType;
  addHintList: (hint: HintChoicesType) => void;
  deleteHintList?: (hint_name: HintChoicesType) => void;
};

export default function HintCard({ hintChoicesConfig, hint, addHintList, deleteHintList }: Props) {
  const isSelected = hintChoicesConfig.some((ev) => ev.hint_name === hint.hint_name);

  return (
    <Card key={hint.hint_name} className={`relative transition-all ${isSelected ? "border-primary shadow-[0_0_10px_rgba(59,130,246,0.3)]" : "border-border/60 hover:shadow-md"}`}>
      <CardHeader className="pb-2 flex items-center justify-between">
        <CardTitle className="text-base flex flex-col gap-2">
          <span>{hint.hint_name}</span>
          {isSelected && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30" title={hint.character_name}>
              {hint.character_name}
            </Badge>
          )}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={() => addHintList({character_name: hint.character_name, hint_name: hint.hint_name})} className="text-muted-foreground hover:text-destructive">
          <Plus size={16} />
        </Button>
        {deleteHintList && isSelected && (
          <Button variant="ghost" size="icon" onClick={() => deleteHintList({character_name: hint.character_name, hint_name: hint.hint_name})} className="text-muted-foreground hover:text-destructive">
            <Trash2 size={16} />
          </Button>
        )}
      </CardHeader>
        
    </Card>
  );
}

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { HintChoicesType } from "@/types/hintType";
import { HINT_PRIORITY } from "@/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


type Props = {
  hintChoicesConfig: HintChoicesType[];
  hint: HintChoicesType;
  addHintList: (hint: HintChoicesType) => void;
  deleteHintList?: (hint: HintChoicesType) => void;
};

export default function HintCard({ hintChoicesConfig, hint, addHintList, deleteHintList }: Props) {
  const isSelected = hintChoicesConfig.some((ev) => ev.hint_name === hint.hint_name && ev.character_name === hint.character_name);
  const configPriority = hintChoicesConfig.find((ev) => ev.hint_name === hint.hint_name && ev.character_name === hint.character_name)?.priority || "";

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
          {isSelected && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30" title="Priority">
              {configPriority}
            </Badge>
          )}
        </CardTitle>
        {deleteHintList && isSelected && (
          <Button variant="ghost" size="icon" onClick={() => deleteHintList(hint)} className="text-muted-foreground hover:text-destructive">
            <Trash2 size={16} />
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-0 flex justify-center">
      <Select value={configPriority} onValueChange={(val) => addHintList({character_name: hint.character_name, hint_name: hint.hint_name, priority: val})}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder= {configPriority} />
        </SelectTrigger>
        <SelectContent>
          {HINT_PRIORITY.map((prio) => (
            <SelectItem key={prio} value={prio}>
              {prio.toUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      </CardContent>
        
    </Card>
  );
}

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EventType, EventChoicesType } from "@/types/eventType";

type Props = {
  eventChoicesConfig: EventChoicesType[];
  event: EventType;
  addEventList: (newList: EventChoicesType) => void;
  deleteEventList?: (event_name: string) => void;
};

export default function EventCard({ eventChoicesConfig, event, addEventList, deleteEventList }: Props) {
  const isSelected = eventChoicesConfig.some((ev) => ev.event_name === event.event_name);

  return (
    <Card key={event.event_name} className={`relative transition-all ${isSelected ? "border-primary shadow-[0_0_10px_rgba(59,130,246,0.3)]" : "border-border/60 hover:shadow-md"}`}>
      <CardHeader className="pb-2 flex items-center justify-between">
        <CardTitle className="text-base flex flex-col gap-2">
          <span>{event.event_name}</span>
          {isSelected && (
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30" title={event.character_name}>
              {event.character_name}
            </Badge>
          )}
        </CardTitle>

        {deleteEventList && isSelected && (
          <Button variant="ghost" size="icon" onClick={() => deleteEventList(event.event_name)} className="text-muted-foreground hover:text-destructive">
            <Trash2 size={16} />
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {event.choices.map((choice) => (
            <div
              key={choice.choice_number}
              onClick={() => {
                if (parseInt(choice.choice_number) === 0) return;
                addEventList({ character_name: event.character_name, event_name: event.event_name, chosen: parseInt(choice.choice_number) });
              }}
              className={`${
                eventChoicesConfig.some((ev) => ev.event_name === event.event_name && ev.chosen === parseInt(choice.choice_number))
                  ? "border-l-4 border-primary bg-primary/10"
                  : "border-l-4 border-transparent hover:border-primary/50 hover:bg-muted/10"
              } pl-4 py-3 rounded-r-md transition cursor-pointer`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium pr-1">
                    Choice {choice.choice_number}: {choice.choice_text}
                  </p>
                  <div className="mt-2 space-y-1">
                    {choice.variants.map((variant, idx) => (
                      <p key={idx} className="text-sm text-muted-foreground">
                        {variant.success_type !== "-" && <span className="font-semibold text-foreground mr-1">{variant.success_type}:</span>}
                        {variant.all_outcomes}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

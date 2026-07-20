import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Map, Sparkles, Users, X } from "lucide-react";
import EventDialog from "../EventDialog";
import { Button } from "@/components/ui/button";
import type { EventData } from "@/types/event.type";

type Props = {
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  data: EventData | null;
};

export default function SidebarEventList({
  selected,
  setSelected,
  data,
}: Props) {
  return (
    <div className="w-68 border-r pr-4 space-y-6 overflow-y-auto">
      <div>
        <h3 className="font-semibold text-sm flex items-center gap-2 mb-1">
          <Filter className="w-4 h-4" />
          Filter Options
        </h3>
        <p className="text-xs text-muted-foreground">
          Filter events by scenario, character, or support card
        </p>
      </div>

      {/* Scenario Filter */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Map className="w-4 h-4 text-blue-500" />
            Scenario
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data?.scenarios.map((scenario) => (
            <button
              key={scenario.name}
              onClick={() => {
                setSelected(scenario.name);
              }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors w-full text-left"
            >
              <img
                width={48}
                src={scenario.image_url}
                alt={scenario.name}
                className="rounded"
              />
              <div>
                <p className="font-medium text-sm">{scenario.name}</p>
                <p className="text-xs text-muted-foreground">Main Scenario</p>
              </div>
            </button>
          ))}
          <button
            onClick={() => {
              setSelected("All Umamusume");
            }}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors w-full text-left"
          >
            <img
              width={48}
              src="/9005.png"
              alt="Acupuncturist"
              className="rounded"
            />
            <div>
              <p className="font-medium text-sm">All Umamusume</p>
              <p className="text-xs text-muted-foreground">Special Event</p>
            </div>
          </button>
        </CardContent>
      </Card>

      {/* Character Filter */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-green-500" />
            Character
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EventDialog
            button="Select Character"
            data={data?.characterArraySchema.characters ?? []}
            setSelected={(selectedChar) => {
              setSelected(selectedChar);
            }}
          />
        </CardContent>
      </Card>

      {/* Support Card Filter */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            Support Card
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EventDialog
            button="Select Support Card"
            data={data?.supportCardArraySchema.supportCards ?? []}
            setSelected={(selectedCard) => {
              setSelected(selectedCard);
            }}
          />
        </CardContent>
      </Card>

      {selected && (
        <Button
          variant="outline"
          onClick={() => setSelected("")}
          className="w-full flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Clear Filter
        </Button>
      )}
    </div>
  );
}

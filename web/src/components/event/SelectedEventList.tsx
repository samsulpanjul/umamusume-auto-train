import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import EventCard from "./_c/EventCard";
import type { EventChoicesType, EventData, EventType } from "@/types/eventType";
import { Badge } from "../ui/badge";
import { Search, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { useMemo, useState } from "react";

type Props = {
  data: EventData | null;
  groupedChoices: EventType[];
  eventChoicesConfig: EventChoicesType[];
  addEventList: (event: EventChoicesType) => void;
  deleteEventList: (event_name: string) => void;
  clearEventList: () => void;
};

export default function SelectedEventList({ data, groupedChoices, eventChoicesConfig, addEventList, deleteEventList, clearEventList }: Props) {
  const allData = [...(data?.scenarios ?? []), ...(data?.characterArraySchema?.characters ?? []), ...(data?.supportCardArraySchema?.supportCards ?? [])];

  const [search, setSearch] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const characterList = [
    ...new Set(
      eventChoicesConfig.flatMap((event) => {
        const nameStr = event.character_name || "";
        return nameStr
          .toLowerCase()
          .split(",")
          .map((name) => name.trim())
          .filter((name) => name !== "" && !name.includes("tracen academy"));
      })
    ),
  ];

  const selectedEvents = groupedChoices?.filter((event) => eventChoicesConfig.some((conf) => conf.event_name === event.event_name));

  const filtered = useMemo(() => {
    const val = search.toLowerCase().toLowerCase();
    return selectedEvents?.filter((ev) => ev.event_name.toLowerCase().includes(val) || ev.character_name.toLowerCase().includes(val));
  }, [selectedEvents, search]);

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
          Selected Events
          {eventChoicesConfig.length > 0 && (
            <Badge variant="secondary" className="ml-1 text-xs px-2">
              {eventChoicesConfig.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="h-[85vh] w-full max-w-[90vw] p-0 overflow-hidden [&>button]:hidden">
        {/* Header */}
        <DialogHeader className="p-4 border-b flex flex-row items-center justify-between bg-muted/40">
          <DialogTitle className="text-lg font-semibold">Selected Events</DialogTitle>

          {eventChoicesConfig.length > 0 && (
            <Button variant="destructive" size="sm" onClick={clearEventList} className="flex items-center gap-1">
              <Trash2 className="w-4 h-4" /> Clear All Events
            </Button>
          )}
        </DialogHeader>

        <div className="flex h-[75vh]">
          {/* LEFT SIDE */}
          <div className="border-r p-4 flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search events or characters..." value={search} onChange={handleSearch} className="pl-10" />
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
                {filtered.map((event) => (
                  <EventCard key={event.event_name} addEventList={addEventList} event={event} eventChoicesConfig={eventChoicesConfig} deleteEventList={deleteEventList} />
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                <p className="text-base font-medium">No events selected yet</p>
                <p className="text-sm">Select some from the list to see them here</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

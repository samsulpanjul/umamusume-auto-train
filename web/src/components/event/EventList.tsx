import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Calendar, X } from "lucide-react";
import { useState } from "react";
import type { EventChoicesType, EventType } from "@/types/eventType";
import type { EventData } from "@/types/eventType";
import MainEventList from "./_c/EventList/Main";
import SidebarEventList from "./_c/EventList/Sidebar";

type Props = {
  data: EventData | null;
  groupedChoices: EventType[];
  eventChoicesConfig: EventChoicesType[];
  addEventList: (newList: EventChoicesType) => void;
  deleteEventList: (eventName: string) => void;
};

export default function EventList({ data, groupedChoices, eventChoicesConfig, addEventList, deleteEventList }: Props) {
  const [selected, setSelected] = useState<string>("");

  const eventSelected = selected ? groupedChoices?.filter((val) => val.character_name.toLowerCase().includes(selected.toLowerCase())) : [];

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2 shadow-sm hover:shadow-md transition">
            <Calendar className="w-4 h-4" />
            Event List
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-7xl w-full h-[90vh] flex flex-col overflow-hidden p-0 [&>button]:hidden">
          {/* HEADER */}
          <DialogHeader className="px-6 py-4 border-b bg-muted/30 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                <Calendar className="w-5 h-5 text-primary" />
                Event Database
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
            <SidebarEventList selected={selected} setSelected={setSelected} data={data} />

            {/* MAIN CONTENT */}
            <MainEventList deleteEventList={deleteEventList} addEventList={addEventList} eventChoicesConfig={eventChoicesConfig} eventSelected={eventSelected} selected={selected} setSelected={setSelected} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { Badge } from "../ui/badge";
import { X } from "lucide-react";
import { useState } from "react";
import type { EventChoicesType, EventType } from "@/types/event.type";
import type { EventData } from "@/types/event.type";
import MainEventList from "./_c/EventList/Main";
import SidebarEventList from "./_c/EventList/Sidebar";

type Props = {
  data: EventData | null;
  groupedChoices: EventType[];
  eventChoicesConfig: EventChoicesType[];
  addEventList: (newList: EventChoicesType) => void;
  deleteEventList: (eventName: string) => void;
};

export default function EventList({
  data,
  groupedChoices,
  eventChoicesConfig,
  addEventList,
  deleteEventList,
}: Props) {
  const [selected, setSelected] = useState<string>("");

  const eventSelected = selected
    ? groupedChoices?.filter((val) =>
      val.character_name.toLowerCase().includes(selected.toLowerCase())
    )
    : [];

  return (
    <>
      <div className="absolute right-3 top-5 gap-2 flex flex-row justify-between items-center">
        {selected && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 text-sm"
          >
            Filter: {selected}
            <button
              onClick={() => setSelected("")}
              className="ml-1 hover:text-destructive"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        )}
      </div>


      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR */}
        <SidebarEventList
          selected={selected}
          setSelected={setSelected}
          data={data}
        />

        {/* MAIN CONTENT */}
        <MainEventList
          deleteEventList={deleteEventList}
          addEventList={addEventList}
          eventChoicesConfig={eventChoicesConfig}
          eventSelected={eventSelected}
          selected={selected}
          setSelected={setSelected}
        />
      </div>

    </>
  );
}

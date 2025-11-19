import { TicketsIcon } from "lucide-react";
import IsOptimalEvent from "./IsOptimalEvent";
import EventList from "./EventList";
import SelectedEventList from "./SelectedEventList";
import type { EventChoicesType, EventData } from "@/types/eventType";
import type { Config, UpdateConfigType } from "@/types";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import localEvents from "../../../../data/events.json";


type Props = {
  config: Config;
  updateConfig: UpdateConfigType;
};

export default function EventSection({ config, updateConfig }: Props) {
  const { event } = config;
  const { use_optimal_event_choice, event_choices } = event;

  const getEventData: () => Promise<EventData> = async () => {
    try {
      return localEvents as EventData;
    } catch (error) {
      console.error("Failed to load local events:", error);
      throw error;
    }
  };

  const { data } = useQuery<EventData>({
    queryKey: ["events"],
    queryFn: getEventData,
  });

  const handleAddEventList = (val: EventChoicesType) => {
    const existingIndex = event_choices.findIndex(
      (ev) => ev.event_name === val.event_name
      );

    const newEventChoices =
    existingIndex !== -1
    ? event_choices.map((ev, i) =>
      i === existingIndex ? { ...ev, chosen: val.chosen } : ev
      )
    : [...event_choices, val];

    updateConfig("event", { ...event, event_choices: newEventChoices });
  };

  const deleteEventList = (val: string) =>
  updateConfig("event", {
    ...event,
    event_choices: event_choices.filter((e) => e.event_name !== val),
  });

  const groupedChoices = useMemo(() => {
    const choices = data?.choiceArraySchema?.choices ?? [];

    return Object.values(
      choices.reduce((acc, choice) => {
      // Unique key per character + event
      const key = `${choice.event_name}__${choice.char_id}`;

      // If this event group doesn't exist yet, create it
      if (!acc[key]) {
        acc[key] = {
          char_id: choice.char_id,
          event_name: choice.event_name,
          character_name: choice.character_name,
          choices: [],
        };
      }

      const eventGroup = acc[key];

      // Find if this choice already exists for this character
      let existingChoice = eventGroup.choices.find(
        (c) =>
        c.choice_number === choice.choice_number &&
        c.char_id === choice.char_id
        );

      // If not found, create the choice
      if (!existingChoice) {
        existingChoice = {
          choice_number: choice.choice_number,
          choice_text: choice.choice_text,
          char_id: choice.char_id, // important
          variants: [],
        };
        eventGroup.choices.push(existingChoice);
      }

      // Add the outcome variant
      existingChoice.variants.push({
        success_type: choice.success_type,
        all_outcomes: choice.all_outcomes,
      });

      return acc;
    }, {} as Record<
    string,
    {
      char_id: string;
      event_name: string;
      character_name: string;
      choices: {
        choice_number: string;
        choice_text: string;
        char_id: string;
        variants: { success_type: string; all_outcomes: string }[];
      }[];
    }
    >)
      );
  }, [data]);

  return (
    <div className="bg-card p-6 rounded-xl shadow-lg border border-border/20">
      <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
        <TicketsIcon className="text-primary" /> Event
      </h2>

      <IsOptimalEvent
        isUseOptimalEventChoice={use_optimal_event_choice}
        setIsUseOptimalEventChoice={(val) =>
          updateConfig("event", { ...event, use_optimal_event_choice: val })
        }
      />

      <div className="flex gap-6 mt-6">
        <EventList
          eventChoicesConfig={event_choices}
          addEventList={handleAddEventList}
          deleteEventList={deleteEventList}
          data={data!}
          groupedChoices={groupedChoices}
        />

        <SelectedEventList
          data={data!}
          groupedChoices={groupedChoices}
          eventChoicesConfig={event_choices}
          addEventList={handleAddEventList}
          deleteEventList={deleteEventList}
          clearEventList={() =>
            updateConfig("event", { ...event, event_choices: [] })
          }
        />
      </div>
    </div>
  );
}
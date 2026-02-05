import { ListTodo } from "lucide-react";
import SelectedEventList from "./SelectedEventList";
import Tooltips from "@/components/_c/Tooltips";
import type { EventChoicesType, EventData } from "@/types/event.type";
import type { Config, UpdateConfigType } from "@/types";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "../ui/checkbox";

type Props = {
  config: Config;
  updateConfig: UpdateConfigType;
};

export default function EventSection({ config, updateConfig }: Props) {
  const { event } = config;
  const { use_optimal_event_choice, event_choices } = event;
  const { use_skip_claw_machine } = config;

  const getEventData = async () => {
    try {
      const res = await fetch("/data/events.json");
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    } catch (error) {
      console.error("Failed to fetch events:", error);
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
      choices.reduce(
        (acc, choice) => {
          const key = `${choice.event_name}__${choice.character_name}`;

          if (!acc[key]) {
            acc[key] = {
              event_name: choice.event_name,
              character_name: choice.character_name,
              choices: [],
            };
          }

          const eventGroup = acc[key];
          let existingChoice = eventGroup.choices.find(
            (c) => c.choice_number === choice.choice_number
          );

          if (!existingChoice) {
            existingChoice = {
              choice_number: choice.choice_number,
              choice_text: choice.choice_text,
              variants: [],
            };
            eventGroup.choices.push(existingChoice);
          }

          existingChoice.variants.push({
            success_type: choice.success_type,
            all_outcomes: choice.all_outcomes,
          });

          return acc;
        },
        {} as Record<
          string,
          {
            event_name: string;
            character_name: string;
            choices: {
              choice_number: string;
              choice_text: string;
              variants: { success_type: string; all_outcomes: string }[];
            }[];
          }
        >
      )
    );
  }, [data]);

  return (
    <div className="section-card">
      <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
        <ListTodo className="text-primary" /> Events
      </h2>
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-2">
        <label className="flex gap-2 items-center cursor-pointer">
          <Checkbox
            checked={use_optimal_event_choice}
            onCheckedChange={() =>
              updateConfig("event", {
                ...event,
                use_optimal_event_choice: !use_optimal_event_choice,
              })
            }
          />
          <span className="shrink-0">Use Optimal Event Choices</span>
        </label>
        <div className="flex gap-6 fade-in duration-200">
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
        <label className="flex gap-2 items-center cursor-pointer">
          <Checkbox
            checked={use_skip_claw_machine}
            onCheckedChange={() =>
              updateConfig("use_skip_claw_machine", !use_skip_claw_machine)
            }
          />
          <span className="shrink-0">Autoplay Claw Machine</span>
          <Tooltips>Enabling this will auto play the claw machine.</Tooltips>
        </label>
      </div>
    </div>
  );
}

import Sortable from "@/components/Sortable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Config, UpdateConfigType } from "@/types";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";

type Props = {
  config: Config;
  updateConfig: UpdateConfigType;
};

export default function FormActionSequence({ config, updateConfig }: Props) {
  const [value, setValue] = useState([
    "infirmary",
    "recreation",
    "training",
    "race",
  ]);
  const [name, setName] = useState("");
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = value.indexOf(active.id as string);
      const newIndex = value.indexOf(over?.id as string);
      setValue(arrayMove(value, oldIndex, newIndex));
    }
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const { training_strategy } = config;
        updateConfig("training_strategy", {
          ...training_strategy,
          action_sequence_sets: {
            ...training_strategy.action_sequence_sets,
            [name]: value,
          },
        });
        console.log(name, value);
      }}
    >
      <label htmlFor="set_name" className="flex gap-4 items-center">
        <span className="w-52">Set Name:</span>
        <Input
          id="set_name"
          type="text"
          placeholder="action_sequence_set_name"
          required
          onChange={(e) => {
            const val = e.target.value.trim().replaceAll(" ", "_");
            setName(val);
          }}
        />
      </label>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={value} strategy={verticalListSortingStrategy}>
          <ul className="flex flex-col gap-2 w-fit">
            {value.map((s) => (
              <Sortable key={s} id={s} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      <Button type="submit">Save set</Button>
    </form>
  );
}

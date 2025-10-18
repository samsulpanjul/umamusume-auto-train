import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Sortable from "../Sortable";

type Props = {
  priorityStat: string[];
  setPriorityStat: (list: string[]) => void;
};

export default function PriorityStat({ priorityStat, setPriorityStat }: Props) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = priorityStat.indexOf(active.id as string);
      const newIndex = priorityStat.indexOf(over?.id as string);
      setPriorityStat(arrayMove(priorityStat, oldIndex, newIndex));
    }
  };

  return (
    <div className="flex flex-col gap-2 w-fit">
      <p className="text-lg font-medium">Priority Stat</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={priorityStat} strategy={verticalListSortingStrategy}>
          <ul className="flex flex-col gap-2 w-fit">
            {priorityStat.map((s) => (
              <Sortable key={s} id={s} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}

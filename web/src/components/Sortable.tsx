import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Grip } from "lucide-react";

export default function Sortable({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners} className="px-3 py-1.25 rounded-md cursor-grab flex gap-4 border-1 border-border bg-transparent dark:bg-input/30">
      <Grip />
      {id.toUpperCase()}
    </li>
  );
}

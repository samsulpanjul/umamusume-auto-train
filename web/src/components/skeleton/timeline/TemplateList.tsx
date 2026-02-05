import { Button } from "@/components/ui/button";
import { useModifyTrainingStrategy } from "@/hooks/training-strategy/useModifyTrainingStrategy";
import type { Config, UpdateConfigType } from "@/types";
import { Trash, GripVertical } from "lucide-react";
import { colorFromString } from "@/components/skeleton/ColorFromString";

type Props = {
  config: Config;
  updateConfig: UpdateConfigType;
};

export default function TemplateList({ config, updateConfig }: Props) {
  const {
    training_strategy: { templates: templates_config },
  } = config;
  const templates = Object.entries(templates_config);

  const modify = useModifyTrainingStrategy(config, updateConfig, "templates");

  return (
    <>
      {templates.length === 0 ? (
        <div className="size-full flex flex-col items-center justify-center">
          <p className="text-xl font-semibold">No target stat sets</p>
          <p className="text-slate-500">Please add them first</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <div className="w-full">
            <p className="">Drag and drop stat sets below into timeline to schedule your training strategy.</p>
          </div>
          {templates.map((set) => {
            const [name] = set;

            return (
              <div
                key={name}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("templateName", name);
                }}
                style={{ ...colorFromString(name) }}
                className="relative group border border-slate-200 rounded-lg px-2 py-2 pr-3 w-fit bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-grab active:cursor-grabbing flex items-center gap-1.5"
              >
                <GripVertical className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800 whitespace-nowrap text-sm">
                    {name.replaceAll("_", " ")}
                  </p>

                  {/* <div className="mt-2 flex flex-col gap-2">
                    {stat.map(([key, val]) => (
                      <div
                        key={key}
                        className="text-sm text-slate-600 border rounded-md px-2 py-1"
                      >
                        <p className="capitalize">{key.replaceAll("_", " ")}</p>
                        <span className="font-medium">{val}</span>
                      </div>
                    ))}
                  </div> */}
                </div>

                <Button
                  size="icon"
                  variant="destructive"
                  className="hidden absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => modify(name, null)}
                >
                  <Trash className="h-4 w-4" color="white" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

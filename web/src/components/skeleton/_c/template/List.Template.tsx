import { Button } from "@/components/ui/button";
import { useModifyTrainingStrategy } from "@/hooks/training-strategy/useModifyTrainingStrategy";
import type { Config, UpdateConfigType } from "@/types";
import { Trash } from "lucide-react";
import { colorFromString } from "@/components/skeleton/ColorFromString";

type Props = {
  config: Config;
  updateConfig: UpdateConfigType;
};

export default function ListTemplate({ config, updateConfig }: Props) {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {templates.map((set) => {
            const [name, value] = set;
            const stat = Object.entries(value ?? {});

            return (
              <div
                key={name}
                style={{
                  ...colorFromString(name),
                }}
                className="relative group border border-slate-200 rounded-xl p-4 w-full max-w-80 bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
              >
                <div className="pr-10">
                  <p className="text-lg font-semibold text-slate-800 truncate">
                    {name}
                  </p>

                  <div className="mt-2 flex flex-col gap-2">
                    {stat.map(([key, val]) => (
                      <div
                        key={key}
                        className="text-sm text-slate-600 border rounded-md px-2 py-1"
                      >
                        <p className="capitalize">{key.replaceAll("_", " ")}</p>
                        <span className="font-medium">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
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

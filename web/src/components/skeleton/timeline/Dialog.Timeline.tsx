import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Config, UpdateConfigType } from "@/types";
import { Trash } from "lucide-react";
import { useState } from "react";
import { colorFromString } from "@/components/skeleton/ColorFromString";

type Props = {
  config: Config;
  updateConfig: UpdateConfigType;
  year: string;
  date: string;
  children: React.ReactNode;
  value: string;
};

export default function DialogTimeline({
  config,
  updateConfig,
  year,
  date,
  children,
  value,
}: Props) {
  const [open, setOpen] = useState<boolean>(false);

  const {
    training_strategy: { templates: templates_config },
  } = config;
  const templates = Object.entries(templates_config);
  var currentDate: string;
  if (year === "Finale Underway") {
    currentDate = year;
  } else {
    currentDate = `${year} ${date}`;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="cursor-pointer w-full">{children}</DialogTrigger>
      <DialogContent className="h-[calc(100%-72px)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Templates</span>
            <Button
              onClick={() => {
                const newTimeline = { ...config.training_strategy.timeline };
                delete newTimeline[currentDate];

                updateConfig("training_strategy", {
                  ...config.training_strategy,
                  timeline: newTimeline,
                });
                setOpen(false);
              }}
            >
              <Trash />
            </Button>
          </DialogTitle>
          <DialogDescription>Dialog Timeline</DialogDescription>
          {templates.length === 0 ? (
            <div className="size-full flex flex-col items-center justify-center">
              <p className="text-xl font-semibold">No target stat sets</p>
              <p className="text-slate-500">Please add them first</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {templates.map((set) => {
                const [name, value_template] = set;
                const stat = Object.entries(value_template ?? {});

                return (
                  <div
                    key={name}
                    style={{
                      ...colorFromString(name),
                    }}
                    className={`relative group cursor-pointer border ${
                      value === name ? "border-slate-700" : "border-slate-200"
                    }  rounded-xl p-4 w-full max-w-80 bg-white 
                    shadow-sm hover:shadow-md hover:border-slate-700 transition-all
                    `}
                    onClick={() => {
                      console.log("added to timeline");
                      updateConfig("training_strategy", {
                        ...config.training_strategy,
                        timeline: {
                          ...config.training_strategy.timeline,
                          [currentDate]: name,
                        },
                      });
                      setOpen(false);
                    }}
                  >
                    <div>
                      <p className="text-lg font-semibold text-slate-800 truncate">
                        {name}
                      </p>

                      <div className="mt-2 flex flex-col gap-2">
                        {stat.map(([key, val]) => (
                          <div
                            key={key}
                            className="text-sm text-slate-600 border rounded-md px-2 py-1"
                          >
                            <p className="capitalize">
                              {key.replaceAll("_", " ")}
                            </p>
                            <span className="font-medium">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

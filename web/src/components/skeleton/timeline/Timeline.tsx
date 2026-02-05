import { REAL_CALENDAR } from "@/constants/race.constant";
import type { Config, UpdateConfigType } from "@/types";
import { Triangle, Trash } from "lucide-react";
import { colorFromString } from "@/components/skeleton/ColorFromString";
import { useRef, useState } from "react";

type Props = {
  config: Config;
  updateConfig: UpdateConfigType;
};

export default function Timeline({ config, updateConfig }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);

  const {
    training_strategy: { timeline: timeline_config },
  } = config;

  // Flatten the calendar into a single array of turns
  const flatCalendar: { year: string; date: string; key: string }[] = [];
  Object.entries(REAL_CALENDAR).forEach(([year, dates]) => {
    dates.forEach((date) => {
      const key = year === "Finale Underway" ? year : `${year} ${date}`;
      flatCalendar.push({ year, date, key });
    });
  });

  // Determine active template for each turn and identify turns where a template starts
  let currentActiveTemplate: string | undefined = undefined;
  const items = flatCalendar.map((item) => {
    const assignedTemplate = timeline_config[item.key];
    if (assignedTemplate) {
      currentActiveTemplate = assignedTemplate;
    }
    return {
      ...item,
      assignedTemplate, // Template explicitly assigned to this date
      activeTemplate: currentActiveTemplate, // Current template (persists until next assignedTemplate)
    };
  });

  return (
    <div ref={containerRef} className={`w-full overflow-x-visible pt-16 pb-6`}>
      <div className="flex min-w-max">
        {items.map((item, index) => {
          const color = colorFromString(item.activeTemplate);
          const isYearStart = index === 0 || items[index - 1].year !== item.year;
          const isYearEnd = index === items.length - 1 || items[index + 1].year !== item.year;
          const zIndex = items.length - index;

          return (
            <div
              key={item.key}
              className={`relative flex flex-col items-stretch group pb-6 transition-[flex-grow] duration-200 ${
                dragOverKey === item.key ? "flex-3" : "flex-1"
              }`}
              style={{ zIndex }}
            >
              {/* Angled Date Label */}
              <div
                className={`absolute -top-3 left-1/2 translate-x-[-0.5rem] pointer-events-none w-0 overflow-visible transition-all duration-200 ${
                  item.assignedTemplate || dragOverKey === item.key
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                } ${dragOverKey === item.key ? "z-50" : ""}`}
              >
                <div
                  className={`-rotate-60 whitespace-nowrap capitalize text-muted-foreground origin-top-left font-semibold tracking-tighter transition-all duration-300 ${
                    dragOverKey === item.key ? "text-sm -top-3.5" : "text-xs"
                  }`}
                >
                  {item.date}
                </div>
              </div>

              {/* Timeline Tick Segment */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverKey(item.key);
                }}
                onDragLeave={() => {
                  setDragOverKey(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOverKey(null);
                  const templateName = e.dataTransfer.getData("templateName");
                  if (templateName) {
                    updateConfig("training_strategy", {
                      ...config.training_strategy,
                      timeline: {
                        ...config.training_strategy.timeline,
                        [item.key]: templateName,
                      },
                    });
                  }
                }}
                className={`flex-1 min-h-32 pb-6 pt-1 border-r border-dotted flex items-center justify-center transition-all hover:opacity-80
                  ${item.assignedTemplate ? "border-l-2 border-l-solid min-w-12" : ""} 
                  ${isYearStart ? "border-l-0 border-l-card !border-b-timeline" : "!border-b-timeline !border-b-foreground"} 
                  ${isYearEnd ? "border-r-2 border-dashed !border-r-background" : ""}
                  ${item.year === "Finale Underway" ? "!border-r-0 !border-b-timeline" : "left-0"}`}
                style={{ backgroundColor: color.backgroundColor, borderColor: color.borderColor }}
              >
                {item.assignedTemplate ? (
                  <div className="[writing-mode:sideways-lr] relative cursor-pointer flex flex-row items-stretch content-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newTimeline = { ...config.training_strategy.timeline };
                      delete newTimeline[item.key];
                      updateConfig("training_strategy", { ...config.training_strategy, timeline: newTimeline, });
                    }}
                  >

                    <div className="text-slate-800 whitespace-nowrap font-semibold flex-1 text-sm">
                      {item.assignedTemplate.replaceAll("_", " ")}
                    </div>

                    <div className="mb-2 p-0.75 w-5 h-5 relative bg-white border shadow-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity" >
                      <Trash size={12} className=" text-slate-400 hover:text-red-500" />
                    </div>

                  </div>
                ) : (
                  <></>
                )}
              </div>

              {/* Year Indicator Header */}
              {isYearStart && (
                <div className={`absolute h-fit w-max overflow-visible whitespace-nowrap bottom-1 flex items-center gap-2 font-bold text-xs uppercase text-muted-foreground tracking-wider ${item.year === "Finale Underway" ? "right-0 flex-row-reverse" : "left-0" }`}>
                  {item.year}
                  {item.year !== "Finale Underway" && (
                    <Triangle size={11} className="rotate-90 shrink-0"/>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

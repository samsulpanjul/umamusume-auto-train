import { REAL_CALENDAR } from "@/constants/race.constant";
import type { Config, UpdateConfigType } from "@/types";
import { Plus } from "lucide-react";
import DialogTimeline from "./_c/Dialog.Timeline";  
import { colorFromString } from "@/components/skeleton/ColorFromString";

type Props = {
  config: Config;
  updateConfig: UpdateConfigType;
};

export default function Timeline({ config, updateConfig }: Props) {
  const {
    training_strategy: { timeline: timeline_config },
  } = config;
  let prev_value: string | undefined = undefined;
  let func_name: string | undefined = undefined;

  const YEAR_COLORS: Record<string, string> = {
    "Junior Year": "bg-green-100 border-green-300",
    "Classic Year": "bg-blue-100 border-blue-300",
    "Senior Year": "bg-yellow-100 border-yellow-300",
  };

  return (
    <div className="grid grid-flow-col auto-cols-max gap-4">
      {
        Object.keys(REAL_CALENDAR).map((year) => (
          <div key={year} className="grid grid-rows-[max-content_1fr] gap-2 text-center">
            <div className={`rounded-xl border px-3 py-1 font-semibold ${YEAR_COLORS[year]}`}>
              {year}
            </div>
            <div className="flex gap-4 py-2">
            {REAL_CALENDAR[year as keyof typeof REAL_CALENDAR].map((c) => {
              const key = `${year} ${c}`;
              var value = timeline_config[key];
              if (value) {
                func_name = value
                value = value.replaceAll("_", " ");
                prev_value = value;
              }
              let index = 0;
              switch (year) {
                case "Junior Year":
                  index = 90-(REAL_CALENDAR[year as keyof typeof REAL_CALENDAR].indexOf(c));
                  break;
                case "Classic Year":
                  index = 70-(REAL_CALENDAR[year as keyof typeof REAL_CALENDAR].indexOf(c));
                  break;
                case "Senior Year":
                  index = 40-(REAL_CALENDAR[year as keyof typeof REAL_CALENDAR].indexOf(c));
                  break;
                case "Finale Underway":
                  index = 10-(REAL_CALENDAR[year as keyof typeof REAL_CALENDAR].indexOf(c));
                  break;
              }
              return (
                <DialogTimeline
                config={config}
                updateConfig={updateConfig}
                year={year}
                date={c}
                value={value}
                >
                <div
                  key={key}
                  style={{ 
                    zIndex: index,
                    ...colorFromString(func_name) 
                  }}
                  className={`group relative box w-40 h-full 
                  ${value ? "" : "-ml-40 opacity-50 transition-transform hover:translate-x-[15px] hover:opacity-100"}
                  flex-shrink-0 flex flex-col gap-1 justify-center items-center 
                  border rounded-md`}
                >
                  <Plus
                    className={
                      value
                        ? "opacity-100"
                        : "absolute top-1 right-1 opacity-100" // top-right when empty
                    }
                  />
                  {
                    value ? (
                      <span className="text-xs">{value}</span>
                    ) : (
                      <span className="absolute right-1 inset-y-0 flex items-center whitespace-nowrap translate-x-[-9px]
                      opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs [writing-mode:vertical-rl] [text-orientation:mixed] rotate-180">
                          {prev_value}
                        </span>
                      </span>
                    )
                  }
                  {
                    value ? (
                      <span className="text-m">{c}</span>
                    ) : (
                      <span className="absolute right-1 inset-y-0 flex items-center whitespace-nowrap translate-x-[5px]">
                        <span className="text-xs [writing-mode:vertical-rl] [text-orientation:mixed] rotate-180">
                          {"(" + c + ")"}
                        </span>
                      </span>
                    )
                  }
                </div>
                </DialogTimeline>
              );
            })}
            </div>
          </div>
        ))
      }
    </div>
  );
}

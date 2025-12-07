import { CALENDAR, CALENDAR_JUNIOR } from "@/constants/race.constant";
import type { Config, UpdateConfigType } from "@/types";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DialogTimeline from "./_c/Dialog.Timeline";

type Props = {
  config: Config;
  updateConfig: UpdateConfigType;
};

export default function Timeline({ config, updateConfig }: Props) {
  const {
    training_strategy: { timeline: timeline_config },
  } = config;
  
  let prev_value: string | undefined = undefined;

  return (
    <Tabs defaultValue="junior">
      <TabsList>
        <TabsTrigger value="junior">Junior Year</TabsTrigger>
        <TabsTrigger value="classic">Classic Year</TabsTrigger>
        <TabsTrigger value="senior">Senior Year</TabsTrigger>
      </TabsList>
      <TabsContent
        value="junior"
        className="grid grid-cols-5 place-items-center gap-y-4"
      >
        {CALENDAR_JUNIOR.map((c) => {
          const key = `Junior Year ${c}`;
          const value = timeline_config[key];

          if (value) {
            prev_value = value;
          }

          return (
            <DialogTimeline
              config={config}
              updateConfig={updateConfig}
              year="Junior Year"
              date={c}
              value={value}
            >
              <div key={c} className="box w-40 h-40 flex flex-col gap-1 justify-center items-center">

              {value ? (
                // ▷ Value exists → normal mode
                <>
                  <span className="text-xs truncate">{value}</span>
                  <p>{c}</p>
                </>
              ) : (
                // ▷ No value → plus mode with prev_value
                <div className="flex flex-col items-center">
                  <Plus />

                  {/* show date ONLY here */}
                  <span className="text-xs">{c}</span>

                  <div className="w-full h-px bg-gray-400 my-1 opacity-40"></div>

                  {prev_value && (
                    <span className="text-[10px] opacity-50 truncate">
                      {prev_value}
                    </span>
                  )}
                </div>
              )}
              </div>
            </DialogTimeline>
          );
        })}
      </TabsContent>

      <TabsContent
        value="classic"
        className="grid grid-cols-6 place-items-center gap-y-4"
      >
        {CALENDAR.map((c) => {
          const key = `Classic Year ${c}`;
          const value = timeline_config[key];

          if (value) {
            prev_value = value;
          }
          
          return (
            <DialogTimeline
              config={config}
              updateConfig={updateConfig}
              year="Classic Year"
              date={c}
              value={value}
            >
              <div key={c} className="box w-40 h-40 flex flex-col gap-1 justify-center items-center">

              {value ? (
                // ▷ Value exists → normal mode
                <>
                  <span className="text-xs truncate">{value}</span>
                  <p>{c}</p>
                </>
              ) : (
                // ▷ No value → plus mode with prev_value
                <div className="flex flex-col items-center">
                  <Plus />

                  {/* show date ONLY here */}
                  <span className="text-xs">{c}</span>

                  <div className="w-full h-px bg-gray-400 my-1 opacity-40"></div>

                  {prev_value && (
                    <span className="text-[10px] opacity-50 truncate">
                      {prev_value}
                    </span>
                  )}
                </div>
              )}
              </div>
            </DialogTimeline>
          );
        })}
      </TabsContent>

      <TabsContent
        value="senior"
        className="grid grid-cols-6 place-items-center gap-y-4"
      >
        {CALENDAR.map((c) => {
          const key = `Senior Year ${c}`;
          const value = timeline_config[key];

          if (value) {
            prev_value = value;
          }

          return (
            <DialogTimeline
              config={config}
              updateConfig={updateConfig}
              year="Senior Year"
              date={c}
              value={value}
            >
              <div key={c} className="box w-40 h-40 flex flex-col gap-1 justify-center items-center">

              {value ? (
                // ▷ Value exists → normal mode
                <>
                  <span className="text-xs truncate">{value}</span>
                  <p>{c}</p>
                </>
              ) : (
                // ▷ No value → plus mode with prev_value
                <div className="flex flex-col items-center">
                  <Plus />

                  {/* show date ONLY here */}
                  <span className="text-xs">{c}</span>

                  <div className="w-full h-px bg-gray-400 my-1 opacity-40"></div>

                  {prev_value && (
                    <span className="text-[10px] opacity-50 truncate">
                      {prev_value}
                    </span>
                  )}
                </div>
              )}
              </div>
            </DialogTimeline>
          );
        })}
      </TabsContent>
    </Tabs>
  );
}

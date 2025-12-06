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

          return (
            <DialogTimeline
              config={config}
              updateConfig={updateConfig}
              year="Junior Year"
              date={c}
              value={value}
            >
              <div
                key={c}
                className="box w-40 flex flex-col gap-2 justify-center items-center"
              >
                <span className="text-xs truncate">
                  {value ? value : <Plus />}
                </span>
                <p>{c}</p>
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

          return (
            <DialogTimeline
              config={config}
              updateConfig={updateConfig}
              year="Classic Year"
              date={c}
              value={value}
            >
              <div
                key={c}
                className="box w-40 flex flex-col gap-2 justify-center items-center"
              >
                <span className="text-xs truncate">
                  {value ? value : <Plus />}
                </span>
                <p>{c}</p>
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

          return (
            <DialogTimeline
              config={config}
              updateConfig={updateConfig}
              year="Senior Year"
              date={c}
              value={value}
            >
              <div
                key={c}
                className="box w-40 flex flex-col gap-2 justify-center items-center"
              >
                <span className="text-xs truncate">
                  {value ? value : <Plus />}
                </span>
                <p>{c}</p>
              </div>
            </DialogTimeline>
          );
        })}
      </TabsContent>
    </Tabs>
  );
}

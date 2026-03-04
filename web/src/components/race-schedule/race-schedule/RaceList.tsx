import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { RaceScheduleDataType, RaceScheduleType } from "@/types/race.type";
import RaceFilters from "./RaceFilters";
import RaceCalendar from "./RaceCalendar";

interface FilterState {
  search: string;
  gradeFilter: string;
  terrainFilter: string;
  distanceFilter: string;
  sparksFilter: { label: string; value: string }[];
  setSearch: (value: string) => void;
  setGradeFilter: (value: any) => void;
  setTerrainFilter: (value: any) => void;
  setDistanceFilter: (value: any) => void;
  setSparksFilter: (value: any) => void;
}

type Props = {
  raceSchedule: RaceScheduleType[];
  filteredRaceData: RaceScheduleDataType;
  filterState: FilterState;
  addRaceSchedule: (newList: RaceScheduleType) => void;
  deleteRaceSchedule: (name: string, year: string) => void;
  clearRaceSchedule: () => void;
};

export default function RaceScheduleDialog({
  raceSchedule,
  filteredRaceData,
  filterState,
  addRaceSchedule,
  deleteRaceSchedule,
  clearRaceSchedule,
}: Props) {
  const {
    "Junior Year": junior,
    "Classic Year": classic,
    "Senior Year": senior,
  } = filteredRaceData;

  return (
    <>
      <div className="absolute right-3 top-5 gap-2 flex flex-row justify-between items-center">
        <div className="flex items-center gap-3">
          {raceSchedule.length > 0 && (
            <Badge>
              {raceSchedule.length} race{raceSchedule.length > 1 ? "s" : ""}{" "}
              selected
            </Badge>
          )}
        </div>
        <Badge
          variant="outline"
          className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
          onClick={clearRaceSchedule}
        >
          Clear All
        </Badge>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <RaceFilters filterState={filterState} />

        <div className="flex-1 pl-4 flex">
          <Tabs className="w-full" defaultValue="junior-year">
            <TabsList className="gap-4 mb-4">
              <TabsTrigger
                value="junior-year"
                className="group flex items-center gap-2 data-[state=inactive]:border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer"
              >
                Junior Year
                <Badge className="ml-1 group-data-[state=active]:bg-card group-data-[state=active]:text-card-foreground">
                  {Object.keys(junior).length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="classic-year"
                className="group flex items-center gap-2 data-[state=inactive]:border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer"
              >
                Classic Year
                <Badge className="ml-1 group-data-[state=active]:bg-card group-data-[state=active]:text-card-foreground">
                  {Object.keys(classic).length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="senior-year"
                className="group flex items-center gap-2 data-[state=inactive]:border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer"
              >
                Senior Year
                <Badge className="ml-1 group-data-[state=active]:bg-card group-data-[state=active]:text-card-foreground">
                  {Object.keys(senior).length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="junior-year"
              className="grid grid-cols-4 gap-4 overflow-y-auto"
            >
              <RaceCalendar
                races={junior}
                year="Junior Year"
                raceSchedule={raceSchedule}
                addRaceSchedule={addRaceSchedule}
                deleteRaceSchedule={deleteRaceSchedule}
              />
            </TabsContent>

            <TabsContent
              value="classic-year"
              className="grid grid-cols-4 gap-4 overflow-y-auto"
            >
              <RaceCalendar
                races={classic}
                year="Classic Year"
                raceSchedule={raceSchedule}
                addRaceSchedule={addRaceSchedule}
                deleteRaceSchedule={deleteRaceSchedule}
              />
            </TabsContent>

            <TabsContent
              value="senior-year"
              className="grid grid-cols-4 gap-4 overflow-y-auto"
            >
              <RaceCalendar
                races={senior}
                year="Senior Year"
                raceSchedule={raceSchedule}
                addRaceSchedule={addRaceSchedule}
                deleteRaceSchedule={deleteRaceSchedule}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
</>
  );
}

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
            <Badge variant="secondary">
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
            <TabsList className="gap-4 mb-6 bg-transparent">
              <TabsTrigger
                value="junior-year"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Junior Year
                <Badge variant="secondary" className="ml-1">
                  {Object.keys(junior).length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="classic-year"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Classic Year
                <Badge variant="secondary" className="ml-1">
                  {Object.keys(classic).length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="senior-year"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Senior Year
                <Badge variant="secondary" className="ml-1">
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

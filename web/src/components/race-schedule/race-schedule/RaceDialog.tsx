import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy } from "lucide-react";
import type { RaceScheduleDataType } from "@/types/raceType";
import RaceFilters from "./RaceFilters";
import RaceCalendar from "./RaceCalendar";
import type { RaceScheduleType } from "@/types";

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
    <DialogContent className="max-w-7xl w-full h-[90vh] flex flex-col overflow-hidden p-0 [&>button]:hidden">
      <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-background to-muted/30 backdrop-blur-sm flex flex-row justify-between items-center">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-primary" />
          <DialogTitle>Race Schedule</DialogTitle>
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
      </DialogHeader>
      <DialogDescription>Race schedule selection dialog</DialogDescription>

      <div className="flex-1 flex overflow-hidden">
        <RaceFilters filterState={filterState} />

        <div className="flex-1 px-8 flex">
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
              className="grid grid-cols-4 gap-4 overflow-y-auto px-4 pb-8"
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
              className="grid grid-cols-4 gap-4 overflow-y-auto px-4 pb-8"
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
              className="grid grid-cols-4 gap-4 overflow-y-auto px-4 pb-8"
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
    </DialogContent>
  );
}

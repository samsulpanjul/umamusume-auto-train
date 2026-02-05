import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Trophy,
  Mountain,
  Ruler,
  Sparkles,
} from "lucide-react";
import MultipleSelector from "@/components/ui/multiselect";
import { SPARKS } from "@/constants/race.constant";
import FilterSelect from "./FilterSelect";
import { Badge } from "@/components/ui/badge";

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
  filterState: FilterState;
};

export default function RaceFilters({ filterState }: Props) {
  const {
    search,
    gradeFilter,
    terrainFilter,
    distanceFilter,
    sparksFilter,
    setSearch,
    setGradeFilter,
    setTerrainFilter,
    setDistanceFilter,
    setSparksFilter,
  } = filterState;

  return (
    <div className="w-60 border-r pr-6">
      <div className="mb-6 flex justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <p className="font-semibold text-lg">Filters</p>
        </div>
        <Badge
          className="cursor-pointer"
          onClick={() => {
            setSearch("");
            setGradeFilter("All");
            setTerrainFilter("All");
            setDistanceFilter("All");
            setSparksFilter([]);
          }}
        >
          Clear Filters
        </Badge>
      </div>

      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Search Race</label>
          <div className="relative pt-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search race..."
              className="pl-9 w-full"
            />
          </div>
        </div>

        <div className="w-full flex flex-col gap-6">
          <FilterSelect
            label="Grade"
            icon={<Trophy className="w-4 h-4" />}
            value={gradeFilter}
            onValueChange={setGradeFilter}
            options={["All", "G1", "G2", "G3"]}
          />

          <FilterSelect
            label="Terrain"
            icon={<Mountain className="w-4 h-4" />}
            value={terrainFilter}
            onValueChange={setTerrainFilter}
            options={["All", "Turf", "Dirt"]}
          />

          <FilterSelect
            label="Distance"
            icon={<Ruler className="w-4 h-4" />}
            value={distanceFilter}
            onValueChange={setDistanceFilter}
            options={["All", "Sprint", "Mile", "Medium", "Long"]}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Sparks
            </label>
            <MultipleSelector
              defaultOptions={SPARKS.map((spark) => ({
                label: spark,
                value: spark,
              }))}
              placeholder="Select sparks..."
              emptyIndicator={
                <p className="text-center text-sm py-2 text-muted-foreground">
                  no results found.
                </p>
              }
              value={sparksFilter}
              onChange={setSparksFilter}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import type { RaceType } from "@/types/raceType";

type Props = {
  title: string;
  race: RaceType;
  year: string;
  isSelected: boolean;
  onSelect: () => void;
  onDeselect: () => void;
};

export default function RaceCard({
  title,
  race,
  isSelected,
  onSelect,
  onDeselect,
}: Props) {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "G1":
        return "bg-blue-500/20 text-blue-600 border-blue-200";
      case "G2":
        return "bg-red-500/20 text-red-600 border-red-200";
      case "G3":
        return "bg-amber-500/20 text-amber-600 border-amber-200";
      default:
        return "bg-gray-500/20 text-gray-600 border-gray-200";
    }
  };

  const handleClick = () => {
    if (isSelected) {
      onDeselect();
    } else {
      onSelect();
    }
  };

  const handleBadgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeselect();
  };

  return (
    <Card
      className={`relative rounded-2xl border cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "border-primary ring-2 ring-primary/20"
          : "border-border/50 hover:border-primary/40"
      }`}
      onClick={handleClick}
    >
      {isSelected && (
        <Badge
          className="absolute top-4 right-4 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleBadgeClick}
        >
          Selected
        </Badge>
      )}

      <CardHeader className="pb-3 flex flex-row items-center">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <Badge
          variant="secondary"
          className={`font-semibold ${getGradeColor(race.grade)}`}
        >
          {race.grade}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="font-medium text-foreground">
              {race.racetrack}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span>
              {race.terrain}, {race.distance.meters}m ({race.distance.type})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span>Sparks: {race.sparks.join(", ")}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t">
          <Users className="w-4 h-4" />
          <span className="text-foreground font-medium">
            +{race.fans.gained.toLocaleString()} Fans
          </span>
          <span className="text-muted-foreground">
            (Req: {race.fans.required.toLocaleString()})
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

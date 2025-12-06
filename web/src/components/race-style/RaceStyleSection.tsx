import { Trophy } from "lucide-react";
import IsPositionSelectionEnabled from "./IsPositionSelectionEnabled";
import PreferredPosition from "./PreferredPosition";
import IsPositionByRace from "./IsPositionByRace";
import PositionByRace from "./PositionByRace";
import type { Config, UpdateConfigType } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  config: Config;
  updateConfig: UpdateConfigType;
};

const RANK = ["s", "a", "b", "c", "d", "e", "f", "g"];

export default function RaceStyleSection({ config, updateConfig }: Props) {
  const {
    position_selection_enabled,
    preferred_position,
    enable_positions_by_race,
    positions_by_race,
    minimum_aptitudes: { surface, distance, style },
  } = config;

  return (
    <div className="bg-card p-6 rounded-xl shadow-lg border border-border/20">
      <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
        <Trophy className="text-primary" />
        Race Style
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          <IsPositionSelectionEnabled
            positionSelectionEnabled={position_selection_enabled}
            setPositionSelectionEnabled={(val) =>
              updateConfig("position_selection_enabled", val)
            }
          />
          <PreferredPosition
            preferredPosition={preferred_position}
            setPreferredPosition={(val) =>
              updateConfig("preferred_position", val)
            }
            enablePositionsByRace={enable_positions_by_race}
            positionSelectionEnabled={position_selection_enabled}
          />
        </div>
        <div className="flex flex-col gap-6">
          <IsPositionByRace
            enablePositionsByRace={enable_positions_by_race}
            setPositionByRace={(val) =>
              updateConfig("enable_positions_by_race", val)
            }
            positionSelectionEnabled={position_selection_enabled}
          />
          <PositionByRace
            positionByRace={positions_by_race}
            setPositionByRace={(key, val) =>
              updateConfig("positions_by_race", {
                ...positions_by_race,
                [key]: val,
              })
            }
            enablePositionsByRace={enable_positions_by_race}
            positionSelectionEnabled={position_selection_enabled}
          />
        </div>
        <label htmlFor="">
          <span>surface</span>
          <Select
            value={surface}
            onValueChange={(val) =>
              updateConfig("minimum_aptitudes", {
                ...config.minimum_aptitudes,
                surface: val,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="surface" />
            </SelectTrigger>
            <SelectContent>
              {RANK.map((r) => (
                <SelectItem key={r} value={r}>
                  {r.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <label htmlFor="">
          <span>distance</span>
          <Select
            value={distance}
            onValueChange={(val) =>
              updateConfig("minimum_aptitudes", {
                ...config.minimum_aptitudes,
                distance: val,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="distance" />
            </SelectTrigger>
            <SelectContent>
              {RANK.map((r) => (
                <SelectItem key={r} value={r}>
                  {r.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <label htmlFor="">
          <span>style</span>
          <Select
            value={style}
            onValueChange={(val) =>
              updateConfig("minimum_aptitudes", {
                ...config.minimum_aptitudes,
                style: val,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="style" />
            </SelectTrigger>
            <SelectContent>
              {RANK.map((r) => (
                <SelectItem key={r} value={r}>
                  {r.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
      </div>
    </div>
  );
}

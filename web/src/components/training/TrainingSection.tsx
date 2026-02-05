import { Dumbbell } from "lucide-react";
import type { Config, UpdateConfigType } from "@/types";
import { Input } from "../ui/input";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent, } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, } from "@dnd-kit/sortable";
import Sortable from "../Sortable";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { PRIORITY_WEIGHT } from "@/constants";
import Tooltips from "../_c/Tooltips";
import { Checkbox } from "../ui/checkbox";

type Props = {
  config: Config;
  updateConfig: UpdateConfigType;
};

export default function TrainingSection({ config, updateConfig }: Props) {
  const {
    priority_stat,
    priority_weight,
    priority_weights,
    stat_caps,
    hint_hunting_enabled,
    hint_hunting_weights,
    wit_training_score_ratio_threshold,
    rainbow_support_weight_addition,
    non_max_support_weight,
    scenario_gimmick_weight,
  } = config;

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = priority_stat.indexOf(active.id as string);
      const newIndex = priority_stat.indexOf(over?.id as string);
      updateConfig("priority_stat", arrayMove(priority_stat, oldIndex, newIndex));
    }
  };

  return (
    <div className="section-card">
      <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
        <Dumbbell className="text-primary" />
        Training
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 mb-2">
            <div className="flex flex-col gap-2 w-fit">
              <p className="font-semibold">Priority Stat</p>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={priority_stat}
                  strategy={verticalListSortingStrategy}
                >
                  <ul className="flex flex-col gap-2 w-fit">
                    {priority_stat.map((s) => (
                      <Sortable key={s} id={s} />
                    ))}
                  </ul>
                </SortableContext>
              </DndContext>
            </div>
            <div className="flex flex-col gap-2 w-fit">
              <p className="font-semibold">Priority Multiplier</p>
              {Array.from({ length: 5 }, (_, i) => (
                <Input
                  className="w-20"
                  type="number"
                  key={i}
                  step={0.05}
                  value={priority_weights[i]}
                  onChange={(e) => {
                    const newWeights = [...priority_weights];
                    newWeights[i] = e.target.valueAsNumber;
                    updateConfig("priority_weights", newWeights);
                  }}
                />
              ))}

            </div>
          </div>
          <div className="w-fit">
            <label htmlFor="priority-weight" className="flex flex-col gap-2">
              <span className="font-semibold">Priority Weight Level:</span>
              <RadioGroup
                value={priority_weight}
                onValueChange={(val) => updateConfig("priority_weight", val)}
              >
                {Object.entries(PRIORITY_WEIGHT).map(([weight, description]) => (
                  <div key={weight} className="flex items-center gap-2">
                    <RadioGroupItem value={weight} id={weight} />
                    <label htmlFor={weight} className="cursor-pointer capitalize">
                      {weight}
                    </label>
                    <Tooltips>{description}</Tooltips>
                  </div>
                ))}
              </RadioGroup>
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-2">

          <div className="flex items-center gap-2">
            <label className="uma-label">
              <Checkbox checked={hint_hunting_enabled} onCheckedChange={() => updateConfig("hint_hunting_enabled", !hint_hunting_enabled)} />
              Enable Hint Hunting
            </label>
          </div>

          <div className="flex flex-col gap-2 mb-2">
            <p className={`font-semibold ${hint_hunting_enabled ? "" : "disabled"}`}>Hint Weights</p>
            {Object.entries(hint_hunting_weights).map(([stat, val]) => (
              <label className={`uma-label ${hint_hunting_enabled ? "" : "disabled"}`}>
                <span className="inline-block w-16">{stat.toUpperCase()}</span>
                <Input
                  className="w-24"
                  type="number"
                  value={val}
                  min={0}
                  step={0.1}
                  onChange={(e) => updateConfig("hint_hunting_weights", { ...hint_hunting_weights, [stat]: isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber, })}
                />
              </label>
            ))}
          </div>

          <label className="uma-label">
            Wit Training Treshold
            <Input
              className="w-20"
              type="number"
              min={0}
              step={0.05}
              value={wit_training_score_ratio_threshold}
              onChange={(e) =>
                updateConfig(
                  "wit_training_score_ratio_threshold",
                  e.target.valueAsNumber
                )
              }
            />
          </label>
          <label className="uma-label">
            Rainbow Weight Addition
            <Input
              className="w-20"
              type="number"
              min={0}
              step={0.05}
              value={rainbow_support_weight_addition}
              onChange={(e) =>
                updateConfig(
                  "rainbow_support_weight_addition",
                  e.target.valueAsNumber
                )
              }
            />
          </label>
          <label className="uma-label">
            Non-Max Support Weight
            <Input
              className="w-20"
              type="number"
              min={0}
              step={0.05}
              value={non_max_support_weight}
              onChange={(e) =>
                updateConfig("non_max_support_weight", e.target.valueAsNumber)
              }
            />
          </label>
          <label className="uma-label">
            Scenario Gimmick Weight
            <Input
              className="w-20"
              type="number"
              min={0}
              step={0.05}
              value={scenario_gimmick_weight}
              onChange={(e) =>
                updateConfig("scenario_gimmick_weight", e.target.valueAsNumber)
              }
            />
          </label>


        </div>
        <div className="flex flex-col gap-2">

          <div className="flex flex-col gap-2 w-fit">
            <p className="font-semibold">Stat Caps</p>
            <div className="flex flex-col gap-2">
              {Object.entries(stat_caps).map(([stat, val]) => (
                <label key={stat} className="uma-label">
                  <span className="inline-block w-16">{stat.toUpperCase()}</span>
                  <Input
                    className="w-24"
                    type="number"
                    value={val}
                    min={0}
                    onChange={(e) =>
                      updateConfig("stat_caps", { ...stat_caps, [stat]: isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber, })}
                  />
                </label>
              ))}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}

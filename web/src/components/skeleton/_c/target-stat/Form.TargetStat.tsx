import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHandleValueChange } from "@/hooks/training-strategy/useHandleValueChange";
import { useModifyTrainingStrategy } from "@/hooks/training-strategy/useModifyTrainingStrategy";
import type { Config, UpdateConfigType } from "@/types";
import { useState } from "react";

type Props = {
  config: Config;
  updateConfig: UpdateConfigType;
};

export default function FormTargetStat({ config, updateConfig }: Props) {
  const [value, setValue] = useState({
    spd: 0,
    sta: 0,
    pwr: 0,
    guts: 0,
    wit: 0,
  });
  const [name, setName] = useState("");

  const handleValueChange = useHandleValueChange(setValue);

  const modify = useModifyTrainingStrategy(
    config,
    updateConfig,
    "target_stat_sets"
  );

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        modify(name, value);
      }}
    >
      <label htmlFor="set_name" className="flex gap-4 items-center">
        <span className="w-52">Set Name:</span>
        <Input
          id="set_name"
          type="text"
          placeholder="target_stat_set_name"
          required
          onChange={(e) => {
            const val = e.target.value.trim().replaceAll(" ", "_");
            setName(val);
          }}
        />
      </label>
      <label htmlFor="spd" className="flex gap-4 items-center">
        <span className="w-52">Speed:</span>
        <Input
          id="spd"
          type="number"
          required
          min={0}
          onChange={(e) => handleValueChange("spd", e.target.valueAsNumber)}
        />
      </label>
      <label htmlFor="sta" className="flex gap-4 items-center">
        <span className="w-52">Stamina:</span>
        <Input
          id="sta"
          type="number"
          required
          min={0}
          onChange={(e) => handleValueChange("sta", e.target.valueAsNumber)}
        />
      </label>
      <label htmlFor="pwr" className="flex gap-4 items-center">
        <span className="w-52">Power:</span>
        <Input
          id="pwr"
          type="number"
          required
          min={0}
          onChange={(e) => handleValueChange("pwr", e.target.valueAsNumber)}
        />
      </label>
      <label htmlFor="guts" className="flex gap-4 items-center">
        <span className="w-52">Guts:</span>
        <Input
          id="guts"
          type="number"
          required
          min={0}
          onChange={(e) => handleValueChange("guts", e.target.valueAsNumber)}
        />
      </label>
      <label htmlFor="wit" className="flex gap-4 items-center">
        <span className="w-52">Wit:</span>
        <Input
          id="wit"
          type="number"
          required
          min={0}
          onChange={(e) => handleValueChange("wit", e.target.valueAsNumber)}
        />
      </label>
      <Button type="submit">Save set</Button>
    </form>
  );
}

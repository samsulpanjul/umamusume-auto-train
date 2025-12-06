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

export default function FormRiskTaking({ config, updateConfig }: Props) {
  const [value, setValue] = useState({
    rainbow_increase: 0,
    normal_increase: 0,
  });
  const [name, setName] = useState("");

  const handleValueChange = useHandleValueChange(setValue);

  const modify = useModifyTrainingStrategy(
    config,
    updateConfig,
    "risk_taking_sets"
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
          placeholder="risk_taking_set_name"
          required
          onChange={(e) => {
            const val = e.target.value.trim().replaceAll(" ", "_");
            setName(val);
          }}
        />
      </label>
      <label htmlFor="rainbow-increase" className="flex gap-4 items-center">
        <span className="w-52">Rainbow increase:</span>
        <Input
          id="rainbow-increase"
          type="number"
          required
          min={0}
          onChange={(e) =>
            handleValueChange("rainbow_increase", e.target.valueAsNumber)
          }
        />
      </label>
      <label htmlFor="rainbow-increase" className="flex gap-4 items-center">
        <span className="w-52">Normal increase:</span>
        <Input
          id="rainbow-increase"
          type="number"
          required
          min={0}
          onChange={(e) =>
            handleValueChange("normal_increase", e.target.valueAsNumber)
          }
        />
      </label>
      <Button type="submit">Save set</Button>
    </form>
  );
}

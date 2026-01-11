import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHandleValueChange } from "@/hooks/training-strategy/useHandleValueChange";
import { useModifyTrainingStrategy } from "@/hooks/training-strategy/useModifyTrainingStrategy";
import type { Config, UpdateConfigType } from "@/types";
import { useState } from "react";

type Props = {
  config: Config;
  updateConfig: UpdateConfigType;
};

const TRAINING_FUNCTION_LIST = [
  "rainbow_training",
  "max_out_friendships",
  "most_support_cards",
  "most_stat_gain",
  "meta_training",
];

export default function FormTemplate({ config, updateConfig }: Props) {
  const [value, setValue] = useState({
    training_function: "",
    action_sequence_set: "",
    risk_taking_set: "",
    stat_weight_set: "",
    target_stat_set: "",
  });
  const [name, setName] = useState("");

  const {
    training_strategy: {
      action_sequence_sets,
      target_stat_sets,
      stat_weight_sets,
      risk_taking_sets,
    },
  } = config;
  const actionSequence = Object.keys(action_sequence_sets);
  const targetStat = Object.keys(target_stat_sets);
  const statWeight = Object.keys(stat_weight_sets);
  const riskTaking = Object.keys(risk_taking_sets);

  const handleValueChange = useHandleValueChange(setValue);
  const modify = useModifyTrainingStrategy(config, updateConfig, "templates");

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        modify(name, value);
      }}
    >
      <label htmlFor="name" className="flex gap-4 items-center">
        <span className="w-52">Name:</span>
        <Input
          id="set_name"
          type="text"
          placeholder="template_name"
          required
          onChange={(e) => {
            const val = e.target.value.trim().replaceAll(" ", "_");
            setName(val);
          }}
        />
      </label>
      <label className="flex gap-4 items-center">
        <span className="w-52">Training Function:</span>
        <Select
          onValueChange={(val) => handleValueChange("training_function", val)}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="training_function_name" />
          </SelectTrigger>
          <SelectContent>
            {TRAINING_FUNCTION_LIST.map((name) => {
              return (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </label>
      <label className="flex gap-4 items-center">
        <span className="w-52">Action Sequence:</span>
        <Select
          onValueChange={(val) => handleValueChange("action_sequence_set", val)}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="action_sequence_set_name" />
          </SelectTrigger>
          <SelectContent>
            {actionSequence.length === 0 ? (
              <SelectItem disabled value="no">
                No risk taking set.
              </SelectItem>
            ) : (
              actionSequence.map((name) => {
                return (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                );
              })
            )}
          </SelectContent>
        </Select>
      </label>
      <label className="flex gap-4 items-center">
        <span className="w-52">Risk Taking:</span>
        <Select
          onValueChange={(val) => handleValueChange("risk_taking_set", val)}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="risk_taking_set_name" />
          </SelectTrigger>
          <SelectContent>
            {riskTaking.length === 0 ? (
              <SelectItem disabled value="no">
                No risk taking set.
              </SelectItem>
            ) : (
              riskTaking.map((name) => {
                return (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                );
              })
            )}
          </SelectContent>
        </Select>
      </label>

      <label className="flex gap-4 items-center">
        <span className="w-52">Stat Weight:</span>
        <Select
          onValueChange={(val) => handleValueChange("stat_weight_set", val)}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="stat_weight_set_name" />
          </SelectTrigger>
          <SelectContent>
            {statWeight.length === 0 ? (
              <SelectItem disabled value="no">
                No stat weight set.
              </SelectItem>
            ) : (
              statWeight.map((name) => {
                return (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                );
              })
            )}
          </SelectContent>
        </Select>
      </label>
      <label className="flex gap-4 items-center">
        <span className="w-52">Target Stat:</span>
        <Select
          onValueChange={(val) => handleValueChange("target_stat_set", val)}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="target_stat_set_name" />
          </SelectTrigger>
          <SelectContent>
            {targetStat.length === 0 ? (
              <SelectItem disabled value="no">
                No target stat set.
              </SelectItem>
            ) : (
              targetStat.map((name) => {
                return (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                );
              })
            )}
          </SelectContent>
        </Select>
      </label>
      <Button type="submit">Save template</Button>
    </form>
  );
}

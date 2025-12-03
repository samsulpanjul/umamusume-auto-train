import type { Config, UpdateConfigType } from "@/types";
import EnergyInput from "./EnergyInput";

type Props = {
  config: Config;
  updateConfig: UpdateConfigType;
};

export default function EnergySection({ config, updateConfig }: Props) {
  const {
    skip_training_energy,
    never_rest_energy,
    skip_infirmary_unless_missing_energy,
  } = config;

  return (
    <div className="flex flex-col gap-6">
      <EnergyInput
        name="skip-training-energy"
        value={skip_training_energy}
        setValue={(val) => updateConfig("skip_training_energy", val)}
      >
        Skip Training Energy
      </EnergyInput>
      <EnergyInput
        name="never-rest-energy"
        value={never_rest_energy}
        setValue={(val) => updateConfig("never_rest_energy", val)}
      >
        Never Rest Energy
      </EnergyInput>
      <EnergyInput
        name="skip-infirmary-unless_missing-energy"
        value={skip_infirmary_unless_missing_energy}
        setValue={(val) =>
          updateConfig("skip_infirmary_unless_missing_energy", val)
        }
      >
        Skip Infirmary
      </EnergyInput>
    </div>
  );
}

import FunctionModScoreSelectorCard from "./FunctionModScoreSelectorCard"
import { gameState, minScoreStates } from "@/globals/gameState"
import type { StatGains } from "@/globals/gameState"
import { useState, useCallback, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";


type Props = {
  functionText: string
  functionType: string
  onUpdate: () => void
}

function buildSlots(functionKey: keyof typeof minScoreStates) {
  const slots: string[] = []
  const supports = minScoreStates[functionKey].supports

  for (let i = 0; i < 6; i++) {
    const support = supports.find(s => s.card_index === i)
    slots.push(support ? support.type : "")
  }

  return slots
}

const TRAINING_OPTIONS = [
  { label: "Speed",   value: "spd" },
  { label: "Stamina", value: "sta" },
  { label: "Power",   value: "pwr" },
  { label: "Guts",    value: "guts" },
  { label: "Wit",     value: "wit" },
] as const;

export default function FunctionMinScoreSelector({ functionText, functionType, onUpdate }: Props) {
  const functionKey = functionType as keyof typeof minScoreStates
  const slots = buildSlots(functionKey)

  const [minScoreDisplay, setMinScoreDisplay] = useState<number | null>(null)
  const [selectedTraining, setSelectedTraining] = useState<string>(
    minScoreStates[functionKey].training_type ?? TRAINING_OPTIONS[0].value
  );

  const calcMinimumScoreState = useCallback(async () => {
    const response = await fetch(`/calc_min_score_state/${functionKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({minScoreStates, gameState})
    })

    const results = await response.json()
    const minScore = results?.[functionKey]?.options?.min_scores?.[functionKey]?.[0]
    setMinScoreDisplay(minScore)
  }, [functionKey])

  const handleStatChange = useCallback(
    (
      functionKey: keyof typeof minScoreStates,
      key: "spd" | "sta" | "pwr" | "guts" | "wit" | "sp",
      value: string
    ) => {
      const num = value === "" ? 0 : parseInt(value, 10)
      if (isNaN(num)) return

      minScoreStates[functionKey].stat_gains[key] = num

      if (functionKey === "meta_training" || functionKey === "most_stat_gain") {
        calcMinimumScoreState()
      }
      onUpdate()
    },
    [calcMinimumScoreState, onUpdate]
  )

  useEffect(() => {
    calcMinimumScoreState()
  }, [calcMinimumScoreState])

  return (
    <>
      <span className="text-sm">Minimum score with the displayed training for <strong>{functionText}</strong> is <strong>{Number(minScoreDisplay).toFixed(2)}</strong></span>
      <div className="rounded-sm bg-card/50 mb-3">
        <Select
          value={selectedTraining}
          onValueChange={(val) => {
            setSelectedTraining(val);
            minScoreStates[functionKey].training_type = val;
            calcMinimumScoreState();
            onUpdate();
          }}
        >
          <SelectTrigger id="minScorefunctionType">
            <SelectValue placeholder="Select training…" />
          </SelectTrigger>
          <SelectContent>
            {TRAINING_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-3 px-3 pt-3 pb-3">
          {slots.map((type, i) => (
            <FunctionModScoreSelectorCard
              key={i}
              trainingText={functionType}
              cardIndex={i}
              initialType={type}
              onChange={() => {
                calcMinimumScoreState()
                onUpdate()
              }}
            />
          ))}
        </div>

        <div className="flex gap-3 px-3 pb-3">
          {[
            { label: "Speed", key: "spd" },
            { label: "Stamina", key: "sta" },
            { label: "Power", key: "pwr" },
            { label: "Guts", key: "guts" },
            { label: "Wit", key: "wit" },
            { label: "Skill", key: "sp" },
          ].map(({ label, key }) => (
            <div key={key} className="flex flex-1 flex-col">
              <span className="text-xs text-muted-foreground font-semibold">{label}</span>
              <input
                type="number"
                step="1"
                defaultValue={minScoreStates[functionKey].stat_gains[key as keyof StatGains] ?? 0}
                onInput={(e) =>
                  handleStatChange(
                    functionKey,
                    key as "spd" | "sta" | "pwr" | "guts" | "wit" | "sp",
                    (e.target as HTMLInputElement).value
                  )
                }
                className="w-full border rounded pl-1.5 text-xs bg-background outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
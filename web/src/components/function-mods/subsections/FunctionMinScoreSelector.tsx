import FunctionModScoreSelectorCard from "./FunctionModScoreSelectorCard"
import { gameState, minScoreStates } from "@/globals/gameState"
import { useState, useCallback, useEffect } from "react"

type Props = {
  trainingText: string
  trainingType: string
}

function buildSlots(trainingKey: keyof typeof minScoreStates) {
  const slots: string[] = []
  const supports = minScoreStates[trainingKey].supports

  for (let i = 0; i < 6; i++) {
    const support = supports.find(s => s.card_index === i)
    slots.push(support ? support.type : "")
  }

  return slots
}

export default function FunctionMinScoreSelector({ trainingText, trainingType }: Props) {
  const trainingKey = trainingType as keyof typeof minScoreStates
  const slots = buildSlots(trainingKey)
  const stats = minScoreStates[trainingKey].stat_gains

  const [minScoreDisplay, setMinScoreDisplay] = useState<any>(null)

  const calcMinimumScoreState = async () => {
    const response = await fetch(`/calc_min_score_state/${trainingKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({minScoreStates, gameState})
    })

    const results = await response.json()
    const minScore = results?.[trainingKey]?.options?.min_scores?.[trainingKey]?.[0]
    setMinScoreDisplay(minScore)
  }

  const handleStatChange = useCallback(
    (
      trainingKey: keyof typeof minScoreStates,
      key: "spd" | "sta" | "pwr" | "guts" | "wit" | "sp",
      value: string
    ) => {
      const num = value === "" ? 0 : parseInt(value, 10)
      if (isNaN(num)) return

      minScoreStates[trainingKey].stat_gains[key] = num

      if (trainingKey === "meta_training" || trainingKey === "most_stat_gain") {
        calcMinimumScoreState()
      }
    },
    [calcMinimumScoreState]
  )

  useEffect(() => {
    calcMinimumScoreState()
  }, [calcMinimumScoreState])

  return (
    <>
      Minimum score with the displayed training for <strong>{trainingText}</strong> is <strong>{Number(minScoreDisplay).toFixed(2)}</strong>
      <div className="border rounded-sm bg-card/50 mb-3">
        <div className="flex gap-3 px-3 pt-3 pb-3">
          {slots.map((type, i) => (
            <FunctionModScoreSelectorCard
              key={i}
              trainingText={trainingType}
              cardIndex={i}
              initialType={type}
              onChange={calcMinimumScoreState}
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
                defaultValue={stats[key as keyof typeof stats] ?? 0}
                onInput={(e) =>
                  handleStatChange(
                    trainingKey,
                    key as any,
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
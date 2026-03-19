import FunctionModUmaCard from "./FunctionModUmaCard"
import { gameState } from "@/globals/gameState"

type Props = {
  trainingText: string
  trainingType: string
}

function buildSlots(trainingKey: keyof typeof gameState) {
  const slots: string[] = []
  const supports = gameState[trainingKey].supports

  for (let i = 0; i < 6; i++) {
    const support = supports.find(s => s.card_index === i)
    slots.push(support ? support.type : "")
  }

  return slots
}

function handleStatChange(
  trainingKey: keyof typeof gameState,
  key: "spd" | "sta" | "pwr" | "guts" | "wit" | "sp",
  value: string
) {
  const num = value === "" ? 0 : parseInt(value, 10)
  if (isNaN(num)) return

  gameState[trainingKey].stat_gains[key] = num
}

export default function FunctionUmaSelector({ trainingText, trainingType }: Props) {
  const trainingKey = trainingType as keyof typeof gameState
  const slots = buildSlots(trainingKey)
  const stats = gameState[trainingKey].stat_gains

  return (
    <>
      {trainingText}

      <div className="text-3xl flex-1 mb-2 border">
        <div className="flex">
          {slots.map((type, i) => (
            <FunctionModUmaCard
              key={i}
              trainingText={trainingType}
              cardIndex={i}
              initialType={type}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2 mb-2">
        {[
          { label: "Speed", key: "spd" },
          { label: "Stamina", key: "sta" },
          { label: "Power", key: "pwr" },
          { label: "Guts", key: "guts" },
          { label: "Wit", key: "wit" },
          { label: "Skill", key: "sp" },
        ].map(({ label, key }) => (
          <div key={key} className="flex flex-col">
            <span className="text-xs">{label}</span>
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
              className="w-20 border px-1"
            />
          </div>
        ))}
      </div>

    </>
  )
}
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
      <div className="border rounded-sm bg-card/50 pb-1 mb-3">
        <div className="flex mb-2">
          {slots.map((type, i) => (
            <FunctionModUmaCard
              key={i}
              trainingText={trainingType}
              cardIndex={i}
              initialType={type}
            />
          ))}
        </div>

        <div className="flex gap-3 px-1">
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
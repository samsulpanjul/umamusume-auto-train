import FunctionModUmaCard from "./FunctionModUmaCard"
import { gameState } from "@/globals/gameState"

type Props = {
  trainingText: string;
  trainingType: string;
};

function buildSlots(trainingKey: keyof typeof gameState) {
  const types = ["spd","sta","pwr","guts","wit","pal","npc"] as const
  const slots: string[] = []

  for (const t of types) {
    const count = gameState[trainingKey][t].supports
    for (let i = 0; i < count; i++) {
      slots.push(t)
    }
  }

  while (slots.length < 6) {
    slots.push("")
  }

  return slots
}

export default function FunctionUmaSelector({ trainingText, trainingType }: Props) {
  const slots =  buildSlots(trainingType as keyof typeof gameState)
  return (
          <>
            {trainingText}
            <div className="text-3xl flex-1 mb-6 border">
              <div className="flex">
                {slots.map((type, i) => (
                  <FunctionModUmaCard
                    key={i}
                    trainingText={trainingType}
                    initialType={type}
                  />
                ))}
              </div>
            </div>
          </>
  );
}

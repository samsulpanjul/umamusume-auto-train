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

export default function FunctionUmaSelector({ trainingText, trainingType }: Props) {

  const trainingKey = trainingType as keyof typeof gameState
  const slots = buildSlots(trainingKey)

  return (
    <>
      {trainingText}

      <div className="text-3xl flex-1 mb-6 border">
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
    </>
  )
}
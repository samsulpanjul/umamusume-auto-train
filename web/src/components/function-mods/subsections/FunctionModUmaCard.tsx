import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { gameState, createSupportState } from "@/globals/gameState"
import type { SupportSlotType } from "@/globals/gameState"

type Props = {
  trainingText: string
  cardIndex: number
  initialType: string
}

export default function FunctionModUmaCard({ trainingText, cardIndex, initialType }: Props) {

  const trainingKey = trainingText as keyof typeof gameState
  const supports = gameState[trainingKey].supports

  const types: SupportSlotType[] = ["spd","sta","pwr","guts","wit","pal","npc"]

  const existing = supports.find(s => s.card_index === cardIndex)

  if (!existing) {
    supports.push(
      createSupportState(cardIndex, initialType as SupportSlotType)
    )
  }

  const support = supports.find(s => s.card_index === cardIndex)!

  const [open, setOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<string | null>(
    support.type || null
  )

  const handleSelect = (type: SupportSlotType) => {
    support.type = type

    setSelectedType(type)
    setOpen(false)

    console.log(gameState)
  }

  return (
    <div style={{ aspectRatio: "1 / 1", width: "100%" }} className="p-5 relative">
      <Button
        style={{ width:"100%", height:"100%", borderRadius:"50%" }}
        variant="outline"
        onClick={() => setOpen(!open)}
      >
        {selectedType ? (
          <img
            src={new URL(
              `../../../assets/support_card_type_${selectedType}.png`,
              import.meta.url
            ).href}
            alt={selectedType}
            width={24}
            height={24}
            style={{ display:"block", objectFit:"contain" }}
          />
        ) : (
          <Plus />
        )}
      </Button>

      {open && (
        <div
          className="absolute bg-white border rounded shadow-md"
          style={{
            top:"50%",
            left:"50%",
            transform:"translate(-50%, -50%)",
            zIndex:50,
          }}
        >
          {types.map((type) => (
            <div
              key={type}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(type)}
            >
              {type}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

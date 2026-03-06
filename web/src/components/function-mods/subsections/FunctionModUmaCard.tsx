import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { gameState } from "@/globals/gameState"
import type { SupportType } from "@/globals/gameState"

type Props = {
  trainingText: string
}

export default function FunctionModUmaCard({ trainingText }: Props) {
  const [open, setOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  let trainingTextKey = trainingText as keyof typeof gameState

  const types = ["spd", "sta", "pwr", "guts", "wit", "pal", "npc"]

  const handleSelect = (type: string) => {
    let typeKey = type as keyof typeof gameState[keyof typeof gameState]
    console.log(type)
    if (selectedType && (selectedType !== "npc" && selectedType !== "")) {
      let selectedTypeKey = selectedType as keyof typeof gameState[keyof typeof gameState]
      (gameState[trainingTextKey][selectedTypeKey] as SupportType).supports -= 1
    }

    setSelectedType(type)

    if (type !== "npc") {
      (gameState[trainingTextKey][typeKey] as SupportType).supports += 1
    }

    setOpen(false)
    console.log(gameState)
  }

  return (
    <div
      style={{ aspectRatio: "1 / 1", width: "100%" }}
      className="p-5 relative"
    >
      <Button
        style={{ width: "100%", height: "100%", borderRadius: "50%" }}
        variant="outline"
        onClick={() => setOpen(!open)}
      >
        {selectedType ? (
          <img
            src={new URL(
              `../../../assets/support_card_type_${selectedType}.png`,
              import.meta.url
            ).href}  alt={selectedType}
            width={24}
            height={24}
            style={{
              display: "block",
              objectFit: "contain"
            }}
          />
        ) : (
          <Plus />
        )}
      </Button>

      {open && (
        <div
          className="absolute bg-white border rounded shadow-md"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 50,
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
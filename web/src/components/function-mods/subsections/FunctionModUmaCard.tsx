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
  const [menus, setMenus] = useState({
    topLeft: false,
    topRight: false,
    bottomLeft: false,
    bottomRight: false,
    bottom: false
  })

  const toggleMenu = (key: keyof typeof menus) => {
    setMenus(prev => ({ ...prev, [key]: !prev[key] }))
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
    <div className="p-5 relative aspect-square w-full">
      <Button
        className="w-full h-full rounded-full"
        variant="outline"
        onClick={() => setOpen(!open)}
      >
        {selectedType ? (
          <div>
            <img
              src={new URL(
                `../../../assets/supports/${selectedType}.png`,
                import.meta.url
              ).href}
              alt={selectedType}
              width={24}
              height={24}
              className="block object-contain"
            />
            {/* Top Left */}
            <div className="absolute top-0 left-0 w-[15%] h-[15%]">
              <Button className="w-full h-full" onClick={() => toggleMenu("topLeft")} />
              {menus.topLeft && (
                <div className="absolute bg-white border shadow-md z-50">
                  menu
                </div>
              )}
            </div>

            {/* Top Right */}
            <div className="absolute top-0 right-0 w-[15%] h-[15%]">
              <Button className="w-full h-full" onClick={() => toggleMenu("topRight")} />
              {menus.topRight && (
                <div className="absolute bg-white border shadow-md z-50">
                  menu
                </div>
              )}
            </div>

            {/* Bottom Left */}
            <div className="absolute bottom-0 left-0 w-[15%] h-[15%]">
              <Button className="w-full h-full" onClick={() => toggleMenu("bottomLeft")} />
              {menus.bottomLeft && (
                <div className="absolute bg-white border shadow-md z-50">
                  menu
                </div>
              )}
            </div>

            {/* Bottom Right */}
            <div className="absolute bottom-0 right-0 w-[15%] h-[15%]">
              <Button className="w-full h-full" onClick={() => toggleMenu("bottomRight")} />
              {menus.bottomRight && (
                <div className="absolute bg-white border shadow-md z-50">
                  menu
                </div>
              )}
            </div>

            {/* Bottom Bar */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[5%]"
            >
              <Button className="w-full h-full" onClick={() => toggleMenu("bottom")} />
              {menus.bottom && (
                <div className="absolute bg-white border shadow-md z-50">
                  menu
                </div>
              )}
            </div>
          </div>
        ) : (
          <Plus />
        )}
      </Button>

      {open && (
        <div
          className="absolute bg-white border rounded shadow-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
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

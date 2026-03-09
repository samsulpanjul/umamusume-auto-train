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
    <div style={{ aspectRatio: "1 / 1", width: "100%" }} className="p-5 relative">
      <Button
        style={{ width:"100%", height:"100%", borderRadius:"50%" }}
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
              style={{ display:"block", objectFit:"contain" }}
            />
            {/* Top Left */}
            <div style={{ position:"absolute", top:"0%", left:"0%", width:"15%", height:"15%" }}>
              <Button style={{ width:"100%", height:"100%" }} onClick={() => toggleMenu("topLeft")} />
              {menus.topLeft && (
                <div className="absolute bg-white border shadow-md z-50">
                  menu
                </div>
              )}
            </div>

            {/* Top Right */}
            <div style={{ position:"absolute", top:"0%", right:"0%", width:"15%", height:"15%" }}>
              <Button style={{ width:"100%", height:"100%" }} onClick={() => toggleMenu("topRight")} />
              {menus.topRight && (
                <div className="absolute bg-white border shadow-md z-50">
                  menu
                </div>
              )}
            </div>

            {/* Bottom Left */}
            <div style={{ position:"absolute", bottom:"0%", left:"0%", width:"15%", height:"15%" }}>
              <Button style={{ width:"100%", height:"100%" }} onClick={() => toggleMenu("bottomLeft")} />
              {menus.bottomLeft && (
                <div className="absolute bg-white border shadow-md z-50">
                  menu
                </div>
              )}
            </div>

            {/* Bottom Right */}
            <div style={{ position:"absolute", bottom:"0%", right:"0%", width:"15%", height:"15%" }}>
              <Button style={{ width:"100%", height:"100%" }} onClick={() => toggleMenu("bottomRight")} />
              {menus.bottomRight && (
                <div className="absolute bg-white border shadow-md z-50">
                  menu
                </div>
              )}
            </div>

            {/* Bottom Bar */}
            <div
              style={{
                position:"absolute",
                bottom:"0%",
                left:"50%",
                transform:"translateX(-50%)",
                width:"50%",
                height:"5%"
              }}
            >
              <Button style={{ width:"100%", height:"100%" }} onClick={() => toggleMenu("bottom")} />
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

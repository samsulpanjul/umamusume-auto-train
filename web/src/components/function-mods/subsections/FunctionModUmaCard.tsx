import { useState, useRef, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { gameState, createSupportState } from "@/globals/gameState"
import type { SupportSlotType, UnityGauge } from "@/globals/gameState"

type Props = {
  trainingText: string
  cardIndex: number
  initialType: string
}

export default function FunctionModUmaCard({ trainingText, cardIndex, initialType }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const trainingKey = trainingText as keyof typeof gameState
  const supports = gameState[trainingKey].supports

  const types: SupportSlotType[] = ["spd","sta","pwr","guts","wit","pal","npc"]
  const unityGauges: UnityGauge[] = ["", "empty", "full", "exploded"]

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  const [selectedType, setSelectedType] = useState<string | null>(
    support.type || null
  )

  const [selectedUnityGauge, setSelectedUnityGauge] = useState<UnityGauge>(
    support.unity_gauge || ""
  )

  const handleSelect = (type: SupportSlotType) => {
    support.type = type

    setSelectedType(type)
    setOpen(false)

    console.log(gameState)
  }

  const handleUnityGaugeSelect = (gauge: UnityGauge) => {
    support.unity_gauge = gauge
    setSelectedUnityGauge(gauge)
    setMenus(prev => ({ ...prev, bottomLeft: false }))
    console.log(gameState)
  }

  return (
    <div className="p-5 relative aspect-square w-full" ref={containerRef}>
      <div className="relative w-full h-full">
        <Button
          className="w-full h-full rounded-full p-0"
          variant="outline"
          onClick={() => setOpen(!open)}
        >
          {selectedType ? (
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
          ) : (
            <Plus />
          )}
        </Button>

        {selectedType && (
          <>
            {/* Top Left */}
            <div className="absolute -top-3 -left-3 w-6 h-6">
              <Button
                variant="outline"
                className="w-full h-full p-0 rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleMenu("topLeft")
                }}
              />
              {menus.topLeft && (
                <div className="absolute bg-white border rounded shadow-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-6 z-50">
                  <div className="px-4 py-1 text-base hover:bg-gray-100 cursor-pointer"> menu </div>
                </div>
              )}
            </div>

            {/* Top Right */}
            <div className="absolute -top-3 -right-3 w-6 h-6">
              <Button
                variant="outline"
                className="w-full h-full p-0 rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleMenu("topRight")
                }}
              />
              {menus.topRight && (
                <div className="absolute bg-white border rounded shadow-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-6 z-50">
                  <div className="px-4 py-1 text-base hover:bg-gray-100 cursor-pointer"> menu </div>
                </div>
              )}
            </div>

            {/* Bottom Left */}
            <div className="absolute -bottom-3 -left-3 w-6 h-6">
              <Button
                variant="outline"
                className="w-full h-full p-0 rounded-full flex items-center justify-center overflow-hidden bg-white"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleMenu("bottomLeft")
                }}
              >
                {selectedUnityGauge ? (
                  <img
                    src={new URL(
                      `../../../assets/unity_${selectedUnityGauge}.png`,
                      import.meta.url
                    ).href}
                    alt={selectedUnityGauge}
                    className="w-full h-full object-contain"
                  />
                ) : null}
              </Button>
              {menus.bottomLeft && (
                <div className="absolute bg-white border rounded shadow-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-6 z-50 min-w-24">
                  {unityGauges.map((gauge) => (
                    <div
                      key={gauge}
                      className="px-4 py-1 text-base hover:bg-gray-100 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleUnityGaugeSelect(gauge)
                      }}
                    >
                      {gauge || "none"}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Right */}
            {/*
            <div className="absolute -bottom-3 -right-3 w-6 h-6">
              <Button
                variant="outline"
                className="w-full h-full p-0 rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleMenu("bottomRight")
                }}
              />
              {menus.bottomRight && (
                <div className="absolute bg-white border rounded shadow-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-6 z-50">
                  <div className="px-4 py-1 text-base hover:bg-gray-100 cursor-pointer"> menu </div>
                </div>
              )}
            </div>
            */}

            {/* Bottom Bar */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[5%]">
              <Button
                variant="outline"
                className="w-full h-full p-0 rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleMenu("bottom")
                }}
              />
              {menus.bottom && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-white border shadow-md z-50 p-2 min-w-20">
                  menu
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {open && (
        <div
          className="absolute bg-white border rounded shadow-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-6 z-50"
        >
          {types.map((type) => (
            <div
              key={type}
              className="px-4 py-1 text-base hover:bg-gray-100 cursor-pointer"
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

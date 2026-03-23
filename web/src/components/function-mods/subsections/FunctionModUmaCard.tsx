import { useState, useRef, useEffect } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { gameState, createSupportState } from "@/globals/gameState"
import type { SupportTypes, BottomLeftOptions, TopRightOptions, FriendshipLevels } from "@/globals/gameState"
import { SUPPORT_TYPES, BOTTOM_LEFT_OPTIONS, TOP_RIGHT_OPTIONS, FRIENDSHIP_LEVELS } from "@/globals/gameState"

type Props = {
  trainingText: string
  cardIndex: number
  initialType: string
}

export default function FunctionModUmaCard({ trainingText, cardIndex, initialType }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const trainingKey = trainingText as keyof typeof gameState
  const supports = gameState[trainingKey].supports

  console.log("GameState FunctionModUmaCard:", gameState, trainingText, cardIndex, initialType)
  const existing = supports.find(s => s.card_index === cardIndex)

  if (!existing) {
    supports.push(
      createSupportState(cardIndex, initialType as SupportTypes)
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

  const [selectedType, setSelectedType] = useState<string>(
    support.type || ""
  )

  const [selectedBottomLeftStatus, setSelectedBottomLeftStatus] = useState<string>(
    support.bottom_left || ""
  )

  const [selectedTopRightStatus, setSelectedTopRightStatus] = useState<string>(
    support.top_right || ""
  )

  const [selectedFriendship, setSelectedFriendship] = useState<string>(
    support.friendship || ""
  )

  const [selectedSupport, setselectedSupport] = useState<string>(
    support.card_image || ""
  )

  const [isHovered, setIsHovered] = useState(false)

  const friendshipColors: Record<string, string> = {
    "": "bg-transparent",
    gray: "bg-gray-400",
    blue: "bg-blue-400",
    green: "bg-green-400",
    orange: "bg-orange-400",
    max: "bg-yellow-400",
  }

  const handleMainClick = () => {
    if (selectedSupport) {
      support.card_image = ""
      support.type = ""
      support.bottom_left = ""
      support.top_right = ""
      support.friendship = ""
      setselectedSupport("")
      setSelectedType("")
      setSelectedBottomLeftStatus("")
      setSelectedTopRightStatus("")
      setSelectedFriendship("")
    } else {
      const randomId = Math.floor(Math.random() * (8620 - 8000 + 1)) + 8000
      const randomUrl = `https://kachi-dev.github.io/uma-tools/icons/mob/trained_mob_chr_icon_${randomId}_000001_01.png`
      support.card_image = randomUrl
      setselectedSupport(randomUrl)
    }
    console.log(gameState)
  }

  const handleSelect = (type: SupportTypes) => {
    support.type = type

    setSelectedType(type)
    setOpen(false)

    console.log(gameState)
  }

  const handleBottomLeftStatusSelect = (gauge: BottomLeftOptions) => {
    support.bottom_left = gauge
    setSelectedBottomLeftStatus(gauge)
    setMenus(prev => ({ ...prev, bottomLeft: false }))
    console.log(gameState)
  }

  const handleTopRightStatusSelect = (status: TopRightOptions) => {
    support.top_right = status
    setSelectedTopRightStatus(status)
    setMenus(prev => ({ ...prev, topRight: false }))
    console.log(gameState)
  }

  const handleFriendshipSelect = (level: FriendshipLevels) => {
    support.friendship = level
    setSelectedFriendship(level)
    setMenus(prev => ({ ...prev, bottom: false }))
    console.log(gameState)
  }

  return (
    <div className="p-3.5 relative aspect-square w-full" ref={containerRef}>
      <div className="relative w-full h-full">
        <Button
          className={`w-full h-full rounded-full p-0 relative group ${selectedSupport ? "bg-transparent border-none shadow-none" : ""}`}
          variant="outline"
          onClick={handleMainClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {selectedSupport ? (
            <>
              <img
                src={selectedSupport}
                alt="support"
                className="w-full h-16 -mt-2"
              />
              {isHovered && (
                <div className="absolute rounded-full inset-0 bg-white/70 flex items-center justify-center">
                  <X className="w-8 h-8" />
                </div>
              )}
            </>
          ) : (
            <Plus />
          )}
        </Button>

        {selectedSupport && (
          <>
            {/* Top Left */}
            <div className="absolute -top-3 -left-3 w-6 h-6">
              <Button
                variant="outline"
                className="w-full h-full p-0 rounded-full flex overflow-hidden"
                onClick={(e) => {
                  e.stopPropagation()
                  setOpen(!open)
                }}
              >
                {selectedType ? (
                  <img
                    src={new URL(
                      `../../../assets/icons/${selectedType}.png`,
                      import.meta.url
                    ).href}
                    alt={selectedType}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Plus className="w-3 h-3" />
                )}
              </Button>
              {open && (
                <div className="absolute bg-white border rounded shadow-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-6 z-50 min-w-24">
                  {SUPPORT_TYPES.map((type) => (
                    <div
                      key={type}
                      className="px-4 py-1 text-base hover:bg-gray-100 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelect(type)
                      }}
                    >
                      {type || "none"}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Right */}
            <div className="absolute -top-3 -right-3 w-6 h-6">
              <Button
                variant="outline"
                className="w-full h-full p-0 rounded-full flex"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleMenu("topRight")
                }}
              >
                {selectedTopRightStatus ? (
                  <img
                    src={new URL(
                      `../../../assets/icons/icon_${selectedTopRightStatus}.png`,
                      import.meta.url
                    ).href}
                    alt={selectedTopRightStatus}
                    className="w-full h-full object-contain"
                  />
                ) : null}
              </Button>
              {menus.topRight && (
                <div className="absolute bg-white border rounded shadow-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-6 z-50 min-w-32">
                  {TOP_RIGHT_OPTIONS.map((status) => (
                    <div
                      key={status}
                      className="px-4 py-1 text-base hover:bg-gray-100 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTopRightStatusSelect(status)
                      }}
                    >
                      {status || "none"}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Left */}
            <div className="absolute -bottom-3 -left-3 w-6 h-6">
              <Button
                variant="outline"
                className="w-full h-full p-0 rounded-full flex"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleMenu("bottomLeft")
                }}
              >
                {selectedBottomLeftStatus ? (
                  <img
                    src={new URL(
                      `../../../assets/icons/unity_${selectedBottomLeftStatus}.png`,
                      import.meta.url
                    ).href}
                    alt={selectedBottomLeftStatus}
                    className="w-full h-full object-contain"
                  />
                ) : null}
              </Button>
              {menus.bottomLeft && (
                <div className="absolute bg-white border rounded shadow-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-6 z-50 min-w-24">
                  {BOTTOM_LEFT_OPTIONS.map((gauge) => (
                    <div
                      key={gauge}
                      className="px-4 py-1 text-base hover:bg-gray-100 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleBottomLeftStatusSelect(gauge)
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
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-3 w-12">
              <Button
                variant="outline"
                className={`w-full h-full p-0 rounded-full flex ${friendshipColors[selectedFriendship]}`}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleMenu("bottom")
                }}
              />
              {menus.bottom && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-white border shadow-md z-50 p-2 min-w-24">
                  {FRIENDSHIP_LEVELS.map((level) => (
                    <div
                      key={level}
                      className="px-4 py-1 text-base hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleFriendshipSelect(level)
                      }}
                    >
                      <div className={`w-3 h-3 rounded-full border ${friendshipColors[level]}`} />
                      {level || "none"}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

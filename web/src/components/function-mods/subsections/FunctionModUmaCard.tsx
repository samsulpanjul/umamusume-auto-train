import { useState, useRef, useEffect, useMemo } from "react"
import { Plus, UserPlus, Minus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { gameState, createSupportState } from "@/globals/gameState"
import type { SupportTypes, BottomLeftOptions, TopRightOptions, FriendshipLevels } from "@/globals/gameState"
import { SUPPORT_TYPES, BOTTOM_LEFT_OPTIONS, TOP_RIGHT_OPTIONS, FRIENDSHIP_LEVELS } from "@/globals/gameState"

type Props = {
  trainingText: string
  cardIndex: number
  initialType: string
  onUpdate: () => void
}

export default function FunctionModUmaCard({ trainingText, cardIndex, initialType, onUpdate }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const trainingKey = trainingText as keyof typeof gameState
  const supports = gameState[trainingKey].supports

  const existing = supports.findIndex(s => s.card_index === cardIndex)
  if (existing === -1) {
    supports.push(createSupportState(cardIndex, initialType as SupportTypes))
  }
  
  const support = supports.find(s => s.card_index === cardIndex)!

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

  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
        setMenus({
          topLeft: false,
          topRight: false,
          bottomLeft: false,
          bottomRight: false,
          bottom: false
        })
      }
    }

    const anyOpen = open || Object.values(menus).some(Boolean)
    if (anyOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, menus])

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

  const randomSupportIcon = useMemo(() => {
    const randomId = Math.floor(Math.random() * (8620 - 8000 + 1)) + 8000
    return `https://kachi-dev.github.io/uma-tools/icons/mob/trained_mob_chr_icon_${randomId}_000001_01.png`
  }, [])

  const [isEnabled, setIsEnabled] = useState<boolean>(
    support.enabled
  )

  const [isHovered, setIsHovered] = useState(false)

  const friendshipBars: Record<string, string> = {
    "": "bg-transparent",
    gray: "bg-[linear-gradient(to_right,_#60a5fa_10%,_#9ca3af_10%)]",
    blue: "bg-[linear-gradient(to_right,_#60a5fa_30%,_#9ca3af_30%)]",
    green: "bg-[linear-gradient(to_right,_#4ade80_60%,_#9ca3af_60%)]",
    yellow: "bg-[linear-gradient(to_right,_#facc15_85%,_#9ca3af_85%)]",
    max: "bg-[linear-gradient(to_right,_#fb923c_100%,_#fb923c_100%)]",
  }

  const friendshipColors: Record<string, string> = {
    "": "bg-transparent",
    gray: "bg-gray-400",
    blue: "bg-blue-400",
    green: "bg-green-400",
    yellow: "bg-yellow-400",
    max: "bg-orange-400",
  }

  const handleMainSelect = () => {
    const newState = !isEnabled
    support.enabled = newState
    setIsEnabled(newState)
    onUpdate()
  }

  const handleSelect = (type: SupportTypes) => {
    support.type = type

    setSelectedType(type)
    setOpen(false)
    onUpdate()
  }

  const handleBottomLeftStatusSelect = (gauge: BottomLeftOptions) => {
    support.bottom_left = gauge
    setSelectedBottomLeftStatus(gauge)
    setMenus(prev => ({ ...prev, bottomLeft: false }))
    onUpdate()
  }

  const handleTopRightStatusSelect = (status: TopRightOptions) => {
    support.top_right = status
    setSelectedTopRightStatus(status)
    setMenus(prev => ({ ...prev, topRight: false }))
    onUpdate()
  }

  const handleFriendshipSelect = (level: FriendshipLevels) => {
    support.friendship = level
    setSelectedFriendship(level)
    setMenus(prev => ({ ...prev, bottom: false }))
    onUpdate()
  }

  const handleReset = () => {
    support.type = ""
    support.bottom_left = ""
    support.top_right = ""
    support.friendship = ""
    support.enabled = false

    setSelectedType("")
    setSelectedBottomLeftStatus("")
    setSelectedTopRightStatus("")
    setSelectedFriendship("")
    setIsEnabled(false)
    onUpdate()
  }

  return (
    <div className="relative aspect-square w-full" ref={containerRef}>
      <div className="relative w-full h-full">
        <Button
          className={`w-full h-full rounded-full p-0 relative group ${isEnabled ? "bg-transparent border-none shadow-none" : ""}`}
          variant="outline"
          onClick={handleMainSelect}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isEnabled ? (
            <>
              <div
                className="w-full h-11/10 -mt-3 flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: `url(${randomSupportIcon})` }}
              >
              {isHovered && (
                <div className="absolute rounded-full inset-0 bg-white/80 flex items-center justify-center">
                  <Minus className="w-8 h-8" />
                </div>
              )}
              </div>
            </>
          ) : (
            <>
              <div
                className="w-full h-11/10 -mt-3 flex items-center justify-center bg-cover bg-center opacity-40"
                style={{ backgroundImage: `url(${randomSupportIcon})` }}
              >
                <UserPlus className="w-6 h-6 opacity-100"/>
              </div>
            </>
          )}
        </Button>

        {
          <div className={`${!isEnabled ? "opacity-40 pointer-events-none" : ""}`}>

          {/* Bottom Bar */}
            <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-3 min-w-10 w-10/12 ${menus.bottom ? "z-50" : "z-0"}`}>
              <Button
                variant="outline"
                className={`
                  relative overflow-hidden
                  w-full h-full p-0 rounded-full flex

                  hover:bg-transparent  /* disable default hover bg */
                  
                  after:absolute after:inset-0
                  after:bg-black/0 hover:after:bg-black/10
                  after:transition-colors after:pointer-events-none

                  ${friendshipBars[selectedFriendship]}
                `}
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

            {/* Top Left */}
            <div className={`absolute -top-1 -left-1 size-1/3 min-w-6 min-h-6 max-w-12 max-h-12 ${open ? "z-50" : "z-10"}`}>
              <Button
                variant="outline"
                className={`w-full h-full p-0 flex overflow-hidden ${selectedType ? "bg-transparent border-none shadow-none" : "rounded-full"}`}
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
            <div className={`absolute -top-1 -right-1 size-1/3 min-w-6 min-h-6 max-w-12 max-h-12 ${menus.topRight ? "z-50" : "z-10"}`}>
              <Button
                variant="outline"
                className={`w-full h-full p-0 flex overflow-hidden ${selectedTopRightStatus ? "bg-transparent border-none shadow-none" : "rounded-full"}`}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleMenu("topRight")
                }}
              >
                {selectedTopRightStatus ? (
                  <img
                    src={new URL(
                      `../../../assets/icons/${selectedTopRightStatus}.png`,
                      import.meta.url
                    ).href}
                    alt={selectedTopRightStatus}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Plus className="w-3 h-3" />
                )}
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
            <div className={`absolute bottom-0.5 -left-1 size-1/3 min-w-6 min-h-6 max-w-12 max-h-12 ${menus.bottomLeft ? "z-50" : "z-10"}`}>
              <Button
                variant="outline"
                className={`p-0 flex overflow-hidden ${selectedBottomLeftStatus ? "w-12/10 h-12/10 bg-transparent border-none shadow-none" : "w-full h-full rounded-full"}`}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleMenu("bottomLeft")
                }}
              >
                {selectedBottomLeftStatus ? (
                  <img
                    src={new URL(
                          `../../../assets/icons/${
                            selectedBottomLeftStatus === "unity_gauge_full" &&
                            selectedTopRightStatus === "unity_training"
                              ? `${selectedBottomLeftStatus}_2`
                              : selectedBottomLeftStatus
                          }.png`,
                      import.meta.url
                    ).href}
                    alt={selectedBottomLeftStatus}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Plus className="w-3 h-3" />
                )}
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
            <div className="absolute bottom-0.5 -right-1 size-1/3 min-w-6 min-h-6 max-w-12 max-h-12 z-10">
              <Button
                variant="outline"
                className="w-full h-full p-0 rounded-full flex items-center justify-center hover:bg-red-40 hover:text-red-500 hover:border-red-200"
                onClick={(e) => {
                  e.stopPropagation()
                  handleReset()
                }}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>

          </div>
        }
      </div>
    </div>
  )
}

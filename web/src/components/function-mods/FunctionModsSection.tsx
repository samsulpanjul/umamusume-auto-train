import { Calculator } from "lucide-react";
import Tooltips from "@/components/_c/Tooltips";
import FunctionUmaSelector from "./subsections/FunctionUmaSelector"
import FunctionResults from "./subsections/FunctionResults"
import FunctionResultDisplay from "./subsections/FunctionResultDisplay"
import { gameState } from "@/globals/gameState"
import { useState } from "react"

function deepAssign(target: any, source: any) {
  for (const key in source) {
    const s = source[key]
    const t = target[key]

    if (
      s &&
      typeof s === "object" &&
      !Array.isArray(s) &&
      t &&
      typeof t === "object"
    ) {
      deepAssign(t, s)
    } else if (Array.isArray(s) && Array.isArray(t)) {
      // Merge arrays based on card_index if possible, else append to prevent overriding default "enabled: false" values.
      s.forEach((item, index) => {
        if (item && typeof item === "object" && item.card_index !== undefined) {
          const targetItem = t.find(ti => ti.card_index === item.card_index)
          if (targetItem) {
            deepAssign(targetItem, item)
          } else {
            t.push(item)
          }
        } else {
          t[index] = item
        }
      })
    } else {
      target[key] = s
    }
  }
}

let hasLoadedInitial = false
function handleFirstLoadSync() {
  if (hasLoadedInitial) return
  hasLoadedInitial = true
  
  const request = new XMLHttpRequest()
  // false → synchronous request
  request.open("GET", "/load_action_calc", false)

  try {
    request.send(null)
    if (request.status >= 200 && request.status < 300) {
      if (request.responseText.trim()) {
        const loadedState = JSON.parse(request.responseText)
        // overwrite existing gameState values
        deepAssign(gameState, loadedState)
      }
    } else {
      console.error(`Failed to load game state – status ${request.status}: ${request.statusText}`)
    }
  } catch (e) {
    console.error("Failed to fetch game state:", e)
  }
}

export default function FunctionModsSection() {
  handleFirstLoadSync()
  const [calcResults, setCalcResults] = useState<Record<string, any> | null>(null)
  const handleCalculate = async () => {
    const response = await fetch("/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(gameState)
    })

    const results = await response.json()
    setCalcResults(results)
  }

  const setMinimumScoreState = async (functionName: string) => {
    const response = await fetch(`/set_min_score_state/${functionName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(gameState)
    })

    const results = await response.json()
    setCalcResults(results)
  }

  const calcMinimumScoreState = async (functionName: string) => {
    const response = await fetch(`/calc_min_score_state/${functionName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(gameState)
    })

    const results = await response.json()
    setCalcResults(results)
  }

  return (
    <div className="section-card">
      <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
        <Calculator className="text-primary" />
        Function Modifications <Tooltips>Placeholder</Tooltips>
      </h2>
      <div className="flex">
        <div className="flex-8">
          <div>
            <FunctionUmaSelector trainingText="Speed" trainingType="spd"/>
            <FunctionUmaSelector trainingText="Stamina" trainingType="sta"/>
            <FunctionUmaSelector trainingText="Power" trainingType="pwr"/>
            <FunctionUmaSelector trainingText="Guts" trainingType="guts"/>
            <FunctionUmaSelector trainingText="Wit" trainingType="wit"/>
          </div>
        </div>
        <div className="flex-12 pl-6">
          <button
            className="px-4 py-2 border rounded"
            onClick={handleCalculate}
          >
            Calculate Scores
          </button>
          <div className="flex">
            <div className="flex-2">
              <div className="border p-2">
                ---
              </div>
              <div className="border">
                Speed
              </div>
              <div className="border">
                Stamina
              </div>
              <div className="border">
                Power
              </div>
              <div className="border">
                Guts
              </div>
              <div className="border">
                Wit
              </div>
              <div className="border">
                MinScr
              </div>
            </div>
            {calcResults &&
              Object.entries(calcResults).map(([key, value]) => (
                <FunctionResultDisplay
                  key={key}
                  functionText={key}
                  functionResults={[value]}
                />
              ))
            }
            {/*Minimum Score Applier*/}
          </div>
          <FunctionUmaSelector trainingText="Minimum Score State" trainingType="minimumScoreState"/>

        </div>
      </div>
      <div className="border" />
      <div className="text-3xl">
      Function Results
      </div>
    </div>
  );
}

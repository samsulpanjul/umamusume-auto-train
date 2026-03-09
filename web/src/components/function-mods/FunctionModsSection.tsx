import { Calculator } from "lucide-react";
import Tooltips from "@/components/_c/Tooltips";
import FunctionUmaSelector from "./subsections/FunctionUmaSelector"
import FunctionResults from "./subsections/FunctionResults"
import FunctionResultDisplay from "./subsections/FunctionResultDisplay"
import { gameState } from "@/globals/gameState"
import { useEffect } from "react"

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
    } else {
      target[key] = s
    }
  }
}

export default function FunctionModsSection() {
  const handleCalculate = async () => {
    const response = await fetch("/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(gameState)
    })

    const results = await response.json()
    console.log(results)
  }

  const handleFirstLoad = async () => {
    const response = await fetch("/load_action_calc", {
      method: "GET"
    })

    const loadedState = await response.json()

    // overwrite existing gameState values
    deepAssign(gameState, loadedState)

    console.log("GameState loaded:", gameState)
  }

  useEffect(() => {
    handleFirstLoad()
  }, [])

  return (
    <div className="section-card">
      <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
        <Calculator className="text-primary" />
        Function Modifications <Tooltips>Placeholder</Tooltips>
      </h2>
      <div className="flex">
        <div className="flex-5 px-8">
          <div>Trainings</div>
            <FunctionUmaSelector trainingText="Speed" trainingType="spd"/>
            <FunctionUmaSelector trainingText="Stamina" trainingType="sta"/>
            <FunctionUmaSelector trainingText="Power" trainingType="pwr"/>
            <FunctionUmaSelector trainingText="Guts" trainingType="guts"/>
            <FunctionUmaSelector trainingText="Wit" trainingType="wit"/>
          <button
            className="px-4 py-2 border rounded"
            onClick={handleCalculate}
          >
            Calculate
          </button>
        </div>
        <div className="flex-12 border-l pl-6">
          Functions
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
            </div>
            <FunctionResultDisplay functionText="max out friendships" functionResults={[1,2,3,4,5]}/>
            <FunctionResultDisplay functionText="most support cards" functionResults={[1,2,3,4,5]}/>
            <FunctionResultDisplay functionText="rainbow training" functionResults={[1,2,3,4,5]}/>
            <FunctionResultDisplay functionText="most stat gain" functionResults={[1,2,3,4,5]}/>
            <FunctionResultDisplay functionText="meta training" functionResults={[1,2,3,4,5]}/>
          </div>
        </div>
      </div>
      <div className="border" />
      <div className="text-3xl">
      Function Results
      </div>
      <FunctionResults />
    </div>
  );
}

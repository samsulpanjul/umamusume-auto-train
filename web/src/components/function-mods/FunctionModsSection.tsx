import { Calculator } from "lucide-react";
import Tooltips from "@/components/_c/Tooltips";
import FunctionUmaSelector from "./subsections/FunctionUmaSelector"
import FunctionMinScoreSelector from "./subsections/FunctionMinScoreSelector"
import FunctionResultDisplay from "./subsections/FunctionResultDisplay"
import { gameState, minScoreStates } from "@/globals/gameState"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Config, UpdateConfigType } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";

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

  request.open("GET", "/load_min_scores", false)

  try {
    request.send(null)
    if (request.status >= 200 && request.status < 300) {
      if (request.responseText.trim()) {
        const loadedScoreState = JSON.parse(request.responseText)
        // overwrite existing gameState values
        deepAssign(minScoreStates, loadedScoreState)
      }
    } else {
      console.error(`Failed to load game state – status ${request.status}: ${request.statusText}`)
    }
  } catch (e) {
    console.error("Failed to fetch game state:", e)
  }
}

const FUNCTION_NAMES = ["rainbow_training", "max_out_friendships", "most_support_cards", "meta_training", "most_stat_gain"] as const;

type Props = {
  config: Config;
  updateConfig: UpdateConfigType;
};

export default function FunctionModsSection({ config, updateConfig }: Props) {
  const {
    minimum_acceptable_scores
  } = config;

  handleFirstLoadSync()
  const [calcResults, setCalcResults] = useState<Record<string, any> | null>(null)
  const handleCalculate = async () => {
    const response = await fetch("/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({gameState, minimum_acceptable_scores})
    })

    const results = await response.json()
    console.log("test2")
    setCalcResults(results)
  }

  const setMinimumScoreState = async (functionName: string, useStaticScore: boolean) => {
    const functionKey = functionName as keyof typeof minimum_acceptable_scores
    minScoreStates[functionKey].use_static_score = useStaticScore
    const response = await fetch(`/calc_min_score_state/${functionKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({minScoreStates, gameState})
    })
    const results = await response.json()
    updateConfig("minimum_acceptable_scores", {
      ...config.minimum_acceptable_scores,
      [functionKey]: {
        ...config.minimum_acceptable_scores?.[functionKey],
        minimum_acceptable_training: { 
          ...results.minimum_acceptable_data,
          training_type: results.training_type,
        }
      },
    });
    console.log("test")
    handleCalculate();
  };

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
        <button
          className="flex-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          onClick={handleCalculate}
        >
          &#62;&#62;&#62;&#62;&#62;&#62;&#62;&#62; Calculate Scores &#62;&#62;&#62;&#62;&#62;&#62;&#62;&#62; 
        </button>
        <div className="flex-12 pl-6">
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
          <Tabs className="border p-2" defaultValue="rainbow_training">
            <TabsList>
              {FUNCTION_NAMES.map((functionName) => (
                <TabsTrigger key={functionName} value={functionName}>
                  {functionName}
                </TabsTrigger>
              ))}
            </TabsList>
              {FUNCTION_NAMES.map((functionName) => {
                return (
                  <TabsContent className="border p-2" key={functionName} value={functionName}>
                    {/* ---- inner tabs for the two score views ---- */}
                      <Checkbox 
                        checked={minimum_acceptable_scores[functionName].use_user_defined_minimum_score}
                        onCheckedChange={(c) =>
                            updateConfig("minimum_acceptable_scores", {
                              ...config.minimum_acceptable_scores,
                              [functionName]: {
                                ...(config.minimum_acceptable_scores?.[functionName] ?? {}),
                                use_user_defined_minimum_score: c as boolean,
                              },
                            })
                          }
                      />
                      Use Custom Score Threshold for {functionName}
                      <Tabs
                        defaultValue={
                          minimum_acceptable_scores[
                            functionName as keyof typeof minimum_acceptable_scores
                          ]?.use_static_score
                            ? "static"
                            : "training"
                        }
                      >
                      {/* sub‑tab list */}
                      <TabsList className="mb-2">
                        <TabsTrigger value="static">Static Score</TabsTrigger>
                        <TabsTrigger value="training">Training Score</TabsTrigger>
                      </TabsList>

                      {/* static‑score panel – simple numeric input */}
                      <TabsContent value="static">
                        <div className="flex items-center space-x-2">
                          <label htmlFor={`${functionName}-static`} className="text-sm font-medium">
                            Static Score
                          </label>
                          <input
                            id={`${functionName}-static`}
                            type="number"
                            step={0.1}
                            min={0}
                            max={10}
                            // keep two decimal places
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              if (!isNaN(val)) {
                                // update your state/store here
                                // example: setstaticScore(functionName, Number(val.tostatic(2)));
                              }
                            }}
                            className="w-24 rounded border px-2 py-1 text-sm"
                            placeholder="0.00"
                          />
                        </div>
                        <div className="mt-2 flex justify-end">
                          <button
                            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                            onClick={() => {
                              setMinimumScoreState(functionName, false);
                            }}
                          >
                            Apply
                          </button>
                        </div>
                      </TabsContent>

                      {/* Training‑score panel – the original component */}
                      <TabsContent value="training">
                        <FunctionMinScoreSelector
                          functionText={functionName}
                          functionType={functionName}
                        />
                        <div className="mt-2 flex justify-end">
                          <button
                            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                            onClick={() => {
                              setMinimumScoreState(functionName, false);
                            }}
                          >
                            Apply
                          </button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </TabsContent>
                );
              })}
          </Tabs>

        </div>
      </div>
      <div className="border" />
      <div className="text-3xl">
        Function Results
      </div>
    </div>
  );
}

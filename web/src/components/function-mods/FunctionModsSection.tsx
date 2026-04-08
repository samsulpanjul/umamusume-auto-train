import { Calculator } from "lucide-react";
import Tooltips from "@/components/_c/Tooltips";
import FunctionUmaSelector from "./subsections/FunctionUmaSelector"
import FunctionMinScoreSelector from "./subsections/FunctionMinScoreSelector"
import FunctionResultDisplay from "./subsections/FunctionResultDisplay"
import { gameState, minScoreStates } from "@/globals/gameState"
import { useState, useEffect, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Config, UpdateConfigType } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

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

{/*I had something in mind when making these but then didn't use them, I'm leaving them in because they may be useful.*/}
const FALLBACK_TOOLTIPS = {
  "rainbow_training": "",
  "max_out_friendships": "",
  "most_support_cards": "",
  "meta_training": "",
  "most_stat_gain": ""
}
const SCORE_TOOLTIPS = {
  "rainbow_training": "",
  "max_out_friendships": "",
  "most_support_cards": "",
  "meta_training": "",
  "most_stat_gain": ""
}

type Props = {
  config: Config;
  updateConfig: UpdateConfigType;
};

export default function FunctionModsSection({ config, updateConfig }: Props) {
  const {
    minimum_acceptable_scores,
    function_fallbacks
  } = config;

  const [shouldRecalc, setShouldRecalc] = useState(true)
  handleFirstLoadSync()
  const [calcResults, setCalcResults] = useState<Record<string, any> | null>(null)
  
  const triggerRecalc = () => setShouldRecalc(true)
  const [glow, setGlow] = useState(false);

  const buttonAmplifyFunc = async () => {
    setGlow(true);

    setTimeout(() => setGlow(false), 1500);
  };

  const handleCalculate = useCallback(async () => {
    const response = await fetch("/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({gameState, minimum_acceptable_scores})
    })

    const results = await response.json()
    setCalcResults(results)
  }, [minimum_acceptable_scores])

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
    setShouldRecalc(true)
  };

  useEffect(() => {
    handleCalculate()
  }, [handleCalculate])

  useEffect(() => {
    if (!shouldRecalc) return
    handleCalculate()
    setShouldRecalc(false)
  }, [shouldRecalc, handleCalculate])

  const [function_chains, setFunctionChains] = useState({})

  useEffect(() => {
    const chains: Record<string, string[]> = {}

    for (const start_function in function_fallbacks) {
      const chain: string[] = []
      let current_function = start_function as keyof typeof function_fallbacks

      while (true) {
        const next_function = function_fallbacks[current_function].fallback_method as keyof typeof function_fallbacks

        if (next_function as string === "action_queue") {
          chain.push(next_function)
          break
        }

        if (chain.includes(next_function)) {
          chain.push(next_function)
          break
        }

        chain.push(next_function)
        current_function = next_function
      }

      chains[start_function] = chain
    }

    setFunctionChains(chains)
  }, [function_fallbacks])

  const textSize="text-sm"
  return (
    <div className="section-card">
      <h2 className="text-2xl font-semibold flex items-center gap-3">
        <Calculator className="text-primary" />
        Function Modifications <Tooltips>Use this page to modify how the bot behaves. This is NOT for casual users. You have been warned.</Tooltips>
      </h2>
      WARNING: If you change minimum scores and fallback methods, your bot may get stuck. Be careful when using these. 
      <Tooltips>
        {
          "Remember that you can always copy config.default.json into config.json to go back to the default config.\n\
          If you want, you can always copy the corresponding keys and replace in config.json as well.\n\
          Keys to search for in template: fallback_methods, minimum_acceptable_scores\n\
          Currently, there's no reset button for these."
        }
      </Tooltips>
      <div className="flex mt-3">
        <div className="w-1/2 font-semibold">
          <div>
            <FunctionUmaSelector trainingText="Speed" trainingType="spd" onUpdate={triggerRecalc}/>
            <FunctionUmaSelector trainingText="Stamina" trainingType="sta" onUpdate={triggerRecalc}/>
            <FunctionUmaSelector trainingText="Power" trainingType="pwr" onUpdate={triggerRecalc}/>
            <FunctionUmaSelector trainingText="Guts" trainingType="guts" onUpdate={triggerRecalc}/>
            <FunctionUmaSelector trainingText="Wit" trainingType="wit" onUpdate={triggerRecalc}/>
          </div>
        </div>
        <div className="w-1/2 pl-6">
          <div className="text-lg font-semibold">
            Function Results
            <Tooltips>
              {
                "The numbers below show the score calculations of their respective function from the training scenarios set on the left side.\n\
                Green number mean the bot will pick that training if you use that function.\n\
                Red numbers mean those trainings are below the minimum score.\n\
                MinScr is the current minimum score the bot expects from the training.\n\
                Meta training and most stat score inherently use no fallback and always pick a training unless the failure chance is too high.\n\
                This table does not take failure chances into account.\n\
                "
              }
            </Tooltips>
          </div>
          <div className="flex">
            <div className="flex-2 shrink">
              <div className={`border border-b-0 border-transparent ${textSize}`}>
                ---
              </div>
              <div className={`border border-b-0 px-1 ${textSize}`}>
                Speed
              </div>
              <div className={`border border-b-0 px-1 ${textSize}`}>
                Stamina
              </div>
              <div className={`border border-b-0 px-1 ${textSize}`}>
                Power
              </div>
              <div className={`border border-b-0 px-1 ${textSize}`}>
                Guts
              </div>
              <div className={`border border-b-0 px-1 ${textSize}`}>
                Wit
              </div>
              <div className={`border border-b-0 px-1 ${textSize}`}>
                MinScr
              </div>
            </div>
            <div className="shrink min-w-0">
              <div className="flex">
              {calcResults &&
                Object.entries(calcResults).map(([key, value]) => (
                  <FunctionResultDisplay
                    key={key}
                    functionText={key}
                    functionResults={[value]}
                  />
                ))
              }
              </div>
            </div>
            {/*Minimum Score Applier*/}
          </div>
          <Tabs className="border p-2" defaultValue="rainbow_training">
            <div className="flex flex-wrap items-center gap-2 mb-2">
            <TabsList className="flex-wrap gap-1 bg-muted/50 p-1 rounded-md h-auto justify-start">
              {FUNCTION_NAMES.map((functionName) => (
                <TabsTrigger key={functionName} value={functionName} className="h-8">
                  {functionName}
                </TabsTrigger>
              ))}
            </TabsList>
              <Tooltips>
                The settings below will be applied for the selected training function only.
              </Tooltips>
            </div>
              {FUNCTION_NAMES.map((functionName) => {
                return (
                    <TabsContent key={functionName} value={functionName}>
                      <div className="border p-2">
                        <Checkbox 
                          checked={function_fallbacks[functionName].fallback_enabled}
                          onCheckedChange={(val) =>
                              updateConfig("function_fallbacks", {
                                ...function_fallbacks,
                                [functionName]: {
                                  ...function_fallbacks[functionName],
                                  fallback_enabled: val,
                                }
                              })
                            }
                        />
                        Use Function Fallback Method for {functionName}
                        <Tooltips>
                          {
                            FALLBACK_TOOLTIPS[functionName]
                          }
                          {
                            "When this is enabled and there's no good training, the training function will fall back to the method in the dropdown.\n\
                            If the fall back is action queue, the bot will go to the next action in the queue and try that.\n\
                            Meta Training and Most Stat Gain fallback methods will only work if you set a minimum score and enable use custom score threshold for them."
                          }
                        </Tooltips>
                        <div className="flex">
                          <Select
                            value={function_fallbacks[functionName].fallback_method} 
                            disabled={!function_fallbacks[functionName].fallback_enabled}
                            onValueChange={(val) => 
                              updateConfig("function_fallbacks", {
                                ...function_fallbacks,
                                [functionName]: {
                                  ...function_fallbacks[functionName],
                                  fallback_method: val,
                                }
                              })
                            }
                          >
                            <SelectTrigger id={`${functionName}-fallback`}>
                              <SelectValue placeholder="action_queue" />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                ...FUNCTION_NAMES,
                                "action_queue"
                              ].filter((r) => r !== functionName).map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
                            </SelectContent>
                          </Select>
                          <Tooltips>
                            This dropdown selects the type of function you want to be run if the current
                            function has no trainings that are above the minimum score threshold.
                          </Tooltips>
                        </div>
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
                        <Tooltips>
                          {
                            SCORE_TOOLTIPS[functionName]
                          }
                          When this option is enabled and you've applied a minimum score using the options below, that score threshold will be used to eliminate trainings.
                        </Tooltips>
                      </div>
                        <Tabs
                          defaultValue={
                            minimum_acceptable_scores[
                              functionName as keyof typeof minimum_acceptable_scores
                            ]?.use_static_score
                              ? "static"
                              : "training"
                          }
                          className="py-2"
                        >
                        {/* sub‑tab list */}
                        <div className="flex">
                          <TabsList className="mb-2">
                            <TabsTrigger value="static">Static Score</TabsTrigger>
                            <TabsTrigger value="training">Training Score</TabsTrigger>
                          </TabsList>
                          <Tooltips>
                            {
                              "Choose Static Score to set a minimum score yourself.\n\
                              Choose Training Score to set a training. This training will be used by the bot and it will calculate a score for you automatically.\n\
                              The score is not set per training type, it is set per training function."
                            }
                          </Tooltips>
                        </div>

                        {/* static‑score panel – simple numeric input */}
                        <TabsContent value="static">
                          <div className="flex items-center space-x-2">
                            <label htmlFor={`${functionName}-static`}>
                              Static Score
                            </label>
                            <Input
                              id={`${functionName}-static`}
                              type="number"
                              step={0.1}
                              min={0}
                              defaultValue={minScoreStates[functionName as keyof typeof minScoreStates].fixed_score}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                if (!isNaN(val)) {
                                  minScoreStates[functionName as keyof typeof minScoreStates].fixed_score = val;
                                }
                                buttonAmplifyFunc();
                              }}
                              className="w-18"
                              placeholder="0.00"
                            />
                          <div className="ml-10 flex justify-end">
                            <button
                              className={`px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded transition-all duration-300 ${
                                  glow ? "ring-ring/70 ring-[7px]" : ""
                                }`}
                              onClick={() => {
                                setMinimumScoreState(functionName, true);
                              }}
                            >
                              Apply
                            </button>
                          </div>
                          </div>

                        </TabsContent>
                        {/* Training‑score panel – the original component */}
                        <TabsContent value="training">
                          <FunctionMinScoreSelector
                            functionText={functionName}
                            functionType={functionName}
                            onUpdate={buttonAmplifyFunc}
                          />
                          <div className="mt-2 flex justify-end">
                            <button
                              className={`px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded transition-all duration-300 ${
                                  glow ? "ring-ring/70 ring-[7px]" : ""
                                }`}
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
          <div>
            {
              Object.entries(function_chains).map(
                ([function_name, chain]) => {
                  const strChain = chain as string[];   // ← cast

                  return (
                    <div
                      className={`
                        border text-sm border-t-0 p-1 
                        ${!function_fallbacks[function_name as keyof typeof function_fallbacks].fallback_enabled
                            ? "text-muted-foreground"
                            : ""}`
                      }
                      key={function_name}
                    >
                      <strong>{function_name}</strong> → {strChain.join(" → ")}
                    </div>
                  );
                }
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}

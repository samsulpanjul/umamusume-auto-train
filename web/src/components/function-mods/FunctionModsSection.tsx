import { Calculator } from "lucide-react";
import Tooltips from "@/components/_c/Tooltips";
import FunctionUmaSelector from "./subsections/FunctionUmaSelector"
import FunctionResults from "./subsections/FunctionResults"
import FunctionResultDisplay from "./subsections/FunctionResultDisplay"

export default function FunctionModsSection() {
  return (
    <div className="section-card">
      <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
        <Calculator className="text-primary" />
        Function Modifications <Tooltips>Placeholder</Tooltips>
      </h2>
      <div className="flex">
        <div className="flex-5 px-8">
          <div>Trainings</div>
            <FunctionUmaSelector trainingText="Speed" gameState={gameState} updateGameState={updateGameState}/>
            <FunctionUmaSelector trainingText="Stamina" gameState={gameState} updateGameState={updateGameState}/>
            <FunctionUmaSelector trainingText="Power" gameState={gameState} updateGameState={updateGameState}/>
            <FunctionUmaSelector trainingText="Guts" gameState={gameState} updateGameState={updateGameState}/>
            <FunctionUmaSelector trainingText="Wit" gameState={gameState} updateGameState={updateGameState}/>
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

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
            <FunctionUmaSelector trainingText="Speed"/>
            <FunctionUmaSelector trainingText="Stamina"/>
            <FunctionUmaSelector trainingText="Power"/>
            <FunctionUmaSelector trainingText="Guts"/>
            <FunctionUmaSelector trainingText="Wit"/>
        </div>
        <div className="flex-12 border-l pl-6">
          Functions
          <div className="flex">
            <div className="flex-2">
              <div className="border">
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
            <FunctionResultDisplay className="flex-3" functionText="max out friendships" functionResults={[1,2,3,4,5]}/>
            <FunctionResultDisplay className="flex-3" functionText="most support cards" functionResults={[1,2,3,4,5]}/>
            <FunctionResultDisplay className="flex-3" functionText="rainbow training" functionResults={[1,2,3,4,5]}/>
            <FunctionResultDisplay className="flex-3" functionText="most stat gain" functionResults={[1,2,3,4,5]}/>
            <FunctionResultDisplay className="flex-3" functionText="meta training" functionResults={[1,2,3,4,5]}/>
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

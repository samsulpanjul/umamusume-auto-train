import { Calculator } from "lucide-react";
import Tooltips from "@/components/_c/Tooltips";
import FunctionModUmaCard from "./subsections/FunctionModUmaCard"
import FunctionResults from "./subsections/FunctionResults"

export default function FunctionModsSection() {
  return (
    <div className="section-card">
      <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
        <Calculator className="text-primary" />
        Function Modifications <Tooltips>Placeholder</Tooltips>
      </h2>
      <div className="flex">
        <div className="flex-20 px-8">
          Trainings
          <div className="flex">
            <div className="text-3xl flex-2 mb-6 border">
              Speed
              <div className="flex mb-6">
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
              <div className="flex mb-6">
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
              <div className="flex mb-6">
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
            </div>
            <div className="text-3xl flex-2 mb-6 border">
              Stamina
              <div className="flex mb-6">
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
              <div className="flex mb-6">
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
              <div className="flex mb-6">
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
            </div>
            <div className="text-3xl flex-2 mb-6 border">
              Power
              <div className="flex mb-6">
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
              <div className="flex mb-6">
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
              <div className="flex mb-6">
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
            </div>
            <div className="text-3xl flex-2 mb-6 border">
              <h2>
                Guts
              </h2>
              <div className="flex mb-6">
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
              <div className="flex mb-6">
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
              <div className="flex mb-6">
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
            </div>
            <div className="text-3xl flex-2 mb-6 border">
              Wit
              <div className="flex mb-6">
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
              <div className="flex mb-6">
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
              <div className="flex mb-6">
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 border-l pl-6">
          Supports
            <FunctionModUmaCard/>
            <FunctionModUmaCard/>
            <FunctionModUmaCard/>
            <FunctionModUmaCard/>
            <FunctionModUmaCard/>
            <FunctionModUmaCard/>
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

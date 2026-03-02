import FunctionModUmaCard from "./FunctionModUmaCard"
import { Input } from "@/components/ui/input";

type Props = {
  trainingText: string;
};

export default function FunctionUmaSelector({ trainingText }: Props) {
  return (
          <>
            {trainingText}
            <div className="text-3xl flex-1 mb-6 border">
              <div className="flex">

                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
                <FunctionModUmaCard/>
              </div>
            </div>
          </>
  );
}

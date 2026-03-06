import FunctionModUmaCard from "./FunctionModUmaCard"

type Props = {
  trainingText: string;
  trainingType: string;
};

export default function FunctionUmaSelector({ trainingText, trainingType }: Props) {
  return (
          <>
            {trainingText}
            <div className="text-3xl flex-1 mb-6 border">
              <div className="flex">
                <FunctionModUmaCard trainingText={trainingType}/>
                <FunctionModUmaCard trainingText={trainingType}/>
                <FunctionModUmaCard trainingText={trainingType}/>
                <FunctionModUmaCard trainingText={trainingType}/>
                <FunctionModUmaCard trainingText={trainingType}/>
                <FunctionModUmaCard trainingText={trainingType}/>
              </div>
            </div>
          </>
  );
}

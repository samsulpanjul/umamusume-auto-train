type Props = {
  functionText: string;
  functionResults: any[];
};

function isBetterTuple(a: [number, number], b: [number, number]) {
  if (a[0] > b[0]) return true;
  if (a[0] < b[0]) return false;
  return a[1] > b[1];
}

function getScoreClass(
  tuple: [number, number],
  minScore: number | undefined,
  bestTuple: [number, number] | null
) {
  const score = tuple[0];

  if (minScore !== undefined && score < minScore) {
    return "text-red-500";
  }

  if (
    bestTuple &&
    tuple[0] === bestTuple[0] &&
    tuple[1] === bestTuple[1] &&
    (minScore === undefined || score >= minScore)
  ) {
    return "text-green-500";
  }

  return "";
}

// Desired order
const TRAINING_ORDER = ["spd", "sta", "pwr", "guts", "wit"] as const;

export default function FunctionResultDisplay({
  functionText,
  functionResults,
}: Props) {
  console.log(functionResults)
  return (
    <>
      <div>
        <div className="border p-2">{functionText}</div>

        <div>
          {functionResults.map((result, index) => {
            const trainings = result?.options?.available_trainings ?? {};
            const minScore = result?.options?.min_scores?.[functionText]?.[0];

            // Find the best tuple across all trainings
            let bestTuple: [number, number] | null = null;
            Object.values(trainings).forEach((t: any) => {
              const tuple = t?.score_tuple;
              if (!tuple) return;
              if (!bestTuple || isBetterTuple(tuple, bestTuple)) {
                bestTuple = tuple;
              }
            });

            // Render in the fixed order
            return TRAINING_ORDER.map((trainingName) => {
              const trainingData = (trainings as Record<string, any>)[trainingName];
              const tuple: [number, number] | undefined =
                trainingData?.score_tuple;

              return (
                <div
                  className={`border ${
                    tuple ? getScoreClass(tuple, minScore, bestTuple) : ""
                  }`}
                  key={`${index}-${trainingName}`}
                >
                  {tuple ? tuple[0].toFixed(2) : "-"}
                </div>
              );
            });
          })}
          <div>
            minScore
          </div>
        </div>
      </div>
    </>
  );
}

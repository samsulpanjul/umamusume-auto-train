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

  const textSize="text-sm"
  return (
    <>
      <div>
        <div className={`border ${textSize}`}>{functionText}</div>

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

            // ---- build the cells -------------------------------------------------
            const trainingCells = TRAINING_ORDER.map((trainingName) => {
              const trainingData = (trainings as Record<string, any>)[trainingName];
              const tuple: [number, number] | undefined = trainingData?.score_tuple;

              return (
                <div
                  className={`border ${textSize} ${
                    tuple ? getScoreClass(tuple, minScore, bestTuple) : ""
                  }`}
                  key={`${index}-${trainingName}`}
                >
                  {tuple ? tuple[0].toFixed(2) : "-"}
                </div>
              );
            });

            const minScoreCell = (
              <div
                className={`border ${textSize}`}
                key={`${index}-minScore`}
              >
                {minScore !== undefined ? minScore.toFixed(2) : "-"}
              </div>
            );

            return [...trainingCells, minScoreCell];
          })}
        </div>
      </div>
    </>
  );
}

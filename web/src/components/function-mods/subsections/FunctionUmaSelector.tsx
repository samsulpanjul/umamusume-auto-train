import FunctionModUmaCard from "./FunctionModUmaCard"
import type { GameState, UpdateGameState } from "@/types/game-state.type"

type Props = {
  trainingText: string;
  gameState: GameState;
  updateGameState: UpdateGameState;
};

export default function FunctionUmaSelector({ trainingText, gameState, updateGameState }: Props) {
  let fuckyou = gameState
  let fuckyou2 = updateGameState
  gameState = fuckyou
  updateGameState = fuckyou2

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


import { Button } from "@/components/ui/button";
import { usePlayerMode } from "./PlayerModeContext";

const PlayerSwitch = () => {
  const { playerMode, setPlayerMode } = usePlayerMode();

  return (
    <div className="flex justify-center gap-2 p-2 mb-2">
      <Button
        variant={playerMode === "player1" ? "default" : "outline"}
        onClick={() => setPlayerMode("player1")}
      >
        Player 1 View
      </Button>
      <Button
        variant={playerMode === "player2" ? "default" : "outline"}
        onClick={() => setPlayerMode("player2")}
      >
        Player 2 View
      </Button>
    </div>
  );
};

export default PlayerSwitch;

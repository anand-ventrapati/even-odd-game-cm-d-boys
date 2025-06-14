
import { useState } from 'react';
import GameLobby from '@/components/GameLobby';
import GameBoard from '@/components/GameBoard';
import { GameState } from '@/types/game';
import { usePlayerMode } from '@/components/PlayerModeContext';

const Index = () => {
  const { playerMode } = usePlayerMode();
  const [gameState, setGameState] = useState<GameState>({
    gameId: '',
    players: [],
    currentTurn: 0,
    gamePhase: 'lobby',
    currentBet: null,
    gameLog: [],
    winner: null
  });
  const [localPlayerId, setLocalPlayerId] = useState<string | null>(null);

  const updateGameState = (newState: Partial<GameState>, playerId?: string) => {
    setGameState(prev => ({ ...prev, ...newState }));
    if (playerId) setLocalPlayerId(playerId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {gameState.gamePhase === 'lobby' ? (
        <GameLobby onGameStart={updateGameState} />
      ) : (
        // Pass which "simulated player" you currently are
        <GameBoard
          gameState={gameState}
          onUpdateGame={updateGameState}
          localPlayerId={playerMode === "player1" ? "1" : playerMode === "player2" ? "2" : null}
        />
      )}
    </div>
  );
};

export default Index;

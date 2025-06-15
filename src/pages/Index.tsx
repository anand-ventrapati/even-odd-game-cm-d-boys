import { useState } from 'react';
import GameLobby from '@/components/GameLobby';
import GameBoard from '@/components/GameBoard';
import { GameState } from '@/types/game';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>({
    gameId: '',
    players: [],
    currentTurn: 0,
    gamePhase: 'lobby',
    currentBet: null,
    gameLog: [],
    winner: null
  });
  // Keep playerId in local state, managed by GameLobby
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
        <GameBoard
          gameState={gameState}
          onUpdateGame={updateGameState}
          localPlayerId={localPlayerId}
        />
      )}
    </div>
  );
};

export default Index;

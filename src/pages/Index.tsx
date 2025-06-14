
import { useState } from 'react';
import GameLobby from '@/components/GameLobby';
import GameBoard from '@/components/GameBoard';
import { GameState, Player } from '@/types/game';

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

  const updateGameState = (newState: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...newState }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {gameState.gamePhase === 'lobby' ? (
        <GameLobby onGameStart={updateGameState} />
      ) : (
        <GameBoard gameState={gameState} onUpdateGame={updateGameState} />
      )}
    </div>
  );
};

export default Index;

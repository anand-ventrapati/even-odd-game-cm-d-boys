import { useState } from 'react';
import GameLobby from '@/components/GameLobby';
import GameBoard from '@/components/GameBoard';
import { GameState } from '@/types/game';
import GameHowToPlayModal from '@/components/GameHowToPlayModal';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

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

  // Modal state for how to play (lobby only)
  const [howToOpen, setHowToOpen] = useState(false);

  const updateGameState = (newState: Partial<GameState>, playerId?: string) => {
    setGameState(prev => ({ ...prev, ...newState }));
    if (playerId) setLocalPlayerId(playerId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {gameState.gamePhase === 'lobby' ? (
        <>
          {/* Top bar with How to play */}
          <div className="w-full flex justify-end items-start p-4">
            <Button 
              onClick={() => setHowToOpen(true)} 
              variant="ghost"
              className="text-black font-semibold bg-transparent border-none shadow-none hover:bg-gray-100 hover:text-black focus:bg-gray-200 focus:text-black"
            >
              How to play
            </Button>
            <GameHowToPlayModal open={howToOpen} onOpenChange={setHowToOpen} />
          </div>
          <GameLobby onGameStart={updateGameState} />
        </>
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

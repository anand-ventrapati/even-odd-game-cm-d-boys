import { useState } from 'react';
import GameLobby from '@/components/GameLobby';
import GameBoard from '@/components/GameBoard';
import { GameState } from '@/types/game';
import GameHowToPlayModal from '@/components/GameHowToPlayModal';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

// Please add this to your index.html <head> for the font to fully work:
// <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap">

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
  const [localPlayerId, setLocalPlayerId] = useState<string | null>(null);
  const [howToOpen, setHowToOpen] = useState(false);

  const updateGameState = (newState: Partial<GameState>, playerId?: string) => {
    setGameState(prev => ({ ...prev, ...newState }));
    if (playerId) setLocalPlayerId(playerId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex flex-col">
      {/* Top bar with How to play */}
      <div className="w-full flex justify-end items-start p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-1">
          <Button 
            onClick={() => setHowToOpen(true)} 
            variant="ghost"
            className="text-gray-800 font-semibold bg-transparent border-none shadow-none hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-200 focus:text-gray-900"
          >
            How to play
          </Button>
        </div>
        <GameHowToPlayModal open={howToOpen} onOpenChange={setHowToOpen} />
      </div>

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

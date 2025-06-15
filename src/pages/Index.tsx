
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
      {gameState.gamePhase === 'lobby' ? (
        <>
          {/* Glitter Slogan Banner */}
          <div className="w-full flex justify-center items-center p-4 mt-2 select-none">
            <span
              className="font-playfair text-2xl md:text-3xl text-center font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-400 bg-clip-text text-transparent animate-glitter drop-shadow-lg tracking-wide"
              style={{
                backgroundSize: "200% 200%",
                WebkitTextStroke: "1.2px #fff7",
                filter: "drop-shadow(0 2px 8px #ffe7a2) drop-shadow(0 1px 10px #93d0ff66)",
                letterSpacing: '0.04em'
              }}
            >
              Bet smart, play fun, and win big — place your bets, test your luck, and let the fun begin!
            </span>
          </div>
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
          {/* Credits at the bottom of home page */}
          <div className="w-full flex flex-col items-center mt-8 pb-8">
            <div className="font-semibold text-base mt-8 px-4 py-2 rounded transition hover:opacity-80 hover:scale-105"
              style={{
                background: "linear-gradient(to right, #00c6ff, #0072ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                cursor: "default"
              }}
            >
              Created by{' '}
              <a
                href="https://instagram.com/anand_ventrapati"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline cursor-pointer"
                style={{ WebkitTextFillColor: "inherit" }}
              >
                Anand
              </a>
              {' '}and{' '}
              <a
                href="https://instagram.com/_big_fan_of_muhammad_saw"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline cursor-pointer"
                style={{ WebkitTextFillColor: "inherit" }}
              >
                Sohail
              </a>
            </div>
          </div>
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

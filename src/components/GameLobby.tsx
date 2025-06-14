
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dice1, Users } from 'lucide-react';
import { GameState } from '@/types/game';
import InviteLink from './InviteLink';
import { usePlayerMode } from './PlayerModeContext';

interface GameLobbyProps {
  onGameStart: (gameState: Partial<GameState>, localPlayerId: string) => void;
}

const GameLobby = ({ onGameStart }: GameLobbyProps) => {
  const { playerMode } = usePlayerMode();
  const [gamePin, setGamePin] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [createdGamePin, setCreatedGamePin] = useState<string | null>(null);

  // Generate PIN and handle create/join, as before
  const generatePin = () => Math.random().toString(36).substring(2, 8).toUpperCase();

  const createGame = () => {
    if (!playerName.trim() || playerMode !== "player1") return;
    const pin = generatePin();
    const player = {
      id: '1',
      name: playerName.trim(),
      points: 10,
    };

    setIsCreating(true);
    setCreatedGamePin(pin);

    // Wait for join (simulate)
    setTimeout(() => {
      const player2 = {
        id: '2',
        name: 'Player 2',
        points: 10
      };
      onGameStart({
        gameId: pin,
        players: [player, player2],
        currentTurn: 0,
        gamePhase: 'betting',
        gameLog: [`Game ${pin} started!`, `${player.name} joined`, `${player2.name} joined`],
        currentBet: null,
        winner: null
      }, '1');
    }, 2000);
  };

  const joinGame = () => {
    if (!playerName.trim() || !gamePin.trim() || playerMode !== "player2") return;

    const player = {
      id: '2',
      name: playerName.trim(),
      points: 10
    };
    const player1 = {
      id: '1',
      name: 'Player 1',
      points: 10
    };
    setIsJoining(true);

    setTimeout(() => {
      onGameStart({
        gameId: gamePin.toUpperCase(),
        players: [player1, player],
        currentTurn: 0,
        gamePhase: 'betting',
        gameLog: [`Game ${gamePin.toUpperCase()} started!`, `${player1.name} joined`, `${player.name} joined`],
        currentBet: null,
        winner: null
      }, '2');
    }, 1000);
  };

  const inviteLink = createdGamePin
    ? `${window.location.origin}/?pin=${createdGamePin}`
    : "";

  // UI: show only appropriate actions for given player simulation mode
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Dice1 className="h-12 w-12 text-yellow-400 mr-2" />
            <h1 className="text-4xl font-bold text-white">Even-Odd</h1>
          </div>
          <p className="text-blue-200">Betting Game</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-center">Join Game</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              disabled={isCreating}
            />

            <div className="space-y-3">
              {/* Only Player 1 can create a new game */}
              <Button
                onClick={createGame}
                disabled={!playerName.trim() || isCreating || playerMode !== "player1"}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {isCreating ? 'Creating Game...' : 'Create New Game'}
              </Button>
              {createdGamePin && (
                <InviteLink link={inviteLink} />
              )}
              <div className="flex space-x-2">
                {/* Only Player 2 can join using PIN */}
                <Input
                  placeholder="Game PIN"
                  value={gamePin}
                  onChange={(e) => setGamePin(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  disabled={isCreating}
                />
                <Button
                  onClick={joinGame}
                  disabled={!playerName.trim() || !gamePin.trim() || isJoining || isCreating || playerMode !== "player2"}
                  className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
                >
                  {isJoining ? 'Joining...' : 'Join'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <div className="flex items-center justify-center text-white/80 text-sm">
            <Users className="h-4 w-4 mr-1" />
            2 players required to start
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLobby;

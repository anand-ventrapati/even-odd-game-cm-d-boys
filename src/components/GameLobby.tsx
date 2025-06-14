
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dice1, Users } from 'lucide-react';
import { GameState } from '@/types/game';
import InviteLink from './InviteLink';

interface GameLobbyProps {
  onGameStart: (gameState: Partial<GameState>, localPlayerId: string) => void;
}

const GameLobby = ({ onGameStart }: GameLobbyProps) => {
  // CREATE GAME
  const [createPlayerName, setCreatePlayerName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createdGamePin, setCreatedGamePin] = useState<string | null>(null);

  // JOIN GAME
  const [joinPlayerName, setJoinPlayerName] = useState('');
  const [joinGamePin, setJoinGamePin] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  // Generate PIN and handle create/join, as before
  const generatePin = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase();

  const createGame = () => {
    if (!createPlayerName.trim()) return;
    const pin = generatePin();
    const player = {
      id: '1',
      name: createPlayerName.trim(),
      points: 10,
    };

    setIsCreating(true);
    setCreatedGamePin(pin);

    // Wait for second player to join (simulate, just for demo)
    setTimeout(() => {
      // "player 2" placeholder only — will be replaced when they join
      const player2 = {
        id: '2',
        name: 'Player 2',
        points: 10,
      };
      onGameStart(
        {
          gameId: pin,
          players: [player, player2],
          currentTurn: 0,
          gamePhase: 'betting',
          gameLog: [
            `Game ${pin} started!`,
            `${player.name} joined`,
            `${player2.name} joined`,
          ],
          currentBet: null,
          winner: null,
        },
        '1'
      );
    }, 2000);
  };

  const joinGame = () => {
    if (!joinPlayerName.trim() || !joinGamePin.trim()) return;

    const player1 = {
      id: '1',
      name: 'Player 1',
      points: 10,
    };
    const player2 = {
      id: '2',
      name: joinPlayerName.trim(),
      points: 10,
    };
    setIsJoining(true);

    setTimeout(() => {
      onGameStart(
        {
          gameId: joinGamePin.toUpperCase(),
          players: [player1, player2],
          currentTurn: 0,
          gamePhase: 'betting',
          gameLog: [
            `Game ${joinGamePin.toUpperCase()} started!`,
            `${player1.name} joined`,
            `${player2.name} joined`,
          ],
          currentBet: null,
          winner: null,
        },
        '2'
      );
    }, 1000);
  };

  const inviteLink = createdGamePin
    ? `${window.location.origin}/?pin=${createdGamePin}`
    : '';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Dice1 className="h-12 w-12 text-yellow-400 mr-2" />
            <h1 className="text-4xl font-bold text-white">Even-Odd</h1>
          </div>
          <p className="text-blue-200">Betting Game</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CREATE GAME */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-center">Create New Game</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="block text-white text-sm">
                  Your Name
                </label>
                <Input
                  placeholder="Your name"
                  value={createPlayerName}
                  onChange={(e) => setCreatePlayerName(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  disabled={isCreating}
                />
              </div>
              <Button
                onClick={createGame}
                disabled={!createPlayerName.trim() || isCreating}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {isCreating ? 'Creating Game...' : 'Create New Game'}
              </Button>
              {/* PIN and Invite section */}
              {createdGamePin && (
                <div className="mt-6">
                  <div className="text-center my-4">
                    <div className="font-mono text-3xl text-yellow-300 font-extrabold tracking-widest bg-black/40 rounded p-4 inline-block">
                      {createdGamePin}
                    </div>
                  </div>
                  <InviteLink link={inviteLink} />
                  <div className="text-white mt-4 text-sm text-center">
                    Share this PIN with your friend to join the game.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* JOIN GAME */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-center">Join Game</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="block text-white text-sm">
                  Your Name
                </label>
                <Input
                  placeholder="Your name"
                  value={joinPlayerName}
                  onChange={(e) => setJoinPlayerName(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  disabled={isJoining}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-white text-sm">
                  Game PIN
                </label>
                <Input
                  placeholder="Enter PIN"
                  value={joinGamePin}
                  onChange={(e) => setJoinGamePin(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  disabled={isJoining}
                />
              </div>
              <Button
                onClick={joinGame}
                disabled={
                  !joinPlayerName.trim() || !joinGamePin.trim() || isJoining
                }
                className="w-full bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
              >
                {isJoining ? 'Joining...' : 'Join'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <div className="flex items-center justify-center text-white/80 text-sm">
            <Users className="h-4 w-4 mr-1" />
            2 players required to start — play with a friend on separate devices!
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLobby;

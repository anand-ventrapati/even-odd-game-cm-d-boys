
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dice1, Users } from 'lucide-react';
import { GameState } from '@/types/game';
import InviteLink from './InviteLink';
import { supabase } from '@/integrations/supabase/client';

interface GameLobbyProps {
  onGameStart: (gameState: Partial<GameState>, localPlayerId: string) => void;
}

const GameLobby = ({ onGameStart }: GameLobbyProps) => {
  // CREATE GAME
  const [createPlayerName, setCreatePlayerName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createdGamePin, setCreatedGamePin] = useState<string | null>(null);
  const [waitingForPlayer2, setWaitingForPlayer2] = useState(false);

  // JOIN GAME
  const [joinPlayerName, setJoinPlayerName] = useState('');
  const [joinGamePin, setJoinGamePin] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  // For polling
  const pollingIntervalRef = useRef<NodeJS.Timeout>();

  // SUPABASE LOGIC
  const generatePin = () =>
    Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit number as PIN

  const createGame = async () => {
    if (!createPlayerName.trim()) return;
    const pin = generatePin();
    setIsCreating(true);

    // Create game in Supabase with only player1
    const { data, error } = await supabase
      .from('games')
      .insert([
        {
          pin,
          ['player 1']: createPlayerName.trim(),
          ['player 2']: null,
          turn: null,
          gameState: null,
        },
      ])
      .select()
      .single();

    if (error) {
      setIsCreating(false);
      alert('Error creating game: ' + error.message);
      return;
    }

    setCreatedGamePin(pin);
    setIsCreating(false);
    setWaitingForPlayer2(true);

    // Start polling for player 2 to join
    pollingIntervalRef.current = setInterval(async () => {
      const { data: pollGame, error: pollError } = await supabase
        .from('games')
        .select('*')
        .eq('pin', pin)
        .single();

      if (!pollError && pollGame && pollGame['player 2']) {
        // Player2 joined
        clearInterval(pollingIntervalRef.current!);
        setWaitingForPlayer2(false);

        // Move to game phase
        onGameStart(
          {
            gameId: pin,
            players: [
              { id: '1', name: createPlayerName.trim(), points: 10 },
              { id: '2', name: pollGame['player 2'], points: 10 },
            ],
            currentTurn: 0,
            gamePhase: 'betting',
            gameLog: [
              `Game ${pin} started!`,
              `${createPlayerName.trim()} joined`,
              `${pollGame['player 2']} joined`,
            ],
            currentBet: null,
            winner: null,
          },
          '1'
        );
      }
    }, 2000);
  };

  // JOIN GAME logic
  const joinGame = async () => {
    if (!joinPlayerName.trim() || !joinGamePin.trim()) return;
    setIsJoining(true);

    // Try to update the game and fill in player2
    const { data: existingGame, error: fetchError } = await supabase
      .from('games')
      .select('*')
      .eq('pin', joinGamePin.trim())
      .single();

    if (fetchError || !existingGame) {
      setIsJoining(false);
      alert('Invalid PIN or game not found.');
      return;
    }
    if (existingGame['player 2']) {
      setIsJoining(false);
      alert('Game already has two players.');
      return;
    }

    // Update player2
    const { data: updatedGame, error: updateError } = await supabase
      .from('games')
      .update({ ['player 2']: joinPlayerName.trim() })
      .eq('pin', joinGamePin.trim())
      .select()
      .single();

    if (updateError || !updatedGame) {
      setIsJoining(false);
      alert('Failed to join game.');
      return;
    }

    setIsJoining(false);

    // Notify both clients that game is ready
    onGameStart(
      {
        gameId: joinGamePin.trim(),
        players: [
          { id: '1', name: updatedGame['player 1'], points: 10 },
          { id: '2', name: joinPlayerName.trim(), points: 10 },
        ],
        currentTurn: 0,
        gamePhase: 'betting',
        gameLog: [
          `Game ${joinGamePin.trim()} started!`,
          `${updatedGame['player 1']} joined`,
          `${joinPlayerName.trim()} joined`,
        ],
        currentBet: null,
        winner: null,
      },
      '2'
    );
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, []);

  const inviteLink = createdGamePin
    ? `${window.location.origin}/?pin=${createdGamePin}`
    : '';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Dice1 className="h-16 w-16 text-yellow-400 mr-3" />
            <h1 className="text-5xl font-bold text-white">Even-Odd</h1>
          </div>
          <p className="text-blue-200 text-lg">Betting Game</p>
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
                  disabled={isCreating || waitingForPlayer2}
                />
              </div>
              <Button
                onClick={createGame}
                disabled={!createPlayerName.trim() || isCreating || waitingForPlayer2}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {isCreating ? 'Creating Game...' : 'Create New Game'}
              </Button>
              {/* PIN and Invite section (show while waiting for player 2) */}
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
                  {waitingForPlayer2 && (
                    <div className="text-yellow-200 mt-4 text-center font-bold flex flex-col items-center justify-center gap-2">
                      <span>Waiting for opponent to join...</span>
                      <span className="text-xs opacity-80">(Don&apos;t close this screen.)</span>
                    </div>
                  )}
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


import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Trophy, RotateCcw, Info } from 'lucide-react';
import { GameState, Bet } from '@/types/game';
import GameHowToPlayModal from './GameHowToPlayModal';
import { toast } from '@/hooks/use-toast';

interface GameBoardProps {
  gameState: GameState;
  onUpdateGame: (newState: Partial<GameState>, playerId?: string) => void;
  localPlayerId: string | null;
}

const GameBoard = ({ gameState, onUpdateGame, localPlayerId }: GameBoardProps) => {
  const [betNumber, setBetNumber] = useState(0);
  const [betAmount, setBetAmount] = useState(1);
  const [betError, setBetError] = useState<string | null>(null);

  if (!localPlayerId) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Select a player using the 'Player 1 View' or 'Player 2 View' buttons above.
      </div>
    );
  }

  const myIndex = gameState.players.findIndex(p => p.id === localPlayerId);
  const otherIndex = 1 - myIndex;
  const currentPlayer = gameState.players[gameState.currentTurn];
  const otherPlayer = gameState.players[1 - gameState.currentTurn];
  const isMyTurn = currentPlayer.id === localPlayerId;

  // Allow betting only up to BOTH players' points
  const maxAllowedBet = Math.min(currentPlayer.points, otherPlayer.points);

  // --- MULTIPLAYER POLLING LOGIC ---
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Start polling when both players present and NOT in lobby
    if (
      gameState.gameId &&
      gameState.players.length === 2 &&
      gameState.gamePhase !== 'lobby'
    ) {
      if (pollingRef.current) clearInterval(pollingRef.current);

      pollingRef.current = setInterval(async () => {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .eq('pin', gameState.gameId)
          .maybeSingle();

        if (!error && data) {
          // Only update if gameState is present in db
          if (data.gameState && JSON.stringify(data.gameState) !== JSON.stringify(gameState)) {
            onUpdateGame(data.gameState as Partial<GameState>);
          }
          // Handle toast events targeted to this player
          const events = (data.gameState?.toastEvents || []) as { id: string; targetPlayerId: string; message: string }[];
          if (events.length && localPlayerId) {
            const myEvents = events.filter(e => e.targetPlayerId === localPlayerId);
            if (myEvents.length) {
              myEvents.forEach(e => {
                toast({ title: "Round Result", description: e.message, duration: 3000 });
              });
              const remaining = events.filter(e => e.targetPlayerId !== localPlayerId);
              // remove delivered events from shared state
              onUpdateGame({ toastEvents: remaining });
            }
          }
        }
      }, 2000);
    }

    return () => {
      // Clear polling interval when unmounting or returning to lobby
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [gameState.gameId, gameState.players.length, gameState.gamePhase]);

  // --- GAME STATE UPDATE TO DB when local changes ---
  useEffect(() => {
    // Only update db if in game (not lobby)
    if (
      gameState.gameId &&
      gameState.players.length === 2 &&
      gameState.gamePhase !== 'lobby'
    ) {
      // Save latest gameState to Supabase
      supabase
        .from('games')
        .update({ gameState: gameState as any })
        .eq('pin', gameState.gameId)
        .then();
    }
  }, [gameState]); // save whenever gameState changes

  // --- PHASE: BETTING ---
  const placeBet = () => {
    setBetError(null);
    if (betAmount < 1 || betAmount > maxAllowedBet) {
      setBetError(
        `Bet must be between 1 and ${maxAllowedBet}, based on each player's available points.`
      );
      return;
    }
    onUpdateGame({
      currentBet: {
        playerId: currentPlayer.id,
        number: betNumber,
        amount: betAmount,
      },
      gamePhase: 'guessing',
      gameLog: [
        ...gameState.gameLog,
        `${currentPlayer.name} placed a bet.`,
      ]
    });
  };

  // --- PHASE: GUESSING ---
  const makeGuess = (guessValue: 'even' | 'odd') => {
    if (!gameState.currentBet) return;

    const isEven = gameState.currentBet.number % 2 === 0;
    const isCorrect = (isEven && guessValue === 'even') || (!isEven && guessValue === 'odd');
    const newPlayers = [...gameState.players];
    const bettorIdx = gameState.players.findIndex(p => p.id === gameState.currentBet!.playerId);
    const guesserIdx = 1 - bettorIdx;
    const betAmountVal = gameState.currentBet.amount;

    // If correct, guesser gets bet from bettor; If wrong, bettor gets from guesser
    if (isCorrect) {
      newPlayers[bettorIdx].points -= betAmountVal;
      newPlayers[guesserIdx].points += betAmountVal;
    } else {
      newPlayers[guesserIdx].points -= betAmountVal;
      newPlayers[bettorIdx].points += betAmountVal;
    }

    // Prevent negative points
    newPlayers.forEach(player => { if (player.points < 0) player.points = 0; });

    const resultText = isCorrect ? 'correct' : 'wrong';
    const numberType = isEven ? 'even' : 'odd';
    const afterPoints = `Points: ${newPlayers[0].name}: ${newPlayers[0].points}, ${newPlayers[1].name}: ${newPlayers[1].points}`;

    // Toast notifications for both players
    const guesserName = gameState.players[guesserIdx].name;
    const isCurrentPlayerGuesser = guesserIdx === myIndex;
    const currentPlayerToast = isCorrect
      ? `You guessed correct 🎉 Earned ${betAmountVal} points 🏆`
      : `You guessed wrong ❌ Lost ${betAmountVal} points 😢`;
    const opponentToast = isCorrect
      ? `${guesserName} guessed correct 🎯 You lost ${betAmountVal} points 😢`
      : `${guesserName} guessed wrong ❌ You earned ${betAmountVal} points from them 🏆`;

    // Show toast for the current client immediately
    toast({ title: "Round Result", description: isCurrentPlayerGuesser ? currentPlayerToast : opponentToast, duration: 3000 });

    // Queue toast event for the opponent via shared state so their client will render it
    const opponentId = gameState.players[1 - myIndex].id;
    const existingEvents = gameState.toastEvents || [];
    const newEventId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const newToastEvents = [
      ...existingEvents,
      { id: newEventId, targetPlayerId: opponentId, message: isCurrentPlayerGuesser ? opponentToast : currentPlayerToast }
    ];

    // Check for winner
    const winner = newPlayers.find(p => p.points <= 0 || p.points >= 20)
      ? newPlayers.find(p => p.points >= 20) || newPlayers.find(p => p.points > 0)
      : null;

    onUpdateGame({
      players: newPlayers,
      currentTurn: winner ? gameState.currentTurn : guesserIdx, // always guesser becomes next bettor if not game end
      gamePhase: winner ? 'ended' : 'betting',
      currentBet: null,
      gameLog: [
        ...gameState.gameLog,
        `${gameState.players[guesserIdx].name} guessed ${guessValue} - ${resultText}! (${gameState.currentBet.number} is ${numberType})`,
        afterPoints
      ],
      winner: winner || null,
      toastEvents: newToastEvents
    });
    setBetAmount(1); // reset for next round
    setBetNumber(0);
  };

  const restartGame = () => {
    const resetPlayers = gameState.players.map(player => ({ ...player, points: 10 }));
    onUpdateGame({
      players: resetPlayers,
      currentTurn: 0,
      gamePhase: 'betting',
      currentBet: null,
      gameLog: ['Game restarted!'],
      winner: null
    });
  };

  const backToLobby = () => {
    onUpdateGame({
      gameId: '',
      players: [],
      currentTurn: 0,
      gamePhase: 'lobby',
      currentBet: null,
      gameLog: [],
      winner: null
    });
  };

  if (gameState.gamePhase === 'ended') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="text-center">
            <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
            <CardTitle className="text-2xl text-white">Game Over!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-xl text-green-400 font-bold">
              {gameState.winner?.name} Wins!
            </p>
            <div className="space-y-2">
              <Button onClick={restartGame} className="w-full bg-green-600 hover:bg-green-700">
                <RotateCcw className="h-4 w-4 mr-2" />
                Play Again
              </Button>
              <Button onClick={backToLobby} variant="outline" className="w-full">
                Back to Lobby
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 space-y-4 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center space-x-8">
            {gameState.players.map((player, index) => (
              <div key={player.id} className={`text-center ${index === gameState.currentTurn ? 'text-yellow-400' : 'text-white'}`}>
                <div className="font-semibold">{player.name}</div>
                <div className="flex items-center justify-center">
                  <Coins className="h-4 w-4 mr-1" />
                  {player.points}
                </div>
                {index === myIndex && <div className="text-xs text-blue-300">(You)</div>}
              </div>
            ))}
          </div>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-center">
              {gameState.gamePhase === 'betting'
                ? `${currentPlayer.name}'s Turn - Place Bet`
                : `${otherPlayer.name}'s Turn - Make Guess`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {gameState.gamePhase === 'betting' ? (
              isMyTurn ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-white mb-2">Choose Number (1-9)</label>
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <Button
                          key={num}
                          onClick={() => setBetNumber(num)}
                          variant={betNumber === num ? "default" : "outline"}
                          className="aspect-square"
                        >
                          {num}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-white mb-2">
                      Bet Amount (Max: {maxAllowedBet})
                    </label>
                    <Input
                      type="number"
                      min={1}
                      max={maxAllowedBet}
                      value={betAmount}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setBetAmount(val > maxAllowedBet ? maxAllowedBet : val);
                      }}
                      className="bg-white/20 border-white/30 text-white"
                    />
                    {betError && (
                      <div className="text-red-400 mt-1 text-sm">{betError}</div>
                    )}
                  </div>
                  <Button
                    onClick={placeBet}
                    disabled={betAmount > maxAllowedBet || betAmount < 1}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Place Bet
                  </Button>
                </div>
              ) : (
                <div className="text-center text-white text-lg py-8">
                  Waiting for {currentPlayer.name} to place a bet...
                </div>
              )
            ) : (
              // Guessing phase
              !isMyTurn ? (
                <div className="space-y-4">
                  <div className="text-center text-white">
                    <p className="mb-4">
                      {currentPlayer.name} placed a bet.
                    </p>
                    <p className="text-lg font-semibold">Guess: Is the number even or odd?</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={() => makeGuess('even')}
                      className="bg-green-600 hover:bg-green-700 py-8 text-lg"
                    >
                      EVEN
                    </Button>
                    <Button
                      onClick={() => makeGuess('odd')}
                      className="bg-red-600 hover:bg-red-700 py-8 text-lg"
                    >
                      ODD
                    </Button>
                  </div>
                  {gameState.currentBet && (
                    <p className="mt-4 text-center text-white/60">
                      <span className="font-bold">Bet Amount:</span> {gameState.currentBet.amount}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center text-white text-lg py-8">
                  Waiting for {otherPlayer.name} to guess...
                </div>
              )
            )}
          </CardContent>
        </Card>

        {/* Game Log */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mt-4">
          <CardHeader>
            <CardTitle className="text-white">Game Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {gameState.gameLog.map((log, index) => (
                <div key={index} className="text-sm text-white/80 p-2 bg-white/5 rounded">
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GameBoard;

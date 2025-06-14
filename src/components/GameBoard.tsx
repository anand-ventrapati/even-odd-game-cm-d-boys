
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Trophy, RotateCcw } from 'lucide-react';
import { GameState, Bet } from '@/types/game';

interface GameBoardProps {
  gameState: GameState;
  onUpdateGame: (newState: Partial<GameState>, playerId?: string) => void;
  localPlayerId: string | null;
}

const GameBoard = ({ gameState, onUpdateGame, localPlayerId }: GameBoardProps) => {
  const [betNumber, setBetNumber] = useState(0);
  const [betAmount, setBetAmount] = useState(1);
  // not managing guess state here; handled via game state

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

  // betting phase: show bet UI to current player, block for other
  // guessing phase: show guess UI to opponent, block for current

  const placeBet = () => {
    if (betAmount > currentPlayer.points || betAmount < 1) return;
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

  const makeGuess = (guessValue: 'even' | 'odd') => {
    if (!gameState.currentBet) return;

    const isEven = gameState.currentBet.number % 2 === 0;
    const isCorrect = (isEven && guessValue === 'even') || (!isEven && guessValue === 'odd');
    const newPlayers = [...gameState.players];
    const betAmount = gameState.currentBet.amount;
    if (isCorrect) {
      newPlayers[otherIndex].points += betAmount;
      newPlayers[myIndex].points -= betAmount;
    } else {
      newPlayers[myIndex].points += betAmount;
      newPlayers[otherIndex].points -= betAmount;
    }
    const resultText = isCorrect ? 'correct' : 'wrong';
    const numberType = isEven ? 'even' : 'odd';
    const newLog = [
      ...gameState.gameLog,
      `${otherPlayer.name} guessed ${guessValue} - ${resultText}! (${gameState.currentBet.number} is ${numberType})`
    ];

    // Check for winner
    const winner = newPlayers.find(p => p.points <= 0 || p.points >= 20)
      ? newPlayers.find(p => p.points >= 20) || newPlayers.find(p => p.points > 0)
      : null;

    onUpdateGame({
      players: newPlayers,
      currentTurn: winner ? gameState.currentTurn : otherIndex,
      gamePhase: winner ? 'ended' : 'betting',
      currentBet: null,
      gameLog: newLog,
      winner: winner || null
    });
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
    <div className="min-h-screen p-4 space-y-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Game PIN: {gameState.gameId}</h1>
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
                  <label className="block text-white mb-2">Choose Number (0-9)</label>
                  <div className="grid grid-cols-5 gap-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
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
                  <label className="block text-white mb-2">Bet Amount (Max: {currentPlayer.points})</label>
                  <Input
                    type="number"
                    min="1"
                    max={currentPlayer.points}
                    value={betAmount}
                    onChange={(e) => setBetAmount(Number(e.target.value))}
                    className="bg-white/20 border-white/30 text-white"
                  />
                </div>
                <Button
                  onClick={placeBet}
                  disabled={betAmount > currentPlayer.points || betAmount < 1}
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
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
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
  );
};

export default GameBoard;

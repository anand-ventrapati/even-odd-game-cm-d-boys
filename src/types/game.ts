
export interface Player {
  id: string;
  name: string;
  points: number;
}

export interface Bet {
  playerId: string;
  number: number;
  amount: number;
}

export interface GameState {
  gameId: string;
  players: Player[];
  currentTurn: number;
  gamePhase: 'lobby' | 'betting' | 'guessing' | 'ended';
  currentBet: Bet | null;
  gameLog: string[];
  winner: Player | null;
}


import { useState, useEffect } from 'react';
import GameLobby from '@/components/GameLobby';
import GameBoard from '@/components/GameBoard';
import { GameState } from '@/types/game';
import { useSupabaseGameSync } from '@/hooks/useSupabaseGameSync';

const initialLocalState: GameState = {
  gameId: '',
  players: [],
  currentTurn: 0,
  gamePhase: 'lobby',
  currentBet: null,
  gameLog: [],
  winner: null
};

const Index = () => {
  // Maintain local state of gameId, playerId, and player role
  const [localPlayerId, setLocalPlayerId] = useState<string | null>(null);
  const [localGameId, setLocalGameId] = useState<string>('');

  // Sync state from Supabase, if in game
  const {
    syncedState,
    setRemoteState,
    isSyncing
  } = useSupabaseGameSync(localGameId && localGameId.length > 0 ? localGameId : null);

  // When game starts (from GameLobby), store in DB and switch to board
  const handleGameStart = (gameState: Partial<GameState>, playerId: string) => {
    setLocalPlayerId(playerId);
    setLocalGameId(gameState.gameId ?? '');
    // Save remote initial state on host (creates gameState in supabase)
    setRemoteState({ ...initialLocalState, ...gameState });
  };

  // Always display the synced state if exists, else initial state
  const activeState: GameState =
    syncedState ??
    {
      ...initialLocalState,
      gameId: localGameId
    };

  // Used by GameBoard to update the game; always sync to Supabase if in multiplayer
  const updateGameState = (newState: Partial<GameState>, playerId?: string) => {
    if (localGameId) {
      setRemoteState(newState);
    }
    if (playerId) setLocalPlayerId(playerId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {activeState.gamePhase === 'lobby' ? (
        <GameLobby onGameStart={handleGameStart} />
      ) : (
        <GameBoard
          gameState={activeState}
          onUpdateGame={updateGameState}
          localPlayerId={localPlayerId}
        />
      )}
      {isSyncing && (
        <div className="fixed bottom-3 right-3 p-2 rounded bg-white/70 shadow text-blue-700 z-50 text-xs">
          Syncing...
        </div>
      )}
    </div>
  );
};

export default Index;

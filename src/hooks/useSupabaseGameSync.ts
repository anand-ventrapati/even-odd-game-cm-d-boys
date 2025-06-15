
import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GameState } from "@/types/game";

type UseSupabaseGameSyncReturn = {
  syncedState: GameState | null;
  setRemoteState: (next: Partial<GameState>) => Promise<void>;
  isSyncing: boolean;
};

export function useSupabaseGameSync(pin: string | null): UseSupabaseGameSyncReturn {
  const [syncedState, setSyncedState] = useState<GameState | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Initial load
  useEffect(() => {
    if (!pin) return;
    setIsSyncing(true);
    supabase
      .from("games")
      .select("gameState")
      .eq("pin", pin)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data && data.gameState) {
          setSyncedState(data.gameState as GameState);
        }
        setIsSyncing(false);
      });
  }, [pin]);

  // Realtime subscribe to changes
  useEffect(() => {
    if (!pin) return;

    // Clean up any previous channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`realtime:games:pin=${pin}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "games",
          filter: `pin=eq.${pin}`,
        },
        (payload) => {
          const newGameState = payload.new.gameState as GameState | null;
          if (newGameState) setSyncedState(newGameState);
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [pin]);

  // Write game state to Supabase
  const setRemoteState = useCallback(
    async (next: Partial<GameState>) => {
      if (!pin) return;
      setIsSyncing(true);
      // Merge with existing state
      const newGameState = { ...syncedState, ...next };
      await supabase
        .from("games")
        .update({ gameState: newGameState })
        .eq("pin", pin);
      setIsSyncing(false);
      // Note: The realtime callback will update syncedState, so no need to set it here
    },
    [pin, syncedState]
  );

  return { syncedState, setRemoteState, isSyncing };
}

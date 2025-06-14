
import React, { createContext, useContext, useState } from "react";

type PlayerMode = "player1" | "player2" | null;

interface PlayerModeContextProps {
  playerMode: PlayerMode;
  setPlayerMode: (mode: PlayerMode) => void;
}

const PlayerModeContext = createContext<PlayerModeContextProps | undefined>(undefined);

export const PlayerModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [playerMode, setPlayerMode] = useState<PlayerMode>(null);
  return (
    <PlayerModeContext.Provider value={{ playerMode, setPlayerMode }}>
      {children}
    </PlayerModeContext.Provider>
  );
};

export function usePlayerMode() {
  const ctx = useContext(PlayerModeContext);
  if (!ctx) throw new Error("usePlayerMode must be used within PlayerModeProvider");
  return ctx;
}

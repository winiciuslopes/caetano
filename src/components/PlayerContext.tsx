import { createContext, useContext, ReactNode } from 'react';
import { Player } from '../lib/mockData';

interface PlayerContextType {
  currentPlayer: Player;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children, player }: { children: ReactNode; player: Player }) {
  return (
    <PlayerContext.Provider value={{ currentPlayer: player }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}

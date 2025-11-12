import { createContext, useContext, ReactNode } from 'react';
import { Perfil } from '../lib/supabaseClient';

interface PlayerContextType {
  currentPlayer: Perfil;
  tokenFamiliar: string;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProviderSupabase({ 
  children, 
  player,
  tokenFamiliar 
}: { 
  children: ReactNode; 
  player: Perfil;
  tokenFamiliar: string;
}) {
  return (
    <PlayerContext.Provider value={{ currentPlayer: player, tokenFamiliar }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayerSupabase() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayerSupabase must be used within a PlayerProviderSupabase');
  }
  return context;
}

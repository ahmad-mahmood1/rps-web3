import { GameMove } from '@/types';
import { Address } from 'viem';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type GameStoreState = {
  gameAddress: Address | null;
  salt: number | null;
  move: GameMove | null;
};

type GameStore = {
  setGameStore: (data: Partial<GameStoreState>) => void;
  removeGameStore: () => void;
} & GameStoreState;

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      gameAddress: null,
      salt: null,
      move: null,
      setGameStore: (data) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { setGameStore, removeGameStore, ...rest } = get();

        set({ ...rest, ...data });
      },
      removeGameStore: () => set({ gameAddress: null, salt: null, move: null }),
    }),
    {
      name: 'game-store',
    },
  ),
);

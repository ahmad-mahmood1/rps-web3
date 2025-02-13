import { MOVES } from '@/constants';
import { GameMove, GameMoveValue } from '@/types';
import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getGameMoveValue = (move: GameMove): GameMoveValue => {
  return MOVES[move];
};

export const formatTime = (timeInSeconds: number) => {
  const seconds = timeInSeconds % 60;
  const minutes = Math.floor(timeInSeconds / 60);

  return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

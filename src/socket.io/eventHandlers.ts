import { EVENTS } from '@/constants';
import { socket } from '@/socket.io/socket';
import { GameResult } from '@/types';
import { Address } from 'viem';

export const emitCreateGameResult = (gameData: GameResult) => {
  socket.emit(EVENTS.CREATE_GAME_RESULT, gameData);
};

export const emitUpdateGame = (gameAddress: Address) => {
  socket.emit(EVENTS.UPDATE_GAME, gameAddress);
};

export const emitJoinGame = (gameAddress: Address, message: string) => {
  socket.emit(EVENTS.PLAYER_JOINED, { message, gameAddress });
};

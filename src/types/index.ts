import { GAME_STATUS, MOVES } from '@/constants';
import { Address } from 'viem';

export type HashedMove = {
  hashedMove: number;
  salt: number;
};

export type GameMove = keyof typeof MOVES;
export type GameMoveValue = (typeof MOVES)[keyof typeof MOVES];

export type ContractStateKeys = 'j1' | 'j2' | 'c1Hash' | 'c2' | 'stake' | 'lastAction';

export type GameStateKeys = 'p1Address' | 'p2Address' | 'p1HashedMove' | 'p2Move' | 'stake' | 'lastActionTime';

export type GameFunctions = 'play' | 'solve' | 'j1Timeout' | 'j2Timeout';

type FunctionArgsMap = {
  play: [number];
  solve: [number, number];
  j1Timeout: [];
  j2Timeout: [];
};

export type FunctionArgs<T extends GameFunctions> = T extends keyof FunctionArgsMap ? FunctionArgsMap[T] : never;

export type RPSGameStateReturnTypes = Address | bigint | GameMoveValue | void | undefined | null;
export type RPSContractState = Record<GameStateKeys, RPSGameStateReturnTypes>;

export type Player = 'P1' | 'P2';

export type GameStatus = (typeof GAME_STATUS)[keyof typeof GAME_STATUS];
export type GameOutcomeStatus =
  | typeof GAME_STATUS.P1_WON
  | typeof GAME_STATUS.P2_WON
  | typeof GAME_STATUS.P1_TIMEDOUT
  | typeof GAME_STATUS.P2_TIMEDOUT
  | typeof GAME_STATUS.TIE
  | typeof GAME_STATUS.RESOLVED;

export type GameResult = {
  p1Move?: GameMove | '';
  p2Move?: GameMove | '';
  gameAddress: Address;
  result: GameOutcomeStatus;
};

import { ContractStateKeys, GameStateKeys } from '@/types';
import { ReadyState } from 'react-use-websocket';
import { Address } from 'viem';

const HASH_URL = '/hash';
const GAME_RESULT_URL = '/gameResults';
const CONTRACT_URL = '/contract';

export const ENDPOINTS = {
  GENERATE_HASH: `${HASH_URL}/generate`,
  GET_GAME_RESULT: (gameAddress: Address) => `${GAME_RESULT_URL}/${gameAddress}`,
  GET_LATEST_TRANSACTION: (gameAddress: Address) => `${CONTRACT_URL}/latest-transaction/${gameAddress}`,
};

export const EVENTS = {
  PLAYER_JOINED: 'player_joined',
  CREATE_GAME_RESULT: 'create_game_result',
  UPDATE_GAME: 'update_game',
  GAME_UPDATED: 'game_updated',
};

export const ROUTES = {
  HOME: '/',
  CREATE_GAME: '/create-game',
  ENTER_GAME: '/enter-game',
  ACTIVE_GAME_ROOM: '/active-game-room/:gameAddress',
};

export const MOVES = {
  ROCK: 1,
  PAPER: 2,
  SCISSORS: 3,
  SPOCK: 4,
  LIZARD: 5,
} as const;

export const CONNECTION_STATUS = {
  [ReadyState.CONNECTING]: 'Connecting',
  [ReadyState.OPEN]: 'Open',
  [ReadyState.CLOSING]: 'Closing',
  [ReadyState.CLOSED]: 'Closed',
  [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
};

export const GAME_STATE_VARIABLES: Record<ContractStateKeys, GameStateKeys> = {
  j1: 'p1Address',
  j2: 'p2Address',
  c1Hash: 'p1HashedMove',
  c2: 'p2Move',
  stake: 'stake',
  lastAction: 'lastActionTime',
} as const;

export const GAME_STATUS = {
  P1_WON: 'p1_won',
  P2_WON: 'p2_won',
  P1_TIMEDOUT: 'p1_timedout',
  P2_TIMEDOUT: 'p2_timedout',
  TIE: 'tie',
  PENDING_P2: 'pending_p2',
  PENDING_P1: 'pending_p1',
  RESOLVED: 'resolved',
} as const;

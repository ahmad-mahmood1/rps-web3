import useLatestTransaction from '@/api/contractTransactionApi';
import { useGetGameResult } from '@/api/gameRoomApi';
import { GAME_STATUS } from '@/constants';
import { useReadRPSContractState } from '@/hooks/rps/useReadRPSContractState';
import { GameFunctions, GameStatus } from '@/types';
import { Address } from 'viem';

export const useGameStatus = (
  gameAddress: Address | undefined,
): { gameStatus: GameStatus; isLoadingGameStatus: boolean } => {
  const { data: latestTransaction, isLoading: isLoadingTransaction } = useLatestTransaction(gameAddress);

  const { data: gameRoomData, isLoading: isLoadingContractState } = useReadRPSContractState(gameAddress);

  const { data: gameResult, isLoading: isLoadingGameResult } = useGetGameResult(gameAddress);

  let gameStatus: GameStatus = GAME_STATUS.PENDING_P2;

  if (gameResult) {
    gameStatus = gameResult.result;
  } else if (gameRoomData && latestTransaction) {
    const lastFunction: GameFunctions = latestTransaction.functionName?.split('(')[0];
    const { stake, p2Move } = gameRoomData;

    // P2 has yet to choose their move
    if (!p2Move) {
      gameStatus = GAME_STATUS.PENDING_P2;
      // Stake is 0 in case of three function calls: j1, j2 timeout and solve
    } else if (stake === 0n) {
      if (lastFunction === 'j2Timeout') {
        gameStatus = GAME_STATUS.P2_TIMEDOUT;
      }
      if (lastFunction === 'j1Timeout') {
        gameStatus = GAME_STATUS.P1_TIMEDOUT;
      }

      gameStatus = GAME_STATUS.RESOLVED;
    } else {
      gameStatus = GAME_STATUS.PENDING_P1;
    }
  }

  return { gameStatus, isLoadingGameStatus: isLoadingContractState || isLoadingTransaction || isLoadingGameResult };
};

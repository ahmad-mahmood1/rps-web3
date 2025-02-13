import { Loading } from '@/components/common/loading';
import { Button } from '@/components/ui/button';
import { GAME_STATUS, MOVES } from '@/constants';
import { useBlockNavigation } from '@/hooks/rps/useBlockNavigation';
import { useGameStatus } from '@/hooks/rps/useGameStatus';
import { useReadRPSContractState } from '@/hooks/rps/useReadRPSContractState';
import { useTimeElapsedLastAction } from '@/hooks/rps/useTimeElapsedLastAction';
import { useWin } from '@/hooks/rps/useWin';
import { useWriteRPSContract } from '@/hooks/rps/useWriteRPSContract';
import { formatTime, getGameMoveValue } from '@/lib/utils';
import { emitCreateGameResult } from '@/socket.io/eventHandlers';
import { GameMove, GameMoveValue, RPSContractState } from '@/types';
import { useGameStore } from '@/zustand/gameStore';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

export const Actions = ({ gameAddress, gameRoomData }: { gameAddress: Address; gameRoomData: RPSContractState }) => {
  const { p1Address, p2Address, p2Move } = gameRoomData;
  const { address: userAddress } = useAccount();

  const { isLoading: isLoadingRPSContractData } = useReadRPSContractState(gameAddress);
  const { timer } = useTimeElapsedLastAction(gameAddress);

  const { gameStatus } = useGameStatus(gameAddress);
  const { salt, move: p1MoveKey } = useGameStore();

  const { data: gameResult } = useWin({
    contractAddress: gameAddress,
    p1Move: p1MoveKey ? getGameMoveValue(p1MoveKey) : undefined,
    p2Move: (p2Move as GameMoveValue) ?? undefined,
  });

  const onSolveSuccess = () => {
    const p2MoveKey = Object.keys(MOVES).find((key) => MOVES[key as GameMove] === p2Move) as GameMove;
    emitCreateGameResult({
      gameAddress,
      p1Move: p1MoveKey as GameMove,
      p2Move: p2Move ? p2MoveKey : undefined,
      // In case useWin call fails we can simply mark the game resolved
      result: gameResult ?? GAME_STATUS.RESOLVED,
    });
  };

  const onP2Timeout = () => {
    emitCreateGameResult({
      gameAddress,
      result: 'p2_timedout',
    });
  };

  const onP1Timeout = () => {
    emitCreateGameResult({
      gameAddress,
      result: 'p1_timedout',
    });
  };

  const { handleWriteContract: handleP1Timeout, isFetching: isFetchingP1Timeout } = useWriteRPSContract(
    'j1Timeout',
    gameAddress,
    onP1Timeout,
  );

  const { handleWriteContract: handleP2Timeout, isFetching: isFetchingP2Timeout } = useWriteRPSContract(
    'j2Timeout',
    gameAddress,
    onP2Timeout,
  );

  const { handleWriteContract: handleSolvegame, isFetching: isFetchingSolveGame } = useWriteRPSContract(
    'solve',
    gameAddress,
    onSolveSuccess,
  );

  const isP1 = p1Address === userAddress;
  const isP2 = p2Address === userAddress;

  // Since a single button is shown in any case we can consolidate the loading states
  const showActionLoading = isFetchingP1Timeout || isFetchingP2Timeout || isFetchingSolveGame;
  const isLoadingUI = isLoadingRPSContractData;

  useBlockNavigation(showActionLoading || isLoadingRPSContractData);

  if (isLoadingUI) return <Loading />;

  if (isP1) {
    if (gameStatus === 'pending_p1' && p1MoveKey && salt)
      return timer === 0 ? (
        <p>You took too long. Stakes will be transferred to opponent.</p>
      ) : (
        <>
          <Button disabled={showActionLoading} onClick={() => handleSolvegame([getGameMoveValue(p1MoveKey), salt])}>
            {showActionLoading ? <Loading /> : 'Solve Game'}
          </Button>
          <p>
            Resolve the game in <strong>{formatTime(timer)}</strong> or else the stake will be transferred to opponent.
          </p>
        </>
      );

    if (!p2Move) {
      return (
        <>
          <Button
            disabled={showActionLoading || timer !== 0}
            onClick={() => {
              handleP2Timeout([]);
            }}
          >
            {showActionLoading ? <Loading /> : 'Timeout Opponent'}
          </Button>
          <p>
            You can timeout the opponent in <strong>{formatTime(timer)}</strong> if they do not choose a move and get
            your funds back
          </p>
        </>
      );
    }
  }

  if (isP2 && p2Move) {
    return (
      <>
        <Button
          onClick={() => {
            handleP1Timeout([]);
          }}
          disabled={timer !== 0 || showActionLoading}
        >
          {showActionLoading ? <Loading /> : 'Timeout Opponent'}
        </Button>
        <p>
          You will be able to timeout the opponent in <strong>{formatTime(timer)}</strong> and get the total stake
        </p>
      </>
    );
  }

  return null;
};

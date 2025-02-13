import { useGetGameResult } from '@/api/gameRoomApi';
import { Loading } from '@/components/common/loading';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';
import { useGameStatus } from '@/hooks/rps/useGameStatus';
import { GameStatus, RPSContractState } from '@/types';
import { useGameStore } from '@/zustand/gameStore';
import { LuArrowLeft } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

function GameResult({ gameAddress, gameRoomData }: { gameAddress: Address; gameRoomData: RPSContractState }) {
  const navigate = useNavigate();
  const removeGameStore = useGameStore((state) => state.removeGameStore);

  const { address: userAddress } = useAccount();

  const { data: gameResult, isLoading } = useGetGameResult(gameAddress);
  const { gameStatus, isLoadingGameStatus } = useGameStatus(gameAddress);

  const { p1Address, p2Address } = gameRoomData;

  const isP1 = userAddress === p1Address;
  const isP2 = userAddress === p2Address;

  const getPlayerMove = () => {
    if (isP1) return gameResult?.p1Move;
    if (isP2) return gameResult?.p2Move;
    return '';
  };

  const getOpponentsMove = () => {
    if (isP1) return gameResult?.p2Move;
    if (isP2) return gameResult?.p1Move;
    return '';
  };

  const isTimedOut = gameResult?.result === 'p1_timedout' || gameResult?.result === 'p2_timedout';

  const resultStatement = (gameStatus: GameStatus) => {
    if (gameStatus === 'resolved') return 'This game has been resolved';
    if (gameStatus === 'tie') return 'Game Tied';

    if (gameStatus === 'p1_won') return isP1 ? 'You Win' : 'You Lose';
    if (gameStatus === 'p2_won') return isP2 ? 'You Win' : 'You Lose';
    if (gameStatus === 'p1_timedout')
      return isP1
        ? 'You failed to resolve the game in time. Stakes have been transferred to the Opponent'
        : 'Game host failed to resolve the game. Stakes have been transferred to you.';
    if (gameStatus === 'p2_timedout')
      return isP1
        ? 'Opponent did not respond in time. Your stake has been transferred back to you.'
        : 'You did not choose a move in time. Game host has closed the game';
  };

  const navigateHome = () => {
    navigate(ROUTES.HOME);
    removeGameStore();
  };

  if (isLoading || isLoadingGameStatus) return <Loading />;

  // Fallback to reading contract state game status in case of BE not reflecting the game state
  return (
    <div className='flex flex-col items-center space-y-3'>
      {gameResult ? (
        <>
          {!isTimedOut && (
            <p>
              Your move: <strong>{getPlayerMove()}</strong>
            </p>
          )}
          {!isTimedOut && (
            <p>
              Opponent's move: <strong>{getOpponentsMove()}</strong>
            </p>
          )}
          <p className='font-semibold'>{resultStatement(gameResult.result)}</p>
        </>
      ) : gameStatus ? (
        <>{resultStatement(gameStatus)}</>
      ) : (
        <div>No game found</div>
      )}
      <Button variant='secondary' onClick={navigateHome}>
        <LuArrowLeft />
        HOME
      </Button>
    </div>
  );
}

export default GameResult;

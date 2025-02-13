import { Loading } from '@/components/common/loading';
import { Actions } from '@/components/game-room/actions';
import GameResult from '@/components/game-room/game-result';
import { Player1 } from '@/components/game-room/player1';
import { Player2 } from '@/components/game-room/player2';
import { Separator } from '@/components/ui/separator';
import { useGameStatus } from '@/hooks/rps/useGameStatus';
import { useReadRPSContractState } from '@/hooks/rps/useReadRPSContractState';
import { cn } from '@/lib/utils';
import { emitJoinGame } from '@/socket.io/eventHandlers';
import { useEffect, useRef } from 'react';
import { LuCopy } from 'react-icons/lu';
import { useParams } from 'react-router-dom';
import { Address, formatEther, isAddress } from 'viem';
import { useAccount } from 'wagmi';

function ActiveGameRoom() {
  const { address: userAddress } = useAccount();
  const { gameAddress } = useParams<{ gameAddress: Address }>();
  const userJoined = useRef(false);

  const {
    data: gameRoomData,
    isLoading: isLoadingGameRoom,
    error: errorGameRoom,
  } = useReadRPSContractState(gameAddress);

  const { gameStatus, isLoadingGameStatus } = useGameStatus(gameAddress);

  const isP1 = userAddress === gameRoomData?.p1Address;
  const isP2 = userAddress === gameRoomData?.p2Address;

  useEffect(() => {
    if (gameRoomData && userAddress && !userJoined.current && gameAddress) {
      userJoined.current = true;
      if (gameRoomData.stake !== 0n && (isP1 || isP2))
        emitJoinGame(gameAddress, isP1 ? 'Player 1 Joined' : 'Player 2 Joined');
    }
  }, [gameRoomData, userAddress, gameAddress]);

  if (isLoadingGameRoom || isLoadingGameStatus) {
    return <Loading />;
  }

  if (errorGameRoom) {
    return <div>{errorGameRoom.message}</div>;
  }

  if (!gameRoomData || !gameAddress || !isAddress(gameAddress)) {
    return <div>No Game with the given address found!</div>;
  }

  if (gameRoomData.p1Address !== userAddress && gameRoomData.p2Address !== userAddress) {
    return <div>You are not a part of this game!</div>;
  }

  if (gameStatus !== 'pending_p1' && gameStatus !== 'pending_p2') {
    return <GameResult gameAddress={gameAddress} gameRoomData={gameRoomData} />;
  }

  return (
    <div className='space-y-6 border border-slate-300 rounded-2xl px-4 py-8'>
      <h3 className='font-bold flex items-center gap-0.5'>
        Contract Address: {gameAddress}{' '}
        <LuCopy
          className='cursor-pointer'
          onClick={() => {
            navigator.clipboard.writeText(gameAddress);
          }}
        />{' '}
      </h3>
      <>
        {!!gameRoomData.stake && (
          <p className='font-semibold'>
            Total Stake: {parseFloat(formatEther(gameRoomData.stake as bigint)) * 2} (ETH)
          </p>
        )}
        <div className='flex items-stretch'>
          <Player1 gameRoomData={gameRoomData} />
          <Separator orientation='vertical' className='h-80 mx-4' />
          <Player2 gameRoomData={gameRoomData} gameAddress={gameAddress} />
        </div>

        <div className={cn('text-left space-y-3', isP2 && 'text-right')}>
          <Actions gameAddress={gameAddress} gameRoomData={gameRoomData} />
        </div>
      </>
    </div>
  );
}

export default ActiveGameRoom;

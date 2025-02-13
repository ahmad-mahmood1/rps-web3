import GameMoves from '@/components/common/game-moves';
import { Loading } from '@/components/common/loading';
import { Button } from '@/components/ui/button';
import { MOVES } from '@/constants';
import { useReadRPSContractState } from '@/hooks/rps/useReadRPSContractState';
import { useWriteRPSContract } from '@/hooks/rps/useWriteRPSContract';
import { emitUpdateGame } from '@/socket.io/eventHandlers';
import { GameMove, RPSContractState } from '@/types';
import { useState } from 'react';
import { Address } from 'viem';
import { useAccount } from 'wagmi';

export function Player2({ gameRoomData, gameAddress }: { gameRoomData: RPSContractState; gameAddress: Address }) {
  const { address: userAddress } = useAccount();
  const { p1Address, p2Move, p2Address } = gameRoomData;

  const [selectedMove, setSelectedMove] = useState<GameMove | undefined>(undefined);

  const { data, isLoading: isLoadingRPSContractData, refetch } = useReadRPSContractState(gameAddress);

  const [socketLoadingState, setSocketLoadingState] = useState(false);

  const { handleWriteContract, isFetching } = useWriteRPSContract(
    'play',
    gameAddress,
    () => {
      refetch();
      emitUpdateGame(gameAddress);
    },
    () => setSocketLoadingState(false),
  );

  const isP1 = p1Address === userAddress;
  const isP2 = p2Address === userAddress;

  const p2MoveKey = data?.p2Move ? Object.keys(MOVES).find((key) => MOVES[key as GameMove] === data.p2Move) : null;

  if (isLoadingRPSContractData) return <Loading />;

  const renderForP1 = () => {
    if (!p2Move) return <div className='test'>Waiting for Player 2 to make a Move</div>;

    return <div>{p2MoveKey}</div>;
  };

  const renderForP2 = () => {
    return !p2Move ? (
      <div className='space-y-3'>
        <GameMoves selectedMove={selectedMove} setSelectedMove={setSelectedMove} />
        <Button
          disabled={!data?.stake || !selectedMove || socketLoadingState}
          onClick={() => {
            if (selectedMove && data?.stake) {
              setSocketLoadingState(true);
              handleWriteContract([MOVES[selectedMove]], data?.stake as bigint);
            }
          }}
        >
          {isFetching || socketLoadingState ? <Loading /> : 'Commit Move'}
        </Button>
      </div>
    ) : (
      <div>{p2MoveKey}</div>
    );
  };

  return (
    <div className='flex flex-col flex-1 w-full'>
      <p className='text-left font-bold'>{isP2 ? 'You' : 'Opponent'}</p>
      <div className='flex flex-col justify-center items-center flex-1'>
        {isP1 && renderForP1()}
        {isP2 && renderForP2()}
      </div>
    </div>
  );
}

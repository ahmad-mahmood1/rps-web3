import { RPSContractState } from '@/types';
import { useGameStore } from '@/zustand/gameStore';
import { useAccount } from 'wagmi';

export function Player1({ gameRoomData }: { gameRoomData: RPSContractState }) {
  const { address: userAddress } = useAccount();
  const { p1Address } = gameRoomData;

  const isP1 = p1Address === userAddress;
  // const showP1Move = ['p1_won', 'p2_won', 'tie', 'pending_p1'].includes(gameRoomData.result);

  const p1Move = useGameStore((state) => state.move);

  return (
    <div className='flex flex-col flex-1 w-full'>
      <p className='text-left font-bold'>{isP1 ? 'You' : 'Opponent'}</p>
      <div className='flex flex-col justify-center items-center flex-1'>
        <p>{isP1 ? p1Move : 'HIDDEN'}</p>
      </div>
    </div>
  );
}

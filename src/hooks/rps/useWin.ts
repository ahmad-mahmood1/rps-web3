import { rpsContract } from '@/contracts/rps';
import { GameMoveValue, GameOutcomeStatus } from '@/types';
import { Address, isAddress } from 'viem';
import { useReadContract } from 'wagmi';

export const useWin = ({
  contractAddress,
  p1Move,
  p2Move,
}: {
  contractAddress: Address | undefined;
  p1Move: GameMoveValue | undefined;
  p2Move: GameMoveValue | undefined;
}) => {
  const result = useReadContract({
    abi: rpsContract.abi,
    functionName: 'win',
    args: [p1Move, p2Move],
    address: contractAddress,
    query: {
      enabled: contractAddress && isAddress(contractAddress) && !!p1Move && !!p2Move,
      select: (result): GameOutcomeStatus => {
        if (p1Move === p2Move) return 'tie';
        if (result) return 'p1_won';
        return 'p2_won';
      },
    },
  });

  return result;
};

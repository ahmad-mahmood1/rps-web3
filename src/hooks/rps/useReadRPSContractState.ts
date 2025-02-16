import { GAME_STATE_VARIABLES } from '@/constants';
import { rpsContract } from '@/contracts/rps';
import { ContractStateKeys, GameStateKeys, RPSContractState, RPSGameStateReturnTypes } from '@/types';
import { useMemo } from 'react';
import { Address, isAddress } from 'viem';
import { useAccount, useReadContracts } from 'wagmi';

export const useReadRPSContractState = (contractAddress: Address | undefined) => {
  const { isConnected } = useAccount();

  const stateContracts = useMemo(
    () =>
      contractAddress
        ? Object.keys(GAME_STATE_VARIABLES).map((key) => ({
            abi: rpsContract.abi,
            bytecode: rpsContract.bytecode,
            address: contractAddress,
            functionName: key,
          }))
        : [],
    [contractAddress],
  );

  const result = useReadContracts({
    contracts: [...stateContracts],
    query: {
      // Only read contract if user's wallet is connected and the contract address is valid
      enabled: contractAddress && isAddress(contractAddress) && isConnected,
      select(data) {
        const contractState = {} as RPSContractState;
        Object.keys(GAME_STATE_VARIABLES).forEach((key, i) => {
          const value = data[i].status === 'success' ? (data[i].result as RPSGameStateReturnTypes) : null;
          contractState[GAME_STATE_VARIABLES[key as ContractStateKeys] as GameStateKeys] = value;
        });

        return contractState;
      },
      refetchInterval: 1000,
    },
  });

  return result;
};

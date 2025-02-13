import { rpsContract } from '@/contracts/rps';
import { useToast } from '@/hooks/useToast';
import { useEffect } from 'react';
import { Address, parseEther } from 'viem';
import { useDeployContract, useTransactionReceipt } from 'wagmi';

type DeployRPSContractParametersType = {
  stake: string;
  player1HashedMove: number;
  player2Address: Address;
};

export const useDeployRPSContract = ({
  onSuccess,
  onError,
}: {
  onSuccess: (contractAddress: Address) => void;
  onError: () => void;
}) => {
  const { toast } = useToast();

  const {
    deployContractAsync,
    data: deploymentTxnHash,
    error: errorContractDeployment,
    isPending: isPendingDeployment,
  } = useDeployContract();

  const {
    data: txnReceipt,
    error: errorTxnReceipt,
    isFetching: isFethcingTxn,
  } = useTransactionReceipt({
    hash: deploymentTxnHash,
    query: {
      enabled: !!deploymentTxnHash,
      refetchInterval(query) {
        return query.state.status === 'success' ? false : 1;
      },
    },
  });

  const handleContractDeployment = async ({
    stake,
    player1HashedMove,
    player2Address,
  }: DeployRPSContractParametersType) => {
    try {
      await deployContractAsync({
        abi: rpsContract.abi,
        bytecode: rpsContract.bytecode,
        args: [player1HashedMove, player2Address],
        value: parseEther(stake),
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      onError();
      toast({
        title: 'Error deploying contract',
        description: errorContractDeployment?.name,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (txnReceipt) {
      if (txnReceipt.status === 'success') onSuccess(txnReceipt.contractAddress as Address);
      else onError();
    }
  }, [txnReceipt, isFethcingTxn]);

  return {
    handleContractDeployment,
    isPending: isFethcingTxn || isPendingDeployment,
    txnReceipt,
    error: [errorContractDeployment, errorTxnReceipt],
  };
};

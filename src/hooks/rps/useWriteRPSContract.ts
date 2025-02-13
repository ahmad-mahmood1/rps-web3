import { rpsContract } from '@/contracts/rps';
import { useToast } from '@/hooks/useToast';
import { FunctionArgs, GameFunctions } from '@/types';
import { useEffect } from 'react';
import { Address } from 'viem';
import { useTransactionReceipt, useWriteContract } from 'wagmi';

export const useWriteRPSContract = <T extends GameFunctions>(
  writeFunction: T,
  contractAddress: Address | undefined,
  onSuccess: () => void,
  onError?: () => void,
) => {
  const { toast } = useToast();
  const { writeContractAsync, data: writeTxn, error: errorWrite, isPending: isPendingWrite } = useWriteContract();

  const {
    data: txnReceipt,
    error: errorTxnReceipt,
    isFetching: isFethcingTxn,
  } = useTransactionReceipt({
    hash: writeTxn,
    query: {
      enabled: !!writeTxn,
      refetchInterval(query) {
        return query.state.status === 'success' ? false : 1;
      },
    },
  });

  const handleWriteContract = async (args: FunctionArgs<T>, value?: bigint) => {
    if (!contractAddress) {
      toast({ title: 'No Contract Address found', variant: 'destructive' });
      return;
    }

    try {
      await writeContractAsync({
        address: contractAddress,
        abi: rpsContract.abi,
        functionName: writeFunction,
        args: args,
        // Play method requires stake
        ...(writeFunction === 'play' && { value }),
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      onError?.();
      toast({
        title: `Error performing transaction - ${writeFunction}`,
        description: errorWrite && errorWrite.name,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (txnReceipt) {
      if (txnReceipt.status === 'success') onSuccess();
      else {
        onError?.();

        toast({
          description: 'Transaction was reverted',
          variant: 'destructive',
        });
      }
    }
  }, [txnReceipt, isFethcingTxn]);

  return {
    txnReceipt,
    error: [errorTxnReceipt, errorWrite],
    isError: !!errorTxnReceipt || !!writeTxn,
    isFetching: isPendingWrite || isFethcingTxn,
    handleWriteContract,
  };
};

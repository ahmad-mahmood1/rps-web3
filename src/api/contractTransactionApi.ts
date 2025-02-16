import axiosClient from '@/lib/network';
import { useQuery } from '@tanstack/react-query';
import { Address } from 'viem';

const CONTRACT_URL = '/contract';

const useLatestTransaction = (gameAddress: Address | undefined) => {
  return useQuery({
    queryKey: ['latestTransaction', gameAddress],
    queryFn: async () => {
      const { data } = await axiosClient.get(`${CONTRACT_URL}/latest-transaction/${gameAddress}`);
      return data;
    },
    enabled: !!gameAddress,
    refetchInterval: 1000,
  });
};

export default useLatestTransaction;

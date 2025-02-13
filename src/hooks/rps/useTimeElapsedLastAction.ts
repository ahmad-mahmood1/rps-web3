import { useReadRPSContractState } from '@/hooks/rps/useReadRPSContractState';
import { useEffect, useState } from 'react';
import { Address } from 'viem';

export const useTimeElapsedLastAction = (activeGameAddress: Address | undefined) => {
  const [timer, setTimer] = useState(0);

  const { data } = useReadRPSContractState(activeGameAddress);

  useEffect(() => {
    if (activeGameAddress) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let intervalId: any;

      if (data?.lastActionTime !== undefined && data.lastActionTime !== null && data.stake !== 0n) {
        const lastActionTime = parseFloat(data.lastActionTime.toString());

        intervalId = setInterval(() => {
          const currentTimeInSeconds = Math.floor(Date.now() / 1000);
          const differenceInSeconds = currentTimeInSeconds - lastActionTime;

          const timer5mins = 300 - differenceInSeconds;

          setTimer(timer5mins >= 0 ? timer5mins : 0);
        });
      }

      return () => clearInterval(intervalId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.lastActionTime, data?.p2Address, activeGameAddress]);

  return { timer };
};

import { ENDPOINTS } from '@/constants';
import axiosClient from '@/lib/network';
import { GameResult, HashedMove } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Address } from 'viem';

export const useCreateHashMove = () => {
  return useMutation({
    mutationFn: async (move: number) => {
      const { data } = await axiosClient.post(ENDPOINTS.GENERATE_HASH, { move });
      return data as HashedMove;
    },
  });
};

export const useGetGameResult = (gameAddress: Address | undefined) => {
  return useQuery({
    queryKey: ['gameResult'],
    queryFn: async () => {
      const { data } = await axiosClient.get(ENDPOINTS.GET_GAME_RESULT(gameAddress as Address));
      return data as GameResult;
    },
    enabled: !!gameAddress,
  });
};

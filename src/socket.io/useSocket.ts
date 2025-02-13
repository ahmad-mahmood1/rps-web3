import { EVENTS } from '@/constants';
import { useReadRPSContractState } from '@/hooks/rps/useReadRPSContractState';
import { useToast } from '@/hooks/useToast';
import { socket } from '@/socket.io/socket';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Address } from 'viem';

export const useSocket = () => {
  const { toast } = useToast();
  const { gameAddress } = useParams<{ gameAddress: Address }>();
  const queryClient = useQueryClient();

  const { queryKey: contractQueryKey } = useReadRPSContractState(gameAddress);

  useEffect(() => {
    const handlePlayerJoined = (data: any) => {
      toast({
        description: data.message,
      });
    };

    const handleUpdateGameState = () => {
      queryClient.invalidateQueries({ queryKey: ['gameResult'] });
      queryClient.invalidateQueries({ queryKey: contractQueryKey });
    };

    socket.on(EVENTS.PLAYER_JOINED, handlePlayerJoined);
    socket.on(EVENTS.GAME_UPDATED, handleUpdateGameState);

    return () => {
      socket.off(EVENTS.PLAYER_JOINED, handlePlayerJoined);
      socket.off(EVENTS.GAME_UPDATED, handleUpdateGameState);
    };
  }, [toast, queryClient]);
};

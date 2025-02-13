import { useCreateHashMove } from '@/api/gameRoomApi';
import GameMoves from '@/components/common/game-moves';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MOVES, ROUTES } from '@/constants';
import { useBlockNavigation } from '@/hooks/rps/useBlockNavigation';
import { useDeployRPSContract } from '@/hooks/rps/useDeployRPSContract';
import { getGameMoveValue } from '@/lib/utils';
import { GameMove } from '@/types';
import { useGameStore } from '@/zustand/gameStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { LuArrowRight, LuLoaderCircle } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { isAddress } from 'viem';

import { z } from 'zod';
const formSchema = z.object({
  gameMove: z.string().refine((val) => Object.keys(MOVES).includes(val), 'Choose a Move'),
  player2Address: z.string().refine((val) => isAddress(val), 'Invalid Address'),
  stake: z
    .string()
    .min(1, 'Stake is required')
    .refine((val) => parseFloat(val) > 0, 'Stake must be greater than 0'),
});

export function CreateGameForm() {
  const navigate = useNavigate();
  const navigateToGame = (gameAddress: string) =>
    navigate(ROUTES.ACTIVE_GAME_ROOM.replace(':gameAddress', gameAddress));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gameMove: '',
      stake: '',
      player2Address: '0x',
    },
  });

  const { setGameStore, removeGameStore, gameAddress } = useGameStore();

  const { mutateAsync: generateHashedMove, isPending: isPendingHashedMove } = useCreateHashMove();

  const { handleContractDeployment, isPending } = useDeployRPSContract({
    onSuccess: (contractAddress) => {
      setGameStore({ gameAddress: contractAddress, move: form.getValues('gameMove') as GameMove });
      navigateToGame(contractAddress);
    },
    onError: removeGameStore,
  });

  useBlockNavigation(isPending || isPendingHashedMove);

  async function onSubmit({ stake, player2Address, gameMove }: z.infer<typeof formSchema>) {
    const move = gameMove as GameMove;
    const moveValue = getGameMoveValue(move);

    const { hashedMove, salt } = await generateHashedMove(moveValue);

    setGameStore({ salt, move });

    if (hashedMove) {
      handleContractDeployment({ stake, player2Address, player1HashedMove: hashedMove });
    }
  }

  if (gameAddress) {
    return (
      <div className='flex flex-col items-center gap-y-3'>
        You already have a game in progress
        <Button onClick={() => navigateToGame(gameAddress)}>
          Continue <LuArrowRight />
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8 text-left border border-slate-300 p-4 rounded-md'
      >
        <FormField
          control={form.control}
          name='gameMove'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Move</FormLabel>
              <FormControl>
                <GameMoves
                  selectedMove={field.value as GameMove}
                  setSelectedMove={(move) => form.setValue('gameMove', move, { shouldDirty: true })}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='player2Address'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opponent's Address</FormLabel>
              <FormControl>
                <Input placeholder='0x...' {...field} />
              </FormControl>
              <FormDescription>Opponent's MetaMask Wallet Address</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='stake'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stake (ETH)</FormLabel>
              <FormControl>
                <Input placeholder='Your Stake in ETH' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isPendingHashedMove || isPending} className='w-full'>
          {isPending || isPendingHashedMove ? <LuLoaderCircle className='animate-spin' size={40} /> : 'CREATE GAME'}
        </Button>
      </form>
    </Form>
  );
}

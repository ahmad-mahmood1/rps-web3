import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/constants';
import { useReadRPSContractState } from '@/hooks/rps/useReadRPSContractState';
import { useToast } from '@/hooks/useToast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LuLoaderCircle } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { Address, isAddress } from 'viem';
import { useAccount } from 'wagmi';

import { z } from 'zod';

const formSchema = z.object({
  gameAddress: z.string().refine((val) => isAddress(val), 'Invalid Address'),
});

export function EnterGameForm() {
  const { toast } = useToast();
  const { address } = useAccount();
  const navigate = useNavigate();

  const [playerAddedGameAddress, setPlayerAddedGameAddress] = useState<Address | undefined>(undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gameAddress: '0x',
    },
  });

  const { data, isFetching, isError, error } = useReadRPSContractState(playerAddedGameAddress);

  function onSubmit({ gameAddress }: z.infer<typeof formSchema>) {
    setPlayerAddedGameAddress(gameAddress);
  }

  useEffect(() => {
    if (!!address && !!data && !!playerAddedGameAddress) {
      if (address !== data.p2Address) {
        toast({
          title: 'Oops! Your are not The Challenged Player',
        });
      } else {
        navigate(ROUTES.ACTIVE_GAME_ROOM.replace(':gameAddress', playerAddedGameAddress));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, playerAddedGameAddress, data]);

  useEffect(() => {
    if (isError) {
      toast({
        description: error.message,
        variant: 'destructive',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3 min-w-[450px]'>
        <FormField
          control={form.control}
          name='gameAddress'
          render={({ field }) => (
            <FormItem className='text-left'>
              <FormLabel>Game Address</FormLabel>
              <FormControl>
                <Input placeholder='0x...' {...field} />
              </FormControl>
              <FormDescription>Give the Game Address in which you are the Second Player</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' disabled={isFetching} className='w-full'>
          {isFetching ? <LuLoaderCircle className='animate-spin' size={40} /> : 'ENTER GAME'}
        </Button>
      </form>
    </Form>
  );
}

import { WALLET_CONNECT_ID } from '@/env-config';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { sepolia } from 'wagmi/chains';

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}

export const config = getDefaultConfig({
  appName: 'RPS Web3',
  projectId: WALLET_CONNECT_ID,
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
});

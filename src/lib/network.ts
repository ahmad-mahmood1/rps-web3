import axios from 'axios';
import { getAccount } from '@wagmi/core';
import { config } from '@/wagmiConfig';
import { BASE_URL } from '@/env-config';

const axiosClient = axios.create({
  baseURL: BASE_URL || '',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: Attach wallet address if available
axiosClient.interceptors.request.use(
  (axiosConfig) => {
    const { isConnected } = getAccount(config);

    if (!isConnected) {
      console.warn('Wallet not connected. Blocking API request.');
      return Promise.reject(new Error('Wallet not connected.'));
    }

    return axiosConfig;
  },
  (error) => Promise.reject(error),
);

export default axiosClient;

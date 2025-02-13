import { BASE_URL } from '@/env-config';
import { io } from 'socket.io-client';

export const socket = io(BASE_URL, { transports: ['websocket'] });

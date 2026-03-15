import Redis from 'ioredis';
import { redisConfig } from './redisConfig';

export const redisClient = new Redis(redisConfig);

redisClient.on('connect', () => {
    console.log('✅ Redis Client Connected');
});

redisClient.on('error', (err) => {
    console.error('❌ Redis Client Connection Error:', err);
});

export default redisClient;

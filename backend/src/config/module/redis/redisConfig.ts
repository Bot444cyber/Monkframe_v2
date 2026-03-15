
import dotenv from 'dotenv';
import { RedisOptions } from 'ioredis';

dotenv.config();

const sanitize = (value: string | undefined) => value?.replace(/['"]/g, '')?.trim();

const REDIS_HOST = sanitize(process.env.REDIS_HOST) || 'localhost';
const rawPort = sanitize(process.env.REDIS_PORT);
const REDIS_PORT = rawPort ? parseInt(rawPort) : 6379;
const REDIS_PASSWORD = sanitize(process.env.REDIS_PASSWORD);

console.log('------------ DEBUG REDIS CONFIG ------------');
console.log(`HOST: ${REDIS_HOST}`);
console.log(`PORT: ${REDIS_PORT}`);
// Don't log actual password, just existence and length
console.log(`PASSWORD PRESENT: ${!!REDIS_PASSWORD}`);
if (REDIS_PASSWORD) {
    console.log(`PASSWORD LENGTH: ${REDIS_PASSWORD.length}`);
}
console.log('--------------------------------------------');

// Base Config
const redisConfig: RedisOptions = {
    host: REDIS_HOST,
    port: isNaN(REDIS_PORT) ? 6379 : REDIS_PORT,
    family: 4,     // Force IPv4
    maxRetriesPerRequest: null, // Required for Bull
    retryStrategy: (times: number) => {
        return Math.min(times * 50, 2000);
    }
};

// Only add password if definitely exists and not empty
if (REDIS_PASSWORD && REDIS_PASSWORD.length > 0) {
    redisConfig.password = REDIS_PASSWORD;
}

export { redisConfig };

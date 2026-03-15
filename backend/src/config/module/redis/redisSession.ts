
import { createClient } from 'redis';
import dotenv from 'dotenv';
import { redisConfig } from './redisConfig';

dotenv.config();

const sessionClient = createClient({
    socket: {
        host: redisConfig.host,
        port: redisConfig.port,
        family: 4
    },
    password: redisConfig.password
});

sessionClient.on('error', (err) => console.error('❌ Redis Session Client Error:', err));
sessionClient.on('connect', () => console.log('✅ Redis Session Client Connected'));

export default sessionClient;

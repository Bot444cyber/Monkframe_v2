"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sanitize = (value) => { var _a; return (_a = value === null || value === void 0 ? void 0 : value.replace(/['"]/g, '')) === null || _a === void 0 ? void 0 : _a.trim(); };
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
const redisConfig = {
    host: REDIS_HOST,
    port: isNaN(REDIS_PORT) ? 6379 : REDIS_PORT,
    family: 4, // Force IPv4
    maxRetriesPerRequest: null, // Required for Bull
    retryStrategy: (times) => {
        return Math.min(times * 50, 2000);
    }
};
exports.redisConfig = redisConfig;
// Only add password if definitely exists and not empty
if (REDIS_PASSWORD && REDIS_PASSWORD.length > 0) {
    redisConfig.password = REDIS_PASSWORD;
}

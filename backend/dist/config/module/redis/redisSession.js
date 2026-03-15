"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
const redisConfig_1 = require("./redisConfig");
dotenv_1.default.config();
const sessionClient = (0, redis_1.createClient)({
    socket: {
        host: redisConfig_1.redisConfig.host,
        port: redisConfig_1.redisConfig.port,
        family: 4
    },
    password: redisConfig_1.redisConfig.password
});
sessionClient.on('error', (err) => console.error('❌ Redis Session Client Error:', err));
sessionClient.on('connect', () => console.log('✅ Redis Session Client Connected'));
exports.default = sessionClient;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const redisConfig_1 = require("./redisConfig");
exports.redisClient = new ioredis_1.default(redisConfig_1.redisConfig);
exports.redisClient.on('connect', () => {
    console.log('✅ Redis Client Connected');
});
exports.redisClient.on('error', (err) => {
    console.error('❌ Redis Client Connection Error:', err);
});
exports.default = exports.redisClient;

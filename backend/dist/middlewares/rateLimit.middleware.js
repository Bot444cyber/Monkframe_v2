"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadLimiter = exports.authLimiter = exports.generalLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
/**
 * General API rate limiter — 350 requests per 5 minutes per IP.
 */
exports.generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 350,
    standardHeaders: true, // Return `RateLimit-*` headers
    legacyHeaders: false,
    message: {
        status: false,
        message: 'Too many requests from this IP, please try again after 5 minutes.',
    },
    skip: (req) => {
        // Skip rate limiting for health checks
        return req.path === '/api/health';
    },
});
/**
 * Strict auth rate limiter — 35 requests per 10 minutes per IP.
 * Applied to login, register, OTP endpoints.
 */
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    max: 35,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: false,
        message: 'Too many authentication attempts, please try again after 10 minutes.',
    },
});
/**
 * Upload rate limiter — 20 uploads per hour per IP.
 */
exports.uploadLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: false,
        message: 'Upload limit reached. Please wait before uploading more files.',
    },
});

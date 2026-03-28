import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter — 350 requests per 5 minutes per IP.
 */
export const generalLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 350,
    standardHeaders: true,  // Return `RateLimit-*` headers
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
 * Strict auth rate limiter — 10 requests per 15 minutes per IP.
 * Applied to login, register, OTP endpoints.
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: false,
        message: 'Too many authentication attempts, please try again after 15 minutes.',
    },
});

/**
 * Upload rate limiter — 20 uploads per hour per IP.
 */
export const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: false,
        message: 'Upload limit reached. Please wait before uploading more files.',
    },
});

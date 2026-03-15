"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
class AppError extends Error {
    constructor(message, status = 500, isOperational = true) {
        super(message);
        this.status = status;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, next) => {
    const isProd = process.env.NODE_ENV === 'production';
    // Determine status code
    const status = err.status || err.statusCode || 500;
    // Log the error
    if (status >= 500) {
        logger_1.default.error('Unhandled error', Object.assign({ message: err.message, path: req.path, method: req.method, status }, (isProd ? {} : { stack: err.stack })));
    }
    else {
        logger_1.default.warn('Client error', { message: err.message, path: req.path, status });
    }
    res.status(status).json(Object.assign({ status: false, message: isProd && status >= 500
            ? 'An internal server error occurred.'
            : err.message || 'Internal Server Error' }, (isProd ? {} : { stack: err.stack })));
};
exports.errorHandler = errorHandler;

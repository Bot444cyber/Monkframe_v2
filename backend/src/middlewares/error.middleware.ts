
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export class AppError extends Error {
    public readonly status: number;
    public readonly isOperational: boolean;

    constructor(message: string, status: number = 500, isOperational = true) {
        super(message);
        this.status = status;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const isProd = process.env.NODE_ENV === 'production';

    // Determine status code
    const status = err.status || err.statusCode || 500;

    // Log the error
    if (status >= 500) {
        logger.error('Unhandled error', {
            message: err.message,
            path: req.path,
            method: req.method,
            status,
            ...(isProd ? {} : { stack: err.stack }),
        });
    } else {
        logger.warn('Client error', { message: err.message, path: req.path, status });
    }

    res.status(status).json({
        status: false,
        message: isProd && status >= 500
            ? 'An internal server error occurred.'
            : err.message || 'Internal Server Error',
        ...(isProd ? {} : { stack: err.stack }),
    });
};

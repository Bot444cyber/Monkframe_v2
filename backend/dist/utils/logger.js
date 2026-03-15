"use strict";
/**
 * Structured logger — pretty in dev, JSON in production.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const isProd = process.env.NODE_ENV === 'production';
function log(level, message, meta) {
    const ts = new Date().toISOString();
    // STRICTLY USE CONSOLE to prevent Hostinger Passenger from detecting
    // process.stdout modifications as file writes and restarting the app.
    if (isProd) {
        const logData = JSON.stringify(Object.assign({ ts, level, message }, meta));
        if (level === 'error') {
            console.error(logData);
        }
        else if (level === 'warn') {
            console.warn(logData);
        }
        else {
            console.log(logData);
        }
    }
    else {
        const prefix = {
            info: '📘',
            warn: '⚠️ ',
            error: '❌',
            debug: '🔍',
        };
        const parts = [`${prefix[level]} [${level.toUpperCase()}]`, message];
        if (meta && Object.keys(meta).length > 0)
            parts.push(JSON.stringify(meta));
        if (level === 'error')
            console.error(parts.join(' '));
        else if (level === 'warn')
            console.warn(parts.join(' '));
        else
            console.log(parts.join(' '));
    }
}
const logger = {
    info: (msg, meta) => log('info', msg, meta),
    warn: (msg, meta) => log('warn', msg, meta),
    error: (msg, meta) => log('error', msg, meta),
    debug: (msg, meta) => log('debug', msg, meta),
};
exports.default = logger;

"use strict";
/**
 * Structured logger — pretty in dev, JSON in production.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const isProd = process.env.NODE_ENV === 'production';
function log(level, message, meta) {
    const ts = new Date().toISOString();
    if (isProd) {
        // Machine-readable JSON for log aggregators (Datadog, CloudWatch, etc.)
        process.stdout.write(JSON.stringify(Object.assign({ ts, level, message }, meta)) + '\n');
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
        console[level === 'debug' ? 'log' : level](parts.join(' '));
    }
}
const logger = {
    info: (msg, meta) => log('info', msg, meta),
    warn: (msg, meta) => log('warn', msg, meta),
    error: (msg, meta) => log('error', msg, meta),
    debug: (msg, meta) => log('debug', msg, meta),
};
exports.default = logger;

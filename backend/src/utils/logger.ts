/**
 * Structured logger — pretty in dev, JSON in production.
 */

const isProd = process.env.NODE_ENV === 'production';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
    const ts = new Date().toISOString();
    if (isProd) {
        // Machine-readable JSON for log aggregators (Datadog, CloudWatch, etc.)
        process.stdout.write(
            JSON.stringify({ ts, level, message, ...meta }) + '\n'
        );
    } else {
        const prefix: Record<LogLevel, string> = {
            info: '📘',
            warn: '⚠️ ',
            error: '❌',
            debug: '🔍',
        };
        const parts = [`${prefix[level]} [${level.toUpperCase()}]`, message];
        if (meta && Object.keys(meta).length > 0) parts.push(JSON.stringify(meta));
        console[level === 'debug' ? 'log' : level](parts.join(' '));
    }
}

const logger = {
    info: (msg: string, meta?: Record<string, unknown>) => log('info', msg, meta),
    warn: (msg: string, meta?: Record<string, unknown>) => log('warn', msg, meta),
    error: (msg: string, meta?: Record<string, unknown>) => log('error', msg, meta),
    debug: (msg: string, meta?: Record<string, unknown>) => log('debug', msg, meta),
};

export default logger;

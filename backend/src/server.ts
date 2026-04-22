// 1. THIS MUST BE THE ABSOLUTE FIRST LINE
import "dotenv/config";

// ============================================
// ENVIRONMENT VALIDATION — fail fast
// ============================================
const REQUIRED_ENV = ['JWT_SECRET', 'DB_HOST', 'DB_NAME'];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
}

// 2. Node/Express modules
import cors from "cors";
import express, { Express, Request, Response } from "express";
import session from "express-session";
import passport from "passport";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

// 3. Local files
import Database from "./design/DataBase";
import { poolConnection } from "./db"; // for heartbeat keepalive

import "./config/module/passport";
import { errorHandler } from "./middlewares/error.middleware";
import { generalLimiter, authLimiter, uploadLimiter } from "./middlewares/rateLimit.middleware";
import logger from "./utils/logger";

// 4. Routes
import userRoutes from "./routes/user.routes";
import otpRoutes from "./routes/otp.routes";
import uiRoutes from "./routes/ui.routes";
import adminRoutes from "./routes/admin.routes";
import interactionRoutes from "./routes/interaction.routes";
import paymentRoutes from "./routes/payment.routes";
import notificationRoutes from "./routes/notification.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import newsletterRoutes from "./routes/newsletter.routes";
import googleDriveRoutes from "./routes/googleDrive.routes";
import blogRoutes from "./routes/blog.routes";

const app: Express = express();
const PORT = process.env.PORT || 8000;
const isProd = process.env.NODE_ENV === 'production';

// Trust proxy for secure cookies
app.set('trust proxy', 1);

// ============================================
// DATABASE
// ============================================
let databaseReady = false;

async function initializeDatabase() {
    try {
        logger.info('Checking database status...');
        const database = Database.getInstance();
        const initialized = await database.initializeDatabase();
        if (initialized) {
            databaseReady = true;
            logger.info('Database is ready for use');
            const status = database.getConnectionStatus();
            logger.debug('Database status', { connected: status.isConnected, created: status.isDatabaseCreated });
        } else {
            logger.warn('Database initialization failed');
            databaseReady = false;
        }
    } catch (error) {
        logger.error('Database initialization error', { error: String(error) });
        databaseReady = false;
    }
}



// ============================================
// MIDDLEWARE
// ============================================

// Security headers — adjusted so helmet doesn't block OAuth redirects or
// cross-origin image loading from Google Drive.
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },  // allow image proxy
    crossOriginOpenerPolicy: { policy: 'unsafe-none' },   // allow Google OAuth popup flow
    contentSecurityPolicy: isProd ? undefined : false,
}));

// CORS — resilient: handles x-forwarded-proto from Hostinger's Nginx proxy
// and gracefully falls back when FRONTEND_URL is not set.
const allowedOrigins = [
    process.env.FRONTEND_URL,
    ...(process.env.ALLOWED_ORIGINS?.split(',') ?? []),
].filter((o): o is string => !!o?.trim());

app.use(
    cors({
        origin: (incomingOrigin, callback) => {
            // Allow requests with no origin (curl, Postman, server-to-server)
            if (!incomingOrigin) return callback(null, true);

            // In development always allow
            if (!isProd) return callback(null, true);

            // Normalise: strip trailing slash, handle http→https via proxy
            const normalised = incomingOrigin.replace(/\/$/, '');
            const httpsVariant = normalised.replace(/^http:\/\//i, 'https://');

            const allowed =
                allowedOrigins.length === 0 ||          // no list set → open (fallback)
                allowedOrigins.some((o) =>
                    o === normalised || o === httpsVariant
                );

            if (allowed) {
                callback(null, true);
            } else {
                logger.warn(`CORS blocked origin: ${incomingOrigin}`);
                callback(new Error(`Origin '${incomingOrigin}' not allowed by CORS`));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Cookie'],
        exposedHeaders: ['Content-Range', 'X-Content-Range'],
        maxAge: 86400,
    })
);

// Response compression
app.use(compression());

// Body parser with size limits
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// HTTP request logger
const morganFormat = isProd ? 'combined' : 'dev';
app.use(morgan(morganFormat, {
    stream: {
        write: (msg: string) => logger.info(msg.trim()),
    },
    skip: (req) => req.path === '/api/health',
}));

// ── Diagnostic Middleware ──────────────────────────────────────────────────
// Logs key headers to help identify if Hostinger/Nginx strips auth headers.
// Disable in production once the issue is diagnosed.
if (!isProd) {
    app.use((req: Request, _res, next) => {
        logger.debug(`[DIAG] ${req.method} ${req.path}`, {
            origin: req.headers['origin'] || '—',
            authorization: req.headers['authorization'] ? '✔ present' : '✘ missing',
            cookie: req.headers['cookie'] ? '✔ present' : '✘ missing',
            'x-forwarded-for': req.headers['x-forwarded-for'] || '—',
            'x-real-ip': req.headers['x-real-ip'] || '—',
        });
        next();
    });
}
// ──────────────────────────────────────────────────────────────────────────

// Session configuration
export const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'fallback-dev-secret-do-not-use-in-prod',
    resave: false,
    saveUninitialized: false,
    name: 'sid', // don't leak default session name
    cookie: {
        secure: isProd,
        httpOnly: true,
        sameSite: isProd ? 'strict' : 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
});

app.use(sessionMiddleware);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Global rate limiter (excludes auth routes which have stricter limits)
app.use(generalLimiter);



// ============================================
// HEALTH CHECK
// ============================================
app.get('/', (req: Request, res: Response) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0',
    });
});

app.get('/api/health', (req: Request, res: Response) => {
    const database = Database.getInstance();
    const dbStatus = database.getConnectionStatus();
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        environment: process.env.NODE_ENV || 'development',
        db: dbStatus.isConnected ? 'connected' : 'disconnected',
        version: process.env.npm_package_version || '1.0.0',
    });
});

// ============================================
// ROUTES
// ============================================
app.use('/api/auth', authLimiter, userRoutes);
app.use('/api', otpRoutes);
app.use('/api/uis', uiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/admin/drive', googleDriveRoutes);
app.use('/api/blogs', blogRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        status: false,
        message: 'Endpoint not found',
        path: req.path,
    });
});

// Global error handler (must be last)
app.use(errorHandler);

// ============================================
// START SERVER (async — DB must be ready first)
// ============================================
// ============================================
// START SERVER (async — DB must be ready first)
async function startApp() {
    // 1. Await DB before opening the port
    await initializeDatabase();

    const server = app.listen(PORT || 8000, () => {
        logger.info('🚀 Mockupidea API Service successfully initialized.', {
            port: PORT,
            url: `http://localhost:${PORT}`,
            env: process.env.NODE_ENV || 'development'
        });
    });
}

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason) => {
    logger.error('CRITICAL: Unhandled promise rejection detected. Exiting...', {
        reason: String(reason),
        stack: (reason as Error)?.stack
    });
    if (isProd) {
        setTimeout(() => process.exit(1), 1000); // Give logger a moment
    }
});

process.on('uncaughtException', (err) => {
    logger.error('CRITICAL: Uncaught exception detected. Exiting...', {
        error: err.message,
        stack: err.stack
    });
    setTimeout(() => process.exit(1), 1000); // Give logger a moment
});

// Boot — startApp awaits DB init then opens the port
startApp().catch((err) => {
    logger.error('Fatal startup error', { error: String(err) });
    process.exit(1);
});

export default app;

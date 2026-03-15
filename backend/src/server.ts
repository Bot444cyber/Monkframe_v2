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
import { createServer } from "http";
import session from "express-session";
import passport from "passport";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

// 3. Local files
import Database from "./design/DataBase";
import { initSocket, getIO } from "./config/socket";
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

const app: Express = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 8000;
const isProd = process.env.NODE_ENV === 'production';

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

initializeDatabase();

// ============================================
// MIDDLEWARE
// ============================================

// Security headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow image proxy
    contentSecurityPolicy: isProd ? undefined : false,      // disable CSP in dev
}));

// CORS
const allowedOrigins = [
    process.env.FRONTEND_URL,
].filter((origin): origin is string => !!origin);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (!isProd) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
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

// Initialize Socket.io (after session middleware)
initSocket(httpServer, sessionMiddleware);

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

// Dev-only socket test route
if (!isProd) {
    app.get('/api/test-socket', (req, res) => {
        try {
            const io = getIO();
            io.emit("test-event", { message: "Hello from Backend! WebSockets are working! 🚀" });
            res.json({ success: true, message: "Test event emitted to all clients" });
        } catch (error) {
            logger.error("Socket error", { error: String(error) });
            res.status(500).json({ success: false, error: "Failed to emit event" });
        }
    });
}

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
// START SERVER
// ============================================
const server = httpServer.listen(PORT, () => {
    logger.info(`🚀 UI Management System started`, {
        port: PORT,
        env: process.env.NODE_ENV || 'development',
        health: `http://localhost:${PORT}/api/health`,
    });
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
function gracefulShutdown(signal: string) {
    logger.info(`Received ${signal}, shutting down gracefully...`);
    server.close(async () => {
        logger.info('HTTP server closed');
        try {
            const database = Database.getInstance();
            await database.disconnect?.();
            logger.info('Database connection closed');
        } catch (err) {
            logger.error('Error closing database connection', { error: String(err) });
        }
        process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
    }, 10_000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled promise rejection', { reason: String(reason) });
    if (isProd) process.exit(1);
});

process.on('uncaughtException', (err) => {
    logger.error('Uncaught exception', { error: err.message, stack: err.stack });
    process.exit(1);
});

export default app;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionMiddleware = void 0;
// 1. THIS MUST BE THE ABSOLUTE FIRST LINE
require("dotenv/config");
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
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
// 3. Local files
const DataBase_1 = __importDefault(require("./design/DataBase"));
const socket_1 = require("./config/socket");
require("./config/module/passport");
const error_middleware_1 = require("./middlewares/error.middleware");
const rateLimit_middleware_1 = require("./middlewares/rateLimit.middleware");
const logger_1 = __importDefault(require("./utils/logger"));
// 4. Routes
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const otp_routes_1 = __importDefault(require("./routes/otp.routes"));
const ui_routes_1 = __importDefault(require("./routes/ui.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const interaction_routes_1 = __importDefault(require("./routes/interaction.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const PORT = process.env.PORT || 8000;
const isProd = process.env.NODE_ENV === 'production';
// ============================================
// DATABASE
// ============================================
let databaseReady = false;
function initializeDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            logger_1.default.info('Checking database status...');
            const database = DataBase_1.default.getInstance();
            const initialized = yield database.initializeDatabase();
            if (initialized) {
                databaseReady = true;
                logger_1.default.info('Database is ready for use');
                const status = database.getConnectionStatus();
                logger_1.default.debug('Database status', { connected: status.isConnected, created: status.isDatabaseCreated });
            }
            else {
                logger_1.default.warn('Database initialization failed');
                databaseReady = false;
            }
        }
        catch (error) {
            logger_1.default.error('Database initialization error', { error: String(error) });
            databaseReady = false;
        }
    });
}
initializeDatabase();
// ============================================
// MIDDLEWARE
// ============================================
// Security headers
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow image proxy
    contentSecurityPolicy: isProd ? undefined : false, // disable CSP in dev
}));
// CORS
const allowedOrigins = [
    process.env.FRONTEND_URL,
].filter((origin) => !!origin);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (!isProd)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400,
}));
// Response compression
app.use((0, compression_1.default)());
// Body parser with size limits
app.use(express_1.default.json({ limit: '2mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '2mb' }));
// HTTP request logger
const morganFormat = isProd ? 'combined' : 'dev';
app.use((0, morgan_1.default)(morganFormat, {
    stream: {
        write: (msg) => logger_1.default.info(msg.trim()),
    },
    skip: (req) => req.path === '/api/health',
}));
// Session configuration
exports.sessionMiddleware = (0, express_session_1.default)({
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
app.use(exports.sessionMiddleware);
// Passport
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Global rate limiter (excludes auth routes which have stricter limits)
app.use(rateLimit_middleware_1.generalLimiter);
// Initialize Socket.io (after session middleware)
(0, socket_1.initSocket)(httpServer, exports.sessionMiddleware);
// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', (req, res) => {
    const database = DataBase_1.default.getInstance();
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
app.use('/api/auth', rateLimit_middleware_1.authLimiter, user_routes_1.default);
app.use('/api', otp_routes_1.default);
app.use('/api/uis', ui_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/interactions', interaction_routes_1.default);
app.use('/api/payment', payment_routes_1.default);
app.use('/api/notifications', notification_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
// Dev-only socket test route
if (!isProd) {
    app.get('/api/test-socket', (req, res) => {
        try {
            const io = (0, socket_1.getIO)();
            io.emit("test-event", { message: "Hello from Backend! WebSockets are working! 🚀" });
            res.json({ success: true, message: "Test event emitted to all clients" });
        }
        catch (error) {
            logger_1.default.error("Socket error", { error: String(error) });
            res.status(500).json({ success: false, error: "Failed to emit event" });
        }
    });
}
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: false,
        message: 'Endpoint not found',
        path: req.path,
    });
});
// Global error handler (must be last)
app.use(error_middleware_1.errorHandler);
// ============================================
// START SERVER
// ============================================
const server = httpServer.listen(PORT, () => {
    logger_1.default.info(`🚀 UI Management System started`, {
        port: PORT,
        env: process.env.NODE_ENV || 'development',
        health: `http://localhost:${PORT}/api/health`,
    });
});
// ============================================
// GRACEFUL SHUTDOWN
// ============================================
function gracefulShutdown(signal) {
    logger_1.default.info(`Received ${signal}, shutting down gracefully...`);
    server.close(() => __awaiter(this, void 0, void 0, function* () {
        var _a;
        logger_1.default.info('HTTP server closed');
        try {
            const database = DataBase_1.default.getInstance();
            yield ((_a = database.disconnect) === null || _a === void 0 ? void 0 : _a.call(database));
            logger_1.default.info('Database connection closed');
        }
        catch (err) {
            logger_1.default.error('Error closing database connection', { error: String(err) });
        }
        process.exit(0);
    }));
    // Force shutdown after 10 seconds
    setTimeout(() => {
        logger_1.default.error('Forced shutdown after timeout');
        process.exit(1);
    }, 10000);
}
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
// Catch unhandled promise rejections
process.on('unhandledRejection', (reason) => {
    logger_1.default.error('Unhandled promise rejection', { reason: String(reason) });
    if (isProd)
        process.exit(1);
});
process.on('uncaughtException', (err) => {
    logger_1.default.error('Uncaught exception', { error: err.message, stack: err.stack });
    process.exit(1);
});
exports.default = app;

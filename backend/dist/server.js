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
var _a, _b;
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
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
// 3. Local files
const DataBase_1 = __importDefault(require("./design/DataBase"));
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
const newsletter_routes_1 = __importDefault(require("./routes/newsletter.routes"));
const googleDrive_routes_1 = __importDefault(require("./routes/googleDrive.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
const isProd = process.env.NODE_ENV === 'production';
// Trust proxy for secure cookies
app.set('trust proxy', 1);
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
// ============================================
// MIDDLEWARE
// ============================================
// Security headers — adjusted so helmet doesn't block OAuth redirects or
// cross-origin image loading from Google Drive.
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow image proxy
    crossOriginOpenerPolicy: { policy: 'unsafe-none' }, // allow Google OAuth popup flow
    contentSecurityPolicy: isProd ? undefined : false,
}));
// CORS — resilient: handles x-forwarded-proto from Hostinger's Nginx proxy
// and gracefully falls back when FRONTEND_URL is not set.
const allowedOrigins = [
    process.env.FRONTEND_URL,
    ...((_b = (_a = process.env.ALLOWED_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(',')) !== null && _b !== void 0 ? _b : []),
].filter((o) => !!(o === null || o === void 0 ? void 0 : o.trim()));
app.use((0, cors_1.default)({
    origin: (incomingOrigin, callback) => {
        // Allow requests with no origin (curl, Postman, server-to-server)
        if (!incomingOrigin)
            return callback(null, true);
        // In development always allow
        if (!isProd)
            return callback(null, true);
        // Normalise: strip trailing slash, handle http→https via proxy
        const normalised = incomingOrigin.replace(/\/$/, '');
        const httpsVariant = normalised.replace(/^http:\/\//i, 'https://');
        const allowed = allowedOrigins.length === 0 || // no list set → open (fallback)
            allowedOrigins.some((o) => o === normalised || o === httpsVariant);
        if (allowed) {
            callback(null, true);
        }
        else {
            logger_1.default.warn(`CORS blocked origin: ${incomingOrigin}`);
            callback(new Error(`Origin '${incomingOrigin}' not allowed by CORS`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Cookie'],
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
// ── Diagnostic Middleware ──────────────────────────────────────────────────
// Logs key headers to help identify if Hostinger/Nginx strips auth headers.
// Disable in production once the issue is diagnosed.
if (!isProd) {
    app.use((req, _res, next) => {
        logger_1.default.debug(`[DIAG] ${req.method} ${req.path}`, {
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
// ============================================
// HEALTH CHECK
// ============================================
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0',
    });
});
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
app.use('/api/newsletter', newsletter_routes_1.default);
app.use('/api/admin/drive', googleDrive_routes_1.default);
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
// START SERVER (async — DB must be ready first)
// ============================================
// ============================================
// START SERVER (async — DB must be ready first)
function startApp() {
    return __awaiter(this, void 0, void 0, function* () {
        // 1. Await DB before opening the port
        yield initializeDatabase();
        const server = app.listen(PORT || 8000, () => {
            logger_1.default.info('🚀 UI Management System started', {
                port: PORT,
                url: `http://localhost:${PORT}`,
                env: process.env.NODE_ENV || 'development'
            });
        });
    });
}
// Catch unhandled promise rejections
process.on('unhandledRejection', (reason) => {
    logger_1.default.error('CRITICAL: Unhandled promise rejection detected. Exiting...', {
        reason: String(reason),
        stack: reason === null || reason === void 0 ? void 0 : reason.stack
    });
    if (isProd) {
        setTimeout(() => process.exit(1), 1000); // Give logger a moment
    }
});
process.on('uncaughtException', (err) => {
    logger_1.default.error('CRITICAL: Uncaught exception detected. Exiting...', {
        error: err.message,
        stack: err.stack
    });
    setTimeout(() => process.exit(1), 1000); // Give logger a moment
});
// Boot — startApp awaits DB init then opens the port
startApp().catch((err) => {
    logger_1.default.error('Fatal startup error', { error: String(err) });
    process.exit(1);
});
exports.default = app;

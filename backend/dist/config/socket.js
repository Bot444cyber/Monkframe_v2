"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const passport_1 = __importDefault(require("passport"));
let io = null;
const initSocket = (httpServer, sessionMiddleware) => {
    var _a, _b;
    // Shared CORS configuration
    const allowedOrigins = [
        process.env.FRONTEND_URL,
        ...(((_a = process.env.ALLOWED_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(',')) || []),
    ].filter((origin) => !!origin);
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: [
                process.env.FRONTEND_URL,
                ...(((_b = process.env.ALLOWED_ORIGINS) === null || _b === void 0 ? void 0 : _b.split(',')) || [])
            ].filter((origin) => !!origin),
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            credentials: true
        }
    });
    // Convert Express middleware to Socket.io middleware
    const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);
    // Apply Session Middleware
    io.use(wrap(sessionMiddleware));
    // Apply Passport Middleware
    io.use(wrap(passport_1.default.initialize()));
    io.use(wrap(passport_1.default.session()));
    // Authentication Guard (Modified to allow Guests)
    io.use((socket, next) => {
        const req = socket.request;
        if (req.isAuthenticated && req.isAuthenticated()) {
            // User is authenticated
            next();
        }
        else {
            console.log("👤 Guest Socket Connection Allowed");
            // Allow guests to connect
            next();
        }
    });
    io.on("connection", (socket) => {
        const user = socket.request.user;
        console.log(`🔌 Client Connected: ${socket.id} (User: ${(user === null || user === void 0 ? void 0 : user.full_name) || 'Unknown'})`);
        if (user) {
            // Join personal room
            const userId = user.user_id.toString();
            socket.join(userId);
            console.log(`👤 User ${user.email} joined room: ${userId}`);
            // Join admin room if applicable
            if (user.role === 'ADMIN') {
                socket.join('admin');
                console.log(`🛡️ User ${user.email} joined ADMIN room`);
            }
        }
        // Allow manual setup for SPA (when user logs in without refresh)
        socket.on("setup", (userData) => {
            if (userData && userData.user_id) {
                const userId = userData.user_id.toString();
                socket.join(userId);
                console.log(`👤 Manual Setup: User ${userId} joined room`);
                if (userData.role === 'ADMIN') {
                    socket.join('admin');
                    console.log(`🛡️ Manual Setup: User ${userId} joined ADMIN room`);
                }
                socket.emit("connected");
            }
        });
        socket.on("disconnect", () => {
            console.log(`🔌 Client Disconnected: ${socket.id}`);
        });
    });
    console.log("✅ Socket.io Initialized with Authentication");
    return io;
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
exports.getIO = getIO;

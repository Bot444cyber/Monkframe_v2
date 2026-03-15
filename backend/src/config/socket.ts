import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import passport from "passport";
import { RequestHandler } from "express";

let io: Server | null = null;

export const initSocket = (httpServer: HttpServer, sessionMiddleware: RequestHandler): Server => {
    // Shared CORS configuration
    const allowedOrigins = [
        process.env.FRONTEND_URL,
        ...(process.env.ALLOWED_ORIGINS?.split(',') || []),
    ].filter((origin): origin is string => !!origin);

    io = new Server(httpServer, {
        cors: {
            origin: [
                process.env.FRONTEND_URL,
                ...(process.env.ALLOWED_ORIGINS?.split(',') || [])
            ].filter((origin): origin is string => !!origin),
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            credentials: true
        }
    });

    // Convert Express middleware to Socket.io middleware
    const wrap = (middleware: any) => (socket: Socket, next: any) => middleware(socket.request, {} as any, next);

    // Apply Session Middleware
    io.use(wrap(sessionMiddleware));

    // Apply Passport Middleware
    io.use(wrap(passport.initialize()));
    io.use(wrap(passport.session()));

    // Authentication Guard (Modified to allow Guests)
    io.use((socket, next) => {
        const req = socket.request as any;
        if (req.isAuthenticated && req.isAuthenticated()) {
            // User is authenticated
            next();
        } else {
            console.log("👤 Guest Socket Connection Allowed");
            // Allow guests to connect
            next();
        }
    });

    io.on("connection", (socket: Socket) => {
        const user = (socket.request as any).user;
        console.log(`🔌 Client Connected: ${socket.id} (User: ${user?.full_name || 'Unknown'})`);

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
        socket.on("setup", (userData: any) => {
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

export const getIO = (): Server => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

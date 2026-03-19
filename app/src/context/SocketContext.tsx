"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Only connect if we are in the browser
        if (typeof window === 'undefined') return;

        // Connect to the backend URL
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1000";

        console.log("🔌 Initializing Socket connection to:", backendUrl);

        const socketInstance = io(backendUrl, {
            withCredentials: true,
            transports: ["websocket", "polling"], // Fallback to polling if websocket fails
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            autoConnect: true,
        });

        socketInstance.on("connect", () => {
            console.log("✅ Socket Connected:", socketInstance.id);
            setIsConnected(true);
        });

        socketInstance.on("test-event", (data: any) => {
            console.log("🔔 Test Event Received:", data);
            toast(data.message || "Test Event Received!", { icon: '🔔', duration: 4000 });
        });

        socketInstance.on("disconnect", (reason) => {
            console.log("❌ Socket Disconnected:", reason);
            setIsConnected(false);
            // toast.error("Disconnected from Real-time Server", { id: 'socket-disconnected' }); // Silenced
        });

        socketInstance.on("connect_error", (err) => {
            console.warn("⚠️ Socket Connection Error (Silenced):", err.message);
            setIsConnected(false);
            // toast.error(`Connection Error: ${err.message}`, { id: 'socket-error' }); // Silenced
        });

        setSocket(socketInstance);

        // Cleanup on unmount
        return () => {
            if (socketInstance) {
                console.log("🛑 Disconnecting Socket...");
                socketInstance.disconnect();
            }
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

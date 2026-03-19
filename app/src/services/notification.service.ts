
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
const API_URL = `${BASE_URL}/api`;

let socket: Socket | null = null;

export const NotificationService = {

    _getHeaders: () => {
        const headers: any = {};
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('auth_token');
            if (token) headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    },

    getNotifications: async (page = 1, limit = 10, scope?: string) => {
        try {
            const response = await axios.get(`${API_URL}/notifications/get-notifications`, {
                params: { page, limit, scope },
                withCredentials: true,
                headers: NotificationService._getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching notifications:", error);
            throw error;
        }
    },

    connectSocket: () => {
        if (!socket) {
            socket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:1000', {
                withCredentials: true,
                transports: ['websocket']
            });

            socket.on('connect', () => {
                console.log('Connected to socket server');
            });
        }
        return socket;
    },

    getSocket: () => {
        if (!socket) {
            return NotificationService.connectSocket();
        }
        return socket;
    },

    disconnectSocket: () => {
        if (socket) {
            socket.disconnect();
            socket = null;
        }
    }
};


import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
const API_URL = `${BASE_URL}/api`;

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
            throw error;
        }
    },
    resolveNotification: async (id: string) => {
        try {
            const response = await axios.patch(`${API_URL}/notifications/resolve/${id}`, {}, {
                withCredentials: true,
                headers: NotificationService._getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error("Error resolving notification:", error);
            throw error;
        }
    },
    dismissNotification: async (id: string) => {
        try {
            const response = await axios.patch(`${API_URL}/notifications/dismiss/${id}`, {}, {
                withCredentials: true,
                headers: NotificationService._getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error("Error dismissing notification:", error);
            throw error;
        }
    }
};

"use client";

import { useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export const useHeartbeat = () => {
    const { user } = useAuth();

    const sendHeartbeat = useCallback(async () => {
        // Only send if user is logged in and document is visible to save bandwidth
        if (!user || document.visibilityState !== 'visible') return;

        try {
            const token = localStorage.getItem('auth_token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';

            // Use fetch with no-cors or standard depending on your API setup
            // Heartbeat is lightweight, no body needed
            await fetch(`${apiUrl}/api/users/heartbeat`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            // Silently fail heartbeat pings to avoid distracting console noise
            // but log for debugging if needed
            // console.warn("Heartbeat update suppressed:", error);
        }
    }, [user]);

    useEffect(() => {
        if (!user) return;

        // Immediate ping on mount/auth
        sendHeartbeat();

        // Set up 2-minute interval (120,000 ms)
        const interval = setInterval(sendHeartbeat, 120000);

        // Listen for visibility changes to catch when user returns to tab
        document.addEventListener('visibilitychange', sendHeartbeat);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', sendHeartbeat);
        };
    }, [user, sendHeartbeat]);
};

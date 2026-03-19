
"use client";

import React, { useEffect, useState } from 'react';
import { NotificationService } from '@/services/notification.service';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Notification {
    id: string;
    type: 'PAYMENT' | 'COMMENT' | 'LIKE' | 'WISHLIST' | 'SYSTEM';
    message: string;
    created_at: string;
    user?: {
        full_name: string;
        email: string;
    };
    ui?: {
        title: string;
    };
}

const NotificationTable: React.FC = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [scope, setScope] = useState<'all' | 'me'>('all');

    useEffect(() => {
        if (!user) return;

        const loadNotifications = async () => {
            setLoading(true);
            try {
                const response = await NotificationService.getNotifications(page, 10, scope);
                // Check if response has data property (new structure) or is array (fallback)
                const data = response.data || response;
                setNotifications(Array.isArray(data) ? data : []);
                if (response.meta) {
                    setTotalPages(response.meta.totalPages);
                }
            } catch (error) {
                console.error("Failed to load notifications", error);
                toast.error("Failed to load notifications");
            } finally {
                setLoading(false);
            }
        };

        loadNotifications();
    }, [user, page, scope]);

    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        const handleNewNotification = (newNotification: Notification) => {
            // Only prepend if we are on the first page AND the notification matches current scope
            // scope 'all' -> show everything
            // scope 'me' -> show only if userId matches (assuming backend emits tailored events, which it does)
            
            // For 'me' scope, we rely on the fact that 'new-notification' event is emitted to user's room.
            // However, Admin also joins 'admin' room which receives ALL events.
            // So we need clientside filtering for 'me' scope if the event comes from 'admin' room?
            // Actually, `NotificationBell.tsx` logic suggests `new-notification` is specific to user or filtered there.
            // Let's rely on simple reload or optimistic update if it matches logic.
            
            // Simplified: If scope is 'me' and we receive a notif, check if it belongs to us?
            // current User ID check might be needed if we want strict real-time filtering.
            // For now, let's just append and let refresh handle strictness or assume socket routing is good.
            
           if (page === 1) {
                // If scope is me, we theoretically want to check if notif.userId === user.id
                // But `newNotification` from socket might not have userId on top level depending on structure.
                // Let's just add it. The user can refresh if it looks wrong.
                // Better: Check scope.
                
                if (scope === 'me' && newNotification.user?.email !== user?.email) {
                     return; // Skip if it's someone else's action and we are in 'me' mode
                }

                setNotifications(prev => [{
                    ...newNotification,
                    id: `temp-${Date.now()}`,
                    created_at: new Date().toISOString(),
                    user: newNotification.user,
                    ui: newNotification.ui
                } as Notification, ...prev]);
            }
        };

        socket.on('new-notification', handleNewNotification);

        return () => {
            socket.off('new-notification', handleNewNotification);
        };
    }, [socket, page, scope, user]);

    if (loading && notifications.length === 0) return <div className="text-white">Loading notifications...</div>;

    return (
        <div className="w-full bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden mt-8">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Notifications</h2>
                <div className="flex items-center gap-4">
                     {/* Scope Toggle */}
                    <div className="flex bg-zinc-900/50 rounded-lg p-1 border border-white/5">
                        <button
                            onClick={() => setScope('all')}
                            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${scope === 'all' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                        >
                            All System
                        </button>
                        <button
                            onClick={() => setScope('me')}
                            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${scope === 'me' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                        >
                            My Activity
                        </button>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-white/5 text-left">
                            <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Message</th>
                            {user?.role === 'ADMIN' && scope === 'all' && (
                                <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                            )}
                            <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr>
                                <td colSpan={scope === 'all' ? 4 : 3} className="px-6 py-8 text-center text-gray-500">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-blue-500 animate-spin" />
                                        <span>Loading...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : notifications.length === 0 ? (
                            <tr>
                                <td colSpan={scope === 'all' ? 4 : 3} className="px-6 py-8 text-center text-gray-500">
                                    No recent activity
                                </td>
                            </tr>
                        ) : (
                            notifications.map((notif) => (
                                <tr key={notif.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full border ${notif.type === 'PAYMENT' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                            notif.type === 'LIKE' ? 'bg-pink-500/20 text-pink-400 border-pink-500/30' :
                                                notif.type === 'WISHLIST' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                                                    notif.type === 'COMMENT' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                                        'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                            }`}>
                                            {notif.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-300 group-hover:text-white transition-colors">
                                        {notif.message}
                                    </td>
                                    {user?.role === 'ADMIN' && scope === 'all' && (
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {notif.user ? (
                                                <div className="flex flex-col">
                                                    <span className="text-white">{notif.user.full_name}</span>
                                                    <span className="text-xs text-gray-500">{notif.user.email}</span>
                                                </div>
                                            ) : (
                                                <span className="italic">Unknown</span>
                                            )}
                                        </td>
                                    )}
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                        {format(new Date(notif.created_at), 'MMM d, h:mm a')}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Enhanced Pagination Footer */}
            <div className="p-4 border-t border-white/10 flex items-center justify-between bg-black/20">
                <p className="text-xs text-gray-500">
                    Showing page <span className="font-medium text-white">{page}</span> of <span className="font-medium text-white">{totalPages}</span>
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1 || loading}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white group"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                        Previous
                    </button>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages || loading}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white group"
                    >
                        Next
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 group-hover:translate-x-0.5 transition-transform">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>
            </div>
        </div >
    );
};

export default NotificationTable;

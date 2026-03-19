
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import toast from 'react-hot-toast';
import { NotificationService } from '@/services/notification.service';
import { format } from 'date-fns';

interface NotificationBellProps {
    disableToast?: boolean;
    align?: 'right' | 'left';
}

export default function NotificationBell({ disableToast = false, align = 'right' }: NotificationBellProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [hasUnread, setHasUnread] = useState(false);
    const bellRef = useRef<HTMLDivElement>(null);

    const { user } = useAuth(); // Import useAuth
    const { socket } = useSocket();

    const fetchNotifications = async () => {
        try {
            // Use the service we created
            const result = await NotificationService.getNotifications();
            // API returns { status: true, data: [...], meta: ... }
            const notifs = Array.isArray(result.data) ? result.data : [];
            setNotifications(notifs);
            if (notifs.length > 0) setHasUnread(true);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();

        if (!socket) return;

        // Ensure we join the user's room (important for SPA transitions)
        if (user) {
            socket.emit("setup", user);
        }

        // Listen for the event name we emitted in backend (ensure consistency)
        // Backend: getIO().emit('new-notification', ...)
        socket.on("new-notification", (data: any) => {
            // console.log("🔔 New Notification:", data);

            // Filter: Only show my own notifications in the Bell
            if (String(data.userId) !== String(user?.user_id)) return;

            // Construct a displayable notification object
            const newNotif = {
                ...data,
                created_at: new Date().toISOString()
            };

            setNotifications(prev => {
                // Deduplicate based on ID if present
                if (data.id && prev.some(n => n.id === data.id)) {
                    return prev;
                }
                return [newNotif, ...prev];
            });
            setHasUnread(true);
            if (!disableToast) {
                // Toasts suppressed for everyone as per user request
                // Admin can monitor via the list, users get UI feedback elsewhere
            }
        });

        return () => {
            socket.off("new-notification");
        };
    }, [socket, user]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={bellRef}>
            <button
                onClick={() => { setIsOpen(!isOpen); setHasUnread(false); }}
                className={`relative p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                {hasUnread && (
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-black" />
                )}
            </button>

            {isOpen && (
                <div
                    style={{ zIndex: 100 }}
                    className={`fixed top-20 left-1/2 -translate-x-1/2 w-[90vw] sm:absolute sm:top-full sm:mt-3 sm:w-80 md:w-96 sm:translate-x-0 ${align === 'right' ? 'sm:right-0 sm:left-auto sm:origin-top-right' : 'sm:left-0 sm:right-auto sm:origin-top-left'} rounded-2xl bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-200`}
                >
                    <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                        <h4 className="font-bold text-white text-sm">Notifications</h4>
                        <span className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded font-medium">Recent</span>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length > 0 ? (
                            <div className="divide-y divide-white/5">
                                {notifications.map((notif: any, i) => (
                                    <div key={i} className="p-4 hover:bg-white/5 transition-colors flex gap-3">
                                        <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${notif.type === 'PAYMENT' ? 'bg-emerald-500' :
                                            notif.type === 'LIKE' ? 'bg-pink-500' :
                                                'bg-blue-500'
                                            }`} />
                                        <div>
                                            <p className="text-xs text-gray-300 leading-relaxed mb-1">{notif.message}</p>
                                            <p className="text-[10px] text-gray-500 font-medium">
                                                {notif.created_at ? format(new Date(notif.created_at), 'MMM d, h:mm a') : 'Just now'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500 text-xs">
                                No new notifications
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

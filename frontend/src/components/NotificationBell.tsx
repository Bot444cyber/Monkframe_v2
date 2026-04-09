
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
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
        // Initial fetch
        fetchNotifications();

        // Set up polling (every 2 minutes)
        const interval = setInterval(() => {
            if (user) {
                fetchNotifications();
            }
        }, 120000);

        return () => clearInterval(interval);
    }, [user]);

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
                className={`relative p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                {hasUnread && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border border-white" />
                )}
            </button>

            {isOpen && (
                <div
                    style={{ zIndex: 100 }}
                    className={`fixed top-20 left-1/2 -translate-x-1/2 w-[90vw] sm:absolute sm:top-full sm:mt-3 sm:w-80 md:w-96 sm:translate-x-0 ${align === 'right' ? 'sm:right-0 sm:left-auto sm:origin-top-right' : 'sm:left-0 sm:right-auto sm:origin-top-left'} rounded-2xl bg-white border border-gray-100 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200`}
                >
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                        <h4 className="font-bold text-gray-900 text-sm">Notifications</h4>
                        <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded font-medium">Recent</span>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {notifications.map((notif: any, i) => (
                                    <div key={i} className="p-4 hover:bg-gray-50 transition-colors flex gap-3">
                                        <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${notif.type === 'PAYMENT' ? 'bg-blue-600' :
                                            notif.type === 'LIKE' ? 'bg-pink-500' :
                                                notif.type === 'SYSTEM' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                                                    'bg-blue-600'
                                            }`} />
                                        <div>
                                            <p className="text-xs text-gray-700 leading-relaxed mb-1">{notif.message}</p>
                                            <p className="text-[10px] text-gray-400 font-medium">
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

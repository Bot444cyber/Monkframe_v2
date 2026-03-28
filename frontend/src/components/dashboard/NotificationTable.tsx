"use client";

import React, { useState, useEffect } from 'react';
import { NotificationService } from '@/services/notification.service';
import Pagination from '@/components/Pagination';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';

const NotificationTable = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    const [notifications, setNotifications] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [scope, setScope] = useState<'personal' | 'all'>('personal');

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const result = await NotificationService.getNotifications(page, 10, scope);
            // Assuming the API returns { status: boolean, data: [], meta: { totalPages: number } }
            if (result && result.data) {
                setNotifications(result.data);
                setTotalPages(result.meta?.totalPages || 1);
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [page, scope]);

    // Reset to page 1 when switching scopes
    const handleScopeChange = (newScope: 'personal' | 'all') => {
        setScope(newScope);
        setPage(1);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Scope Toggle - Only for Admins */}
            {isAdmin && (
                <div className="flex gap-2 p-1 w-fit bg-zinc-900/50 border border-white/5 rounded-2xl backdrop-blur-sm">
                    <button
                        onClick={() => handleScopeChange('personal')}
                        className={`px-6 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${scope === 'personal'
                            ? 'bg-white/10 text-white shadow-lg'
                            : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        My Activity
                    </button>
                    <button
                        onClick={() => handleScopeChange('all')}
                        className={`px-6 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${scope === 'all'
                            ? 'bg-white/10 text-white shadow-lg border border-white/5'
                            : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        All User Activity
                    </button>
                </div>
            )}

            <div className="bg-zinc-900/30 border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] bg-white/1">
                                {scope === 'all' && <th className="px-8 py-6">User</th>}
                                <th className="px-8 py-6">Identity</th>
                                <th className="px-8 py-6">Notification Detail</th>
                                <th className="px-8 py-6 text-right">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={scope === 'all' ? 4 : 3} className="px-8 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                                            <span className="text-xs text-zinc-500 font-medium tracking-wide">Retrieving alerts...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : notifications.length > 0 ? (
                                notifications.map((notif, i) => {
                                    const type = (notif.type || 'INFO').toUpperCase();
                                    const userDetails = notif.user;

                                    return (
                                        <tr key={notif.id || i} className="hover:bg-white/2 transition-all duration-300 group">
                                            {scope === 'all' && (
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-[10px] font-bold text-indigo-400">
                                                            {userDetails?.full_name?.charAt(0).toUpperCase() || '?'}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                                                                {userDetails?.full_name || 'Anonymous'}
                                                            </span>
                                                            <span className="text-[10px] text-zinc-500 truncate max-w-[120px]">
                                                                {userDetails?.email || 'No email'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                            )}
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className={`h-2 w-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] ${type === 'PAYMENT' ? 'bg-emerald-500 shadow-emerald-500/40' :
                                                        type === 'LIKE' ? 'bg-rose-500 shadow-rose-500/40' :
                                                            'bg-indigo-500 shadow-indigo-500/40'
                                                        }`} />
                                                    <span className={`text-[10px] font-black tracking-widest px-2 py-0.5 rounded border ${type === 'PAYMENT' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' :
                                                        type === 'LIKE' ? 'border-rose-500/20 text-rose-400 bg-rose-500/5' :
                                                            'border-indigo-500/20 text-indigo-400 bg-indigo-500/5'
                                                        }`}>
                                                        {type}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm text-zinc-300 group-hover:text-white transition-colors leading-relaxed">
                                                    {notif.message}
                                                </p>
                                            </td>
                                            <td className="px-8 py-6 text-right whitespace-nowrap">
                                                <span className="text-[11px] font-mono text-zinc-500 group-hover:text-zinc-400">
                                                    {notif.created_at ? format(new Date(notif.created_at), 'MMM dd, HH:mm') : 'N/A'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={scope === 'all' ? 4 : 3} className="px-8 py-16 text-center">
                                        <div className="flex flex-col items-center gap-2 opacity-40">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-zinc-600">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                            </svg>
                                            <span className="text-xs font-medium text-zinc-500">No recent activity matching your search</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="p-8 border-t border-white/5 bg-black/20">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationTable;

"use client";

import React, { useState, useEffect } from 'react';
import { NotificationService } from '@/services/notification.service';
import Pagination from '@/components/Pagination';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import DashboardTableSkeleton from './DashboardTableSkeleton';

const NotificationTable = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    const [notifications, setNotifications] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [scope, setScope] = useState<'personal' | 'all'>('personal');
    const [filterType, setFilterType] = useState<string>('all');

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const result = await NotificationService.getNotifications(page, 50, scope); // Fetch more for local filtering
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

    const filteredNotifications = notifications.filter(n => {
        if (filterType === 'all') return true;
        return (n.type || '').toUpperCase() === filterType.toUpperCase();
    });

    // Reset to page 1 when switching scopes
    const handleScopeChange = (newScope: 'personal' | 'all') => {
        setScope(newScope);
        setPage(1);
        setFilterType('all');
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Control Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Scope Toggle - Only for Admins */}
                {isAdmin && (
                    <div className="flex gap-2 p-1 w-fit bg-secondary border border-border rounded-2xl backdrop-blur-sm">
                        <button
                            onClick={() => handleScopeChange('personal')}
                            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${scope === 'personal'
                                ? 'bg-foreground text-background shadow-lg'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            My Activity
                        </button>
                        <button
                            onClick={() => handleScopeChange('all')}
                            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${scope === 'all'
                                ? 'bg-foreground text-background shadow-lg border border-border'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            All User Activity
                        </button>
                    </div>
                )}

                {/* Type Filters */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    {['all', 'SYSTEM', 'PAYMENT', 'LIKE'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${filterType === type
                                ? 'bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                                : 'bg-secondary/40 border-border/50 text-muted-foreground hover:text-foreground hover:border-border'
                                }`}
                        >
                            {type === 'all' ? 'All Activity' : type === 'SYSTEM' ? 'Alerts' : type + 's'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500">
                {isLoading ? (
                    <div className="p-6">
                        <DashboardTableSkeleton columns={scope === 'all' ? 5 : 4} />
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] bg-secondary/10">
                                    {scope === 'all' && <th className="px-8 py-6">User</th>}
                                    <th className="px-8 py-6">Identity</th>
                                    <th className="px-8 py-6">Notification Detail</th>
                                    <th className="px-8 py-6">Timestamp</th>
                                    {isAdmin && scope === 'all' && <th className="px-8 py-6 text-right">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredNotifications.length > 0 ? (
                                    filteredNotifications.map((notif, i) => {
                                        const type = (notif.type || 'INFO').toUpperCase();
                                        const userDetails = notif.user;

                                        return (
                                            <tr key={notif.id || i} className="hover:bg-secondary/50 transition-all duration-300 group">
                                                {scope === 'all' && (
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-[10px] font-bold text-primary">
                                                                {userDetails?.full_name?.charAt(0).toUpperCase() || '?'}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-semibold text-foreground truncate max-w-[120px]">
                                                                    {userDetails?.full_name || 'Anonymous'}
                                                                </span>
                                                                <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                                                                    {userDetails?.email || 'No email'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                )}
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`h-2 w-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] ${type === 'PAYMENT' ? 'bg-blue-600 shadow-blue-600/40' :
                                                            type === 'LIKE' ? 'bg-rose-500 shadow-rose-500/40' :
                                                                type === 'SYSTEM' ? 'bg-red-600 shadow-red-600/40' :
                                                                    'bg-blue-600 shadow-blue-600/40'
                                                            }`} />
                                                        <span className={`text-[10px] font-black tracking-widest px-2 py-0.5 rounded border ${type === 'PAYMENT' ? 'border-blue-600/20 text-blue-600 bg-blue-600/5' :
                                                            type === 'LIKE' ? 'border-rose-500/20 text-rose-400 bg-rose-500/5' :
                                                                type === 'SYSTEM' ? 'border-red-600/20 text-red-500 bg-red-600/5' :
                                                                    'border-blue-600/20 text-blue-600 bg-blue-600/5'
                                                            }`}>
                                                            {type}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                                                        {notif.message}
                                                    </p>
                                                </td>
                                                <td className="px-8 py-6 whitespace-nowrap">
                                                    <span className="text-[11px] font-mono text-muted-foreground group-hover:text-foreground">
                                                        {notif.created_at ? format(new Date(notif.created_at), 'MMM dd, HH:mm') : 'N/A'}
                                                    </span>
                                                </td>
                                                {isAdmin && scope === 'all' && (
                                                    <td className="px-8 py-6 text-right">
                                                        {type === 'SYSTEM' && (
                                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                                <button
                                                                    onClick={async () => {
                                                                        try {
                                                                            await NotificationService.resolveNotification(notif.id);
                                                                            toast.success("Resolved");
                                                                            setNotifications(prev => prev.filter(n => n.id !== notif.id));
                                                                        } catch (e) { toast.error("Error"); }
                                                                    }}
                                                                    className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                                                    title="Mark as Fixed"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    onClick={async () => {
                                                                        try {
                                                                            await NotificationService.dismissNotification(notif.id);
                                                                            toast.success("Dismissed");
                                                                            setNotifications(prev => prev.filter(n => n.id !== notif.id));
                                                                        } catch (e) { toast.error("Error"); }
                                                                    }}
                                                                    className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                                                    title="Dismiss Alert"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={scope === 'all' ? 4 : 3} className="px-8 py-16 text-center">
                                            <div className="flex flex-col items-center gap-2 opacity-40">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-muted-foreground/60">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                                </svg>
                                                <span className="text-xs font-medium text-muted-foreground">No recent activity matching your search</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="p-8 border-t border-border bg-secondary/20">
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationTable;

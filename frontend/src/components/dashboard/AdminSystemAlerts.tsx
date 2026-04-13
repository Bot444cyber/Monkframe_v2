"use client";

import React, { useState, useEffect } from 'react';
import { NotificationService } from '@/services/notification.service';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

const AdminSystemAlerts = () => {
    const [alerts, setAlerts] = useState<any[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    const fetchAlerts = async () => {
        try {
            const result = await NotificationService.getNotifications(1, 10, 'all');
            if (result && result.data) {
                // Filter for SYSTEM type and PENDING status (backend already filters for PENDING for admins)
                const systemAlerts = result.data.filter((n: any) => n.type === 'SYSTEM');
                setAlerts(systemAlerts);
                if (systemAlerts.length > 0) {
                    setIsVisible(true);
                }
            }
        } catch (error) {
            console.error("Failed to fetch system alerts", error);
        }
    };

    const handleFix = async (id: string) => {
        try {
            await NotificationService.resolveNotification(id);
            toast.success("Alert marked as FIXED", {
                icon: '✅',
                style: {
                    borderRadius: '12px',
                    background: '#1200FF',
                    color: '#fff',
                    fontWeight: 'bold',
                },
            });
            setAlerts(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            toast.error("Failed to update alert");
        }
    };

    const handleDismiss = async (id: string) => {
        try {
            await NotificationService.dismissNotification(id);
            toast.success("Alert marked as DISMISSED", {
                icon: '✖️',
                style: {
                    borderRadius: '12px',
                    background: '#333',
                    color: '#fff',
                    fontWeight: 'bold',
                },
            });
            setAlerts(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            toast.error("Failed to update alert");
        }
    };

    useEffect(() => {
        fetchAlerts();
        const interval = setInterval(fetchAlerts, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    if (!isVisible || alerts.length === 0) return null;

    return (
        <div className="fixed top-24 right-6 z-60 flex flex-col items-end gap-3 pointer-events-none">
            <AnimatePresence>
                {alerts.map((alert, index) => (
                    <motion.div
                        key={alert.id || index}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 50, scale: 0.9 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="pointer-events-auto group w-[420px] bg-card border border-red-500/20 rounded-3xl p-6 shadow-xl overflow-hidden relative"
                    >
                        {/* Dynamic Background */}
                        <div className="absolute inset-0 bg-linear-to-br from-red-500/3 via-transparent to-red-500/3" />

                        {/* Top Indicator */}
                        <div className="absolute top-0 right-0 p-3">
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-red-500">Live Critical</span>
                            </div>
                        </div>

                        <div className="relative z-10 flex flex-col gap-4">
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                    <div className="absolute inset-0 bg-red-500/10 animate-ping opacity-20" />
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                    </svg>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                                            System Incident
                                        </span>
                                        <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                        <span className="text-[10px] font-mono text-muted-foreground/60">
                                            {format(new Date(alert.created_at), 'HH:mm:ss')}
                                        </span>
                                    </div>
                                    <h3 className="text-base font-black text-foreground leading-tight tracking-tight group-hover:text-red-500 transition-colors duration-300">
                                        {alert.message}
                                    </h3>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-red-500/10">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    Review Required
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Mark as Fixed */}
                                    <button
                                        onClick={() => handleFix(alert.id)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all duration-300 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/5 group/btn"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                        Fix Issue
                                    </button>

                                    {/* Not Possible / Dismiss */}
                                    <button
                                        onClick={() => handleDismiss(alert.id)}
                                        className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary/50 border border-border text-muted-foreground hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all duration-300 group/close"
                                        title="Not Possible to fix / Dismiss"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover/close:rotate-90 transition-transform duration-300">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Side Aesthetic Bar with Glow */}
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-linear-to-b from-red-600 to-red-400 shadow-[0_0_20px_rgba(239,68,68,0.6)]" />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default AdminSystemAlerts;

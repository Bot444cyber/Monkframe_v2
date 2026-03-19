"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/components/ts/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ... imports
import Pagination from '@/components/Pagination';

// ... existing icons ...
const Icons = {
    // ... existing icons
    Heart: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
    ),
    Settings: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
    ),
    LogOut: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
    ),
    User: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
    ),
    Mail: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
    ),
    Shield: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
    ),
    ArrowRight: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
    ),
    CreditCard: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
    )
};

export default function ProfilePage() {
    const { user, isLoading: authLoading, logout } = useAuth();
    const router = useRouter();

    // --- State ---
    const [activeTab, setActiveTab] = useState<'wishlist' | 'settings' | 'payments'>('wishlist');
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [payments, setPayments] = useState<any[]>([]);

    // Pagination State
    const [wishlistPage, setWishlistPage] = useState(1);
    const [wishlistTotalPages, setWishlistTotalPages] = useState(1);
    const [paymentsPage, setPaymentsPage] = useState(1);
    const [paymentsTotalPages, setPaymentsTotalPages] = useState(1);

    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // --- Effects ---
    const fetchProfile = async (wPage = 1, pPage = 1) => {
        if (user?.user_id) {
            try {
                setLoading(true);
                const token = localStorage.getItem('auth_token');
                const headers: any = {};
                if (token) headers['Authorization'] = `Bearer ${token}`

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/profile?wishlistPage=${wPage}&wishlistLimit=6&paymentsPage=${pPage}&paymentsLimit=5`, { headers });
                const data = await res.json();

                if (data.status) {
                    setProfileData(data.data);

                    // Wishlist
                    const wishlistData = data.data.wishlist.map((item: any) => ({
                        ...item,
                        price: !item.price || item.price == 0 ? 'Free' : `$${item.price}`
                    }));
                    setWishlist(wishlistData);
                    setWishlistTotalPages(data.data.meta?.wishlist?.totalPages || 1);

                    // Payments
                    setPayments(data.data.payments || []);
                    setPaymentsTotalPages(data.data.meta?.payments?.totalPages || 1);
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (user) {
            fetchProfile(wishlistPage, paymentsPage);
        }
    }, [user, wishlistPage, paymentsPage]); // Re-fetch when page changes

    // --- Button Styles (Reusable) ---
    const buttonStyles = {
        primary: `
            relative overflow-hidden group
            px-8 py-3 rounded-xl 
            bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 
            bg-[length:200%_auto] animate-gradient
            text-white font-bold tracking-wide text-sm
            shadow-[0_0_20px_-5px_rgba(124,58,237,0.5)]
            hover:shadow-[0_0_25px_-5px_rgba(124,58,237,0.7)]
            hover:scale-[1.02] active:scale-[0.98]
            transition-all duration-300 ease-out
            border border-white/10
        `,
        secondary: `
            px-6 py-2.5 rounded-xl
            bg-zinc-900/50 backdrop-blur-md
            border border-white/5
            text-zinc-400 font-medium text-sm
            hover:bg-zinc-800 hover:text-white hover:border-white/20
            hover:-translate-y-0.5
            active:translate-y-0
            transition-all duration-200
        `,
        danger: `
            px-6 py-3 rounded-xl
            bg-red-500/10 border border-red-500/20
            text-red-400 font-bold text-sm tracking-wide
            hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-300 hover:scale-[1.02]
            shadow-[0_0_15px_-5px_rgba(239,68,68,0.3)]
            transition-all duration-200
        `,
        tabActive: `
            flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white
            bg-gradient-to-b from-zinc-800 to-zinc-900
            border border-white/10
            shadow-[0_4px_12px_rgba(0,0,0,0.5)]
            transition-all duration-300
        `,
        tabInactive: `
            flex-1 py-3 px-4 rounded-xl text-sm font-medium text-zinc-500
            hover:text-zinc-300 hover:bg-white/5
            transition-all duration-300
        `
    };

    function EmptyState() {
        return (
            <div className="py-24 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-500 group">
                <div className="w-20 h-20 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-full flex items-center justify-center mb-6 border border-white/5 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <Icons.Heart className="w-8 h-8 text-zinc-600 group-hover:text-indigo-400 transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Your wishlist is empty</h3>
                <p className="text-zinc-500 max-w-sm mx-auto mb-8 leading-relaxed">
                    Start exploring and save the designs that inspire you the most.
                </p>
                <Link href="/browse" className={buttonStyles.secondary + " flex items-center gap-2"}>
                    Browse Designs <Icons.ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    if (authLoading || (!user && loading)) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
                    <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-b-purple-500/50 animate-spin-reverse"></div>
                </div>
            </div>
        );
    }

    // Use profileData if available, otherwise fallback to context user
    const displayUser = profileData || user;

    if (!displayUser) return null;

    return (
        <main className="min-h-screen bg-[#030303] text-white selection:bg-indigo-500/30 flex flex-col font-sans">
            {/* --- Advanced Background --- */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {/* Noise Texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
                {/* Glowing Orbs */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen" />
            </div>

            <div className="container mx-auto px-4 md:px-6 pt-32 pb-20 relative z-10 max-w-5xl flex-1 flex flex-col items-center">

                {/* --- Profile Header --- */}
                <header className="mb-16 relative w-full max-w-4xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 blur-3xl rounded-full -z-10" />

                    <div className="flex flex-col md:flex-row items-center md:items-end gap-8 justify-center md:justify-start">
                        {/* Avatar Section */}
                        <div className="relative group shrink-0">
                            {/* Animated Glow Ring */}
                            <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full blur opacity-40 group-hover:opacity-100 group-hover:blur-md transition-all duration-500"></div>

                            <div className="relative w-32 h-32 rounded-full bg-[#0a0a0a] flex items-center justify-center text-4xl font-bold text-white ring-4 ring-[#030303] overflow-hidden">
                                {displayUser.full_name ? (
                                    <span className="bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
                                        {displayUser.full_name.charAt(0).toUpperCase()}
                                    </span>
                                ) : (
                                    displayUser.email ? displayUser.email.charAt(0).toUpperCase() : 'U'
                                )}
                            </div>

                            {/* Status Indicator */}
                            <div className="absolute bottom-1 right-1 bg-[#030303] p-1 rounded-full">
                                <div className="w-5 h-5 bg-emerald-500 border border-emerald-400/50 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                            </div>
                        </div>

                        {/* User Info Section */}
                        <div className="flex-1 text-center md:text-left space-y-3">
                            <div className="flex flex-col items-center md:items-start">
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
                                    {displayUser.full_name || "User"}
                                </h1>
                                <div className="flex items-center justify-center md:justify-start gap-2">
                                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-400 flex items-center gap-2">
                                        <Icons.Mail className="w-3 h-3" />
                                        {displayUser.email}
                                    </span>
                                    {String(displayUser.role) === 'ADMIN' && (
                                        <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-400 uppercase tracking-wider">
                                            Admin
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Stats Bar */}
                            <div className="inline-flex items-center gap-6 px-6 py-3 bg-zinc-900/40 backdrop-blur-xl rounded-2xl border border-white/5 shadow-xl mt-4">
                                <div className="flex flex-col items-center">
                                    <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Saved</span>
                                    <span className="text-xl font-bold text-white">{displayUser.meta?.wishlist?.total || wishlist.length || 0}</span>
                                </div>
                                <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
                                <div className="flex flex-col items-center">
                                    <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Purchases</span>
                                    <span className="text-xl font-bold text-white">{displayUser.meta?.payments?.total || payments.length || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex flex-col gap-3">
                            <button
                                onClick={logout}
                                className={buttonStyles.danger + " bg-red-500/20 text-red-300 border-red-500/30 shadow-[0_0_20px_-5px_rgba(239,68,68,0.4)] flex items-center gap-2 px-6 py-3 rounded-xl transition-all hover:scale-105 active:scale-95"}
                            >
                                <Icons.LogOut className="w-5 h-5" />
                                <span className="font-bold">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* --- Content Tabs --- */}
                <div className="flex p-1.5 bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-white/5 w-full max-w-lg mx-auto mb-12 shadow-inner">
                    <button
                        onClick={() => setActiveTab('wishlist')}
                        className={`flex items-center justify-center gap-2.5 ${activeTab === 'wishlist' ? buttonStyles.tabActive : buttonStyles.tabInactive}`}
                    >
                        <Icons.Heart className={`w-4 h-4 ${activeTab === 'wishlist' ? 'fill-pink-500 text-pink-500' : ''}`} />
                        Wishlist
                    </button>
                    <button
                        onClick={() => setActiveTab('payments')}
                        className={`flex items-center justify-center gap-2.5 ${activeTab === 'payments' ? buttonStyles.tabActive : buttonStyles.tabInactive}`}
                    >
                        <Icons.CreditCard className={`w-4 h-4 ${activeTab === 'payments' ? 'text-indigo-400' : ''}`} />
                        History
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`flex items-center justify-center gap-2.5 ${activeTab === 'settings' ? buttonStyles.tabActive : buttonStyles.tabInactive}`}
                    >
                        <Icons.Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'animate-spin-slow' : ''}`} />
                        Settings
                    </button>
                </div>

                {/* --- Dynamic Content Area --- */}
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 w-full max-w-5xl">

                    {/* VIEW: Wishlist */}
                    {activeTab === 'wishlist' && (
                        <>
                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="aspect-[1.4/1] rounded-3xl bg-zinc-900/50 border border-white/5 animate-pulse" />
                                    ))}
                                </div>
                            ) : wishlist.length > 0 ? (
                                <div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                                        {wishlist.map((ui) => (
                                            <ProductCard key={ui.id} product={ui} />
                                        ))}
                                    </div>
                                    <Pagination
                                        currentPage={wishlistPage}
                                        totalPages={wishlistTotalPages}
                                        onPageChange={setWishlistPage}
                                    />
                                </div>
                            ) : (
                                <EmptyState />
                            )}
                        </>
                    )}

                    {/* VIEW: Payments */}
                    {activeTab === 'payments' && (
                        <div className="w-full">
                            <h3 className="text-xl font-bold text-white mb-6 px-2">Purchase History</h3>
                            {payments.length > 0 ? (
                                <div className="space-y-4">
                                    {payments.map((payment) => (
                                        <div key={payment.id} className="flex flex-col md:flex-row items-center justify-between p-6 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-white/10 transition-all group">
                                            <div className="flex items-center gap-4 w-full md:w-auto">
                                                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                                    <Icons.CreditCard className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold">{payment.ui?.title || 'Unknown Product'}</h4>
                                                    <p className="text-zinc-500 text-xs mt-1">{new Date(payment.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between w-full md:w-auto mt-4 md:mt-0 gap-8">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${payment.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                    }`}>
                                                    {payment.status}
                                                </span>
                                                <span className="text-xl font-bold text-white">${payment.amount}</span>
                                            </div>
                                        </div>
                                    ))}
                                    <Pagination
                                        currentPage={paymentsPage}
                                        totalPages={paymentsTotalPages}
                                        onPageChange={setPaymentsPage}
                                    />
                                </div>
                            ) : (
                                <div className="text-center py-24 text-zinc-500 border border-dashed border-white/10 rounded-3xl">
                                    No purchase history found.
                                </div>
                            )}
                        </div>
                    )}

                    {/* VIEW: Settings */}
                    {activeTab === 'settings' && (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-[#080808] border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                                {/* Decor */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                                <div className="space-y-8 relative z-10">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Profile Settings</h3>
                                        <p className="text-zinc-500 text-sm mt-1">Manage your personal information and preferences.</p>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Input Group: Name */}
                                        <div className="space-y-2 group">
                                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1 group-focus-within:text-indigo-400 transition-colors">
                                                Full Name
                                            </label>
                                            <div className="relative transition-all duration-300 transform group-focus-within:scale-[1.01]">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors">
                                                    <Icons.User className="w-5 h-5" />
                                                </div>
                                                <input
                                                    type="text"
                                                    defaultValue={displayUser.full_name}
                                                    className="w-full bg-zinc-900/50 border border-white/10 text-white rounded-xl py-4 pl-12 pr-4 
                                                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-zinc-900
                                                    placeholder:text-zinc-700 transition-all shadow-inner"
                                                    placeholder="Enter your name"
                                                />
                                            </div>
                                        </div>

                                        {/* Input Group: Email */}
                                        <div className="space-y-2 group">
                                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">
                                                Email Address
                                            </label>
                                            <div className="relative opacity-75">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                                                    <Icons.Mail className="w-5 h-5" />
                                                </div>
                                                <input
                                                    type="email"
                                                    value={displayUser.email}
                                                    readOnly
                                                    className="w-full bg-[#050505] border border-white/5 text-zinc-400 rounded-xl py-4 pl-12 pr-4 cursor-not-allowed text-sm"
                                                />
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                                                    <Icons.Shield className="w-3 h-3 text-emerald-500" />
                                                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wide">Verified</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Footer */}
                                    <div className="pt-8 mt-8 border-t border-white/5 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                                        <button
                                            onClick={logout}
                                            className={buttonStyles.danger + " w-full sm:w-auto flex items-center justify-center gap-2"}
                                        >
                                            <Icons.LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>

                                        <button className={buttonStyles.primary + " w-full sm:w-auto"}>
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                Save Changes
                                            </span>
                                            {/* Shine Effect */}
                                            <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-shine" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Admin Link */}
                            {String(displayUser.role) === 'ADMIN' && (
                                <Link href="/dashboard" className="block mt-6 group">
                                    <div className="p-1 rounded-2xl bg-gradient-to-r from-red-500/20 to-orange-500/20 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-[#0a0a0a] rounded-xl p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                                                    <Icons.Shield className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold text-sm">Admin Dashboard</h4>
                                                    <p className="text-zinc-500 text-xs">Manage products and users</p>
                                                </div>
                                            </div>
                                            <Icons.ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* --- Global Styles for Animations --- */}
            <style>{`
                @keyframes shine {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
                .animate-shine {
                    animation: shine 1s;
                }
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient {
                    animation: gradient 6s ease infinite;
                }
                .animate-spin-slow {
                    animation: spin 8s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </main>
    );
}
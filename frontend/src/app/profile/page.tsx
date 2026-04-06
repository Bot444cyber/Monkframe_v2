"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/components/ts/types';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Pagination from '@/components/Pagination';

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
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
    Shield: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
    ),
    CreditCard: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
    ),
    Menu: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
    ),
    X: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
    ),
    ArrowLeft: ({ className }: { className?: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
    ),
};

type Tab = 'wishlist' | 'payments' | 'settings';

const TAB_CONFIG: { id: Tab; label: string; icon: keyof typeof Icons }[] = [
    { id: 'wishlist', label: 'My Collection', icon: 'Heart' },
    { id: 'payments', label: 'Transactions', icon: 'CreditCard' },
    { id: 'settings', label: 'Settings', icon: 'Settings' },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function ProfilePage() {
    const { user, isLoading: authLoading, logout } = useAuth();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<Tab>('wishlist');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [payments, setPayments] = useState<any[]>([]);
    const [wishlistPage, setWishlistPage] = useState(1);
    const [wishlistTotalPages, setWishlistTotalPages] = useState(1);
    const [paymentsPage, setPaymentsPage] = useState(1);
    const [paymentsTotalPages, setPaymentsTotalPages] = useState(1);
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (wPage = 1, pPage = 1) => {
        if (user?.user_id) {
            try {
                setLoading(true);
                const token = localStorage.getItem('auth_token');
                const headers: any = {};
                if (token) headers['Authorization'] = `Bearer ${token}`;

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/profile?wishlistPage=${wPage}&wishlistLimit=6&paymentsPage=${pPage}&paymentsLimit=5`,
                    { headers }
                );
                const data = await res.json();

                if (data.status) {
                    setProfileData(data.data);
                    const wishlistData = data.data.wishlist.map((item: any) => ({
                        ...item,
                        price: !item.price || item.price == 0 ? 'Free' : `$${item.price}`
                    }));
                    setWishlist(wishlistData);
                    setWishlistTotalPages(data.data.meta?.wishlist?.totalPages || 1);
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
        if (user) fetchProfile(wishlistPage, paymentsPage);
    }, [user, wishlistPage, paymentsPage, activeTab]);

    // Close sidebar on tab change (mobile)
    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);
        setSidebarOpen(false);
    };

    if (authLoading || (!user && loading)) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 rounded-full border-2 border-gray-100 border-t-amber-500 animate-spin" />
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest">Loading</p>
                </div>
            </div>
        );
    }

    const displayUser = profileData || user;
    if (!displayUser) return null;

    const initials = displayUser.full_name
        ? displayUser.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
        : displayUser.email?.charAt(0).toUpperCase();

    const tabTitle = { wishlist: 'My Collection', payments: 'Transactions', settings: 'Settings' }[activeTab];
    const tabSub = {
        wishlist: `${wishlist.length} saved asset${wishlist.length !== 1 ? 's' : ''}`,
        payments: `${payments.length} completed order${payments.length !== 1 ? 's' : ''}`,
        settings: 'Manage your account',
    }[activeTab];

    const SidebarContent = () => (
        <>
            {/* ── Brand ── */}
            <Link
                href="/"
                className="flex items-center gap-3 pb-6 mb-6 px-2 border-b border-gray-100 group"
                onClick={() => setSidebarOpen(false)}
            >
                <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 bg-gray-100 border border-gray-200 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    <Image
                        src="/svg/logo.svg"
                        alt="Monkframe"
                        width={28}
                        height={28}
                        className="w-6 h-6 object-contain"
                    />
                </div>
                <div>
                    <span className="text-base font-black tracking-tight text-gray-900 leading-none block mb-0.5">
                        Monkframe
                    </span>
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] block">
                        Design Assets
                    </span>
                </div>
            </Link>

            {/* ── Navigation ── */}
            <nav className="flex-1 space-y-1.5 px-1 overflow-y-auto pr-2 custom-scrollbar">
                {TAB_CONFIG.map(({ id, label, icon }) => {
                    const Icon = Icons[icon];
                    const isActive = activeTab === id;
                    return (
                        <button
                            key={id}
                            onClick={() => handleTabChange(id)}
                            className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                                ? 'bg-amber-500/10 text-amber-500 shadow-sm border border-amber-500/20'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <Icon className="w-[18px] h-[18px] shrink-0" />
                            {label}
                        </button>
                    );
                })}

                {/* Admin shortcut */}
                {String(displayUser.role) === 'ADMIN' && (
                    <div className="pt-2 mt-2 border-t border-border">
                        <Link
                            href="/dashboard"
                            className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-semibold text-amber-500 hover:text-amber-600 hover:bg-amber-500/5 transition-all duration-200"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <Icons.Shield className="w-[18px] h-[18px] shrink-0" />
                            Admin Panel
                        </Link>
                    </div>
                )}
            </nav>

            {/* ── Footer: User Profile & Actions ── */}
            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-5 px-1">

                {/* User Info */}
                <div className="flex items-center gap-3 px-1">
                    <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-sm font-black text-gray-900 shrink-0 shadow-inner">
                        {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-gray-900 truncate">{displayUser.full_name || 'User'}</p>
                        <p className="text-[11px] text-gray-500 truncate">{displayUser.email}</p>
                    </div>
                    {String(displayUser.role) === 'ADMIN' && (
                        <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.5)]" title="Admin Account" />
                    )}
                </div>

                {/* Logout Button */}
                <button
                    onClick={logout}
                    // Updated colors: light red base (text-red-400, bg-red-500/10) to heavy red hover (hover:bg-red-600, hover:text-white)
                    className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-600 hover:text-white hover:border-red-600 hover:shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all duration-300"
                >
                    <Icons.LogOut className="w-4 h-4 shrink-0" />
                    Sign out
                </button>
            </div>
        </>
    );

    return (
        <main className="min-h-screen bg-white text-gray-900 flex font-sans antialiased overflow-x-hidden">

            {/* ── Mobile overlay ── */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-white/80 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── Sidebar ── */}
            <aside className={`
                fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100
                flex flex-col p-5 z-40
                transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:sticky lg:h-screen
            `}>
                <SidebarContent />
            </aside>

            {/* ── Main ── */}
            <div className="flex-1 min-w-0 flex flex-col">

                {/* Mobile topbar */}
                <div className="sticky top-0 z-20 flex items-center gap-4 px-5 h-14 bg-white/95 backdrop-blur border-b border-gray-100 lg:hidden">
                    <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-50 transition-all">
                        <Icons.Menu className="w-5 h-5 text-gray-500" />
                    </button>
                    <Image src="/svg/logo.svg" alt="Monkframe" width={22} height={22} className="invert dark:invert-0 opacity-90" />
                    <span className="font-black text-sm tracking-tight text-gray-900">Monkframe</span>
                    <span className="ml-auto text-xs text-gray-500 font-semibold">{tabTitle}</span>
                </div>

                {/* Page content */}
                <div className="flex-1 px-6 py-10 lg:px-12 lg:py-12 w-full max-w-[1600px] mx-auto">

                    {/* Page header */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.25em] mb-2">Profile</p>
                            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter leading-none text-gray-900">{tabTitle}</h1>
                            <p className="text-gray-500 text-sm mt-2">{tabSub}</p>
                        </div>

                        {/* Mini stats */}
                        <div className="grid grid-cols-2 sm:flex gap-3 shrink-0">
                            <div className="px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl text-center sm:min-w-[80px]">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Saved</span>
                                <span className="text-xl font-black text-gray-900">{displayUser.meta?.wishlist?.total ?? wishlist.length}</span>
                            </div>
                            <div className="px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl text-center sm:min-w-[80px]">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Orders</span>
                                <span className="text-xl font-black text-gray-900">{displayUser.meta?.payments?.total ?? payments.length}</span>
                            </div>
                        </div>
                    </div>

                    {/* ── Wishlist ─────────────────────────────────────────────── */}
                    {activeTab === 'wishlist' && (
                        <div className="animate-in fade-in duration-500">
                            {loading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="aspect-4/3 bg-gray-100 rounded-2xl animate-pulse" />
                                    ))}
                                </div>
                            ) : wishlist.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                                        {wishlist.map((ui) => <ProductCard key={ui.id} product={ui} />)}
                                    </div>
                                    <div className="mt-10">
                                        <Pagination currentPage={wishlistPage} totalPages={wishlistTotalPages} onPageChange={setWishlistPage} />
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center min-h-[500px] py-28 rounded-[2.5rem] border border-dashed border-gray-200 text-center gap-6 bg-gray-50/50">
                                    <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center">
                                        <Icons.Heart className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <div className="max-w-xs">
                                        <p className="text-xl text-gray-900 font-black mb-2 italic">Your collection is empty</p>
                                        <p className="text-gray-500 text-sm leading-relaxed">Save assets you love to find them here and build your personal design library.</p>
                                    </div>
                                    <Link
                                        href="/"
                                        className="mt-4 px-8 py-3 bg-gray-900 text-white rounded-2xl text-sm font-black hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/10 active:scale-95 translate-y-0"
                                    >
                                        Browse Assets
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Payments ─────────────────────────────────────────────── */}
                    {activeTab === 'payments' && (
                        <div className="animate-in fade-in duration-500">
                            {payments.length > 0 ? (
                                <>
                                    <div className="space-y-2">
                                        {payments.map((p) => (
                                            <div
                                                key={p.id}
                                                className="group relative flex flex-col xl:flex-row xl:items-center gap-6 p-6 bg-white border border-gray-100 rounded-[2rem] hover:border-gray-200 hover:shadow-2xl transition-all duration-500"
                                            >
                                                {/* ── Asset Thumbnail ── */}
                                                <div className="relative w-full xl:w-48 aspect-video xl:aspect-square rounded-2xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                                                    <img
                                                        src={p.ui?.imageSrc || '/img/placeholder.jpg'}
                                                        alt={p.ui?.title}
                                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                                    />
                                                    <div className="absolute inset-0 bg-radial-to-t from-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                </div>

                                                {/* ── Order Details ── */}
                                                <div className="flex-1 min-w-0 space-y-4 text-gray-900">
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center flex-wrap gap-2">
                                                            <h3 className="text-lg font-black text-gray-900 truncate max-w-[300px]">{p.ui?.title || 'Digital Asset'}</h3>
                                                            <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[9px] font-black text-amber-600 uppercase tracking-widest">
                                                                {p.ui?.category || 'Asset'}
                                                            </span>
                                                            {p.ui?.fileType && (
                                                                <span className="px-2 py-0.5 rounded-lg bg-gray-50 border border-gray-200 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                                                                    {p.ui.fileType}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-3 text-gray-500 text-[11px] font-bold">
                                                            <span className="flex items-center gap-1.5">
                                                                <Icons.CreditCard className="w-3.5 h-3.5" />
                                                                Paid via Stripe
                                                            </span>
                                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                                            <span>{new Date(p.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 sm:flex sm:items-center gap-6 sm:gap-12">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reference ID</span>
                                                            <span className="text-xs font-mono text-gray-500 font-bold tracking-tight uppercase">{p.id.slice(0, 14)}...</span>
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Status</span>
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'COMPLETED' ? 'bg-amber-500' : 'bg-amber-300'}`} />
                                                                <span className={`text-[11px] font-black uppercase tracking-widest ${p.status === 'COMPLETED' ? 'text-amber-500' : 'text-amber-400'}`}>
                                                                    {p.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* ── Price & Actions ── */}
                                                <div className="flex flex-col sm:flex-row xl:flex-col items-center justify-between xl:justify-center gap-4 xl:pl-6 xl:border-l border-gray-100 shrink-0 min-w-[140px]">
                                                    <div className="text-center xl:mb-2">
                                                        <span className="text-2xl font-black text-gray-900 italic tracking-tighter">${p.amount}</span>
                                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Total Paid</p>
                                                    </div>

                                                    <div className="flex items-center gap-2 w-full sm:w-auto xl:w-full">
                                                        <Link
                                                            href={`/product/${p.uiId}`}
                                                            className="flex-1 sm:flex-none xl:flex-1 h-10 px-4 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center hover:bg-gray-800 transition-all active:scale-95"
                                                        >
                                                            Download
                                                        </Link>
                                                        <button
                                                            title="View Invoice"
                                                            className="h-10 w-10 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all active:scale-95"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-10">
                                        <Pagination currentPage={paymentsPage} totalPages={paymentsTotalPages} onPageChange={setPaymentsPage} />
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center min-h-[500px] py-28 rounded-[2.5rem] border border-dashed border-gray-200 text-center gap-6 bg-gray-50/50">
                                    <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center">
                                        <Icons.CreditCard className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <div className="max-w-xs">
                                        <p className="text-xl text-gray-900 font-black mb-2 italic">No purchases yet</p>
                                        <p className="text-gray-500 text-sm leading-relaxed">Your purchase history will appear here once you start building your collection.</p>
                                    </div>
                                    <Link
                                        href="/"
                                        className="mt-4 px-8 py-3 bg-gray-900 text-white rounded-2xl text-sm font-black hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/10 active:scale-95 translate-y-0"
                                    >
                                        Browse Assets
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Account Overview ─────────────────────────────────────── */}
                    {activeTab === 'settings' && (
                        <div className="animate-in fade-in duration-500 flex flex-col items-center py-6">

                            {/* Avatar */}
                            <div className="relative mb-5">
                                <div className="w-20 h-20 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center text-3xl font-black text-gray-900 select-none">
                                    {initials}
                                </div>
                                {/* Online indicator */}
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-500 border-2 border-white rounded-full" />
                            </div>

                            <h2 className="text-2xl font-black tracking-tight text-gray-900 mb-0.5">{displayUser.full_name || '—'}</h2>
                            <p className="text-gray-500 text-sm mb-1">{displayUser.email?.toLowerCase()}</p>
                            {/* Member since */}
                            {displayUser.created_at && (
                                <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-widest mb-8">
                                    Member since {new Date(displayUser.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </p>
                            )}

                            {/* Detail rows — all from backend */}
                            <div className="w-full max-w-2xl space-y-3">
                                {[
                                    {
                                        label: 'Full Name',
                                        value: displayUser.full_name || '—',
                                        icon: <Icons.User className="w-4 h-4" />,
                                        badge: null,
                                    },
                                    {
                                        label: 'Email Address',
                                        value: displayUser.email?.toLowerCase() || '—',
                                        icon: (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                        ),
                                        badge: { text: 'Verified', color: 'text-amber-600 bg-amber-50 border-amber-100' },
                                    },
                                    {
                                        label: 'Account Role',
                                        value: (() => {
                                            const r = String(displayUser.role).toUpperCase();
                                            if (r === 'ADMIN') return 'Administrator';
                                            if (r === 'EDITOR') return 'Editor';
                                            if (r === 'CUSTOMER') return 'Customer';
                                            return r || 'Member';
                                        })(),
                                        icon: <Icons.Shield className="w-4 h-4" />,
                                        badge: (() => {
                                            const r = String(displayUser.role).toUpperCase();
                                            if (r === 'ADMIN') return { text: 'Admin', color: 'text-gray-900 bg-gray-100 border-gray-200' };
                                            if (r === 'EDITOR') return { text: 'Editor', color: 'text-amber-600 bg-amber-50 border-amber-200' };
                                            if (r === 'CUSTOMER') return { text: 'Customer', color: 'text-gray-500 bg-gray-50 border-gray-100' };
                                            return { text: 'Member', color: 'text-gray-500 bg-gray-50 border-gray-100' };
                                        })(),
                                    },
                                    {
                                        label: 'Login Method',
                                        // google_id present → Google OAuth, otherwise Email & Password
                                        value: displayUser.google_id ? 'Google OAuth' : 'Email & Password',
                                        icon: displayUser.google_id ? (
                                            // Google "G" icon
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                        ),
                                        badge: displayUser.google_id
                                            ? { text: 'OAuth', color: 'text-amber-500 bg-amber-50 border-amber-100' }
                                            : null,
                                    },
                                    {
                                        label: 'Account Status',
                                        value: displayUser.status === 'SUSPENDED' ? 'Suspended' : 'Active',
                                        icon: (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
                                        ),
                                        badge: displayUser.status === 'SUSPENDED'
                                            ? { text: 'Suspended', color: 'text-red-500 bg-red-50 border-red-100' }
                                            : { text: 'Active', color: 'text-amber-600 bg-amber-50 border-amber-100' },
                                    },
                                    {
                                        label: 'Member Since',
                                        value: displayUser.created_at
                                            ? new Date(displayUser.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
                                            : '—',
                                        icon: (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                                        ),
                                        badge: null,
                                    },
                                ].map(({ label, value, icon, badge }) => (
                                    <div
                                        key={label}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all duration-150"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span className="text-gray-400 shrink-0">{icon}</span>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.18em] mb-0.5">{label}</p>
                                                <p className="text-sm font-semibold text-gray-900 truncate max-w-[250px] sm:max-w-none">{value}</p>
                                            </div>
                                        </div>
                                        {badge && (
                                            <span className={`w-fit shrink-0 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${badge.color}`}>
                                                {badge.text}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
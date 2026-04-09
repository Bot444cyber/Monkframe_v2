"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/components/ts/types';
import { InteractionService } from '@/services/interaction.service';
import CommentSection from '@/components/CommentSection';

// Imports from new components
import NotificationTable from '@/components/dashboard/NotificationTable';
import OverviewSection from '@/components/dashboard/OverviewSection';
import InventorySection from '@/components/dashboard/InventorySection';
import PaymentsSection from '@/components/dashboard/PaymentsSection';
import UsersSection from '@/components/dashboard/UsersSection';
import DriveSection from '@/components/dashboard/DriveSection';
import DashboardModals from '@/components/dashboard/DashboardModals';
import ResetDataModal from '@/components/dashboard/ResetDataModal';
import { OverviewData } from '@/components/dashboard/types';
import NotificationBell from '@/components/NotificationBell';
import { ThemeToggle } from '@/components/ThemeToggle';

type Tab = 'overview' | 'uis' | 'payments' | 'users' | 'activity' | 'drive';

import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function Dashboard() {
    const { user, logout, isLoading: authLoading } = useAuth(); // Get user
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [uis, setUIs] = useState<Product[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [payments, setPayments] = useState<any[]>([]);
    const [overviewData, setOverviewData] = useState<OverviewData>({
        stats: [
            { label: 'Total Downloads', value: '0', change: '+0%', color: 'emerald' },
            { label: 'Active Users', value: '0', change: '+0%', color: 'indigo' },
            { label: 'Live UIs', value: '0', change: '+0%', color: 'blue' },

        ],
        graphData: [],

        trendingUIs: [],
        paymentStatusDistribution: { completed: 0, pending: 0, canceled: 0, failed: 0 },
        formattedActivities: []
    });

    // Pagination State
    const [uisPage, setUisPage] = useState(1);
    const [uisTotalPages, setUisTotalPages] = useState(1);
    const [usersPage, setUsersPage] = useState(1);
    const [usersTotalPages, setUsersTotalPages] = useState(1);
    const [paymentsPage, setPaymentsPage] = useState(1);
    const [paymentsTotalPages, setPaymentsTotalPages] = useState(1);

    const [isLoading, setIsLoading] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentUI, setCurrentUI] = useState<Partial<Product>>({});
    const [files, setFiles] = useState<{ banner: File | null; uiFile: File | null; showcase: File[] }>({ banner: null, uiFile: null, showcase: [] });
    const [previews, setPreviews] = useState<{ banner: string | null; showcase: string[] }>({ banner: null, showcase: [] });
    const [openCommentsId, setOpenCommentsId] = useState<string | null>(null);
    const [isResetOpen, setIsResetOpen] = useState(false);

    // Interaction Handlers
    const handleLike = async (e: React.MouseEvent, uiId: string) => {
        e.stopPropagation();
        if (!user) {
            toast.error("Please login to like assets");
            return;
        }
        try {
            const response = await InteractionService.toggleLike(uiId);
            if (response.liked) {
                toast.success(response.message || "Liked!");
            } else {
                toast.success(response.message || "Unliked");
            }
            fetchStats(); // Refresh stats 
        } catch (error) {
            console.error("Like error", error);
            toast.error("Failed to like");
        }
    };

    const handleWishlist = async (e: React.MouseEvent, uiId: string) => {
        e.stopPropagation();
        if (!user) {
            toast.error("Please login to wishlist assets");
            return;
        }
        try {
            await InteractionService.toggleWishlist(uiId);
            toast.success("Wishlist updated");
        } catch (error) {
            console.error("Wishlist error", error);
            toast.error("Failed to update wishlist");
        }
    };

    // Fetch UIs
    const fetchUIs = async () => {
        setIsLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
            const token = localStorage.getItem('auth_token');
            const headers: any = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${apiUrl}/api/uis?page=${uisPage}&limit=12`, { headers });
            const data = await res.json();
            if (data.status) {
                setUIs(data.data);
                setUisTotalPages(data.meta?.totalPages || 1);
            }
        } catch (error) {
            console.error("Fetch error", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
            const token = localStorage.getItem('auth_token');
            const headers: any = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${apiUrl}/api/admin/users?page=${usersPage}&limit=10`, { headers });
            const data = await res.json();
            if (data.status) {
                setUsers(data.data);
                setUsersTotalPages(data.meta?.totalPages || 1);
            }
        } catch (error) {
            console.error("Fetch users error", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPayments = async () => {
        setIsLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
            const token = localStorage.getItem('auth_token');
            const headers: any = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${apiUrl}/api/admin/payments?page=${paymentsPage}&limit=10`, { headers });
            const data = await res.json();
            if (data.status) {
                setPayments(data.data);
                setPaymentsTotalPages(data.meta?.totalPages || 1);
            }
        } catch (error) {
            console.error("Fetch payments error", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStats = async () => {
        setIsLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
            const token = localStorage.getItem('auth_token');
            const headers: any = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${apiUrl}/api/dashboard/stats`, { headers });
            const data = await res.json();
            if (data.status && data.data) {
                setOverviewData(data.data);
            }
        } catch (error) {
            console.error("Fetch stats error", error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        if (!authLoading) {
            if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
                router.push('/');
                toast.error("Unauthorized access", { id: 'unauthorized-access-toast', duration: 5000 });
            }
        }
    }, [user, authLoading, router]);

    React.useEffect(() => {
        if (activeTab === 'overview' && user?.role === 'ADMIN') fetchStats();
    }, [activeTab, user]);

    React.useEffect(() => { if (activeTab === 'uis') fetchUIs(); }, [activeTab, uisPage]);
    React.useEffect(() => { if (activeTab === 'users') fetchUsers(); }, [activeTab, usersPage]);
    React.useEffect(() => { if (activeTab === 'payments') fetchPayments(); }, [activeTab, paymentsPage]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (activeTab === 'overview' && user?.role === 'ADMIN') fetchStats();
            if (activeTab === 'uis') fetchUIs();
            if (activeTab === 'users') fetchUsers();
            if (activeTab === 'payments') fetchPayments();
        }, 300000);

        return () => clearInterval(interval);
    }, [activeTab, user]);

    // Handlers
    const handleSave = async () => {
        const loadingToast = toast.loading(isAddOpen ? "Deploying Asset..." : "Saving Changes...");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
        const method = isAddOpen ? 'POST' : 'PUT';
        const url = isAddOpen ? `${apiUrl}/api/uis` : `${apiUrl}/api/uis/${currentUI.id}`;

        try {
            const token = localStorage.getItem('auth_token');
            const headers: any = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            let body: any;

            if (isAddOpen) {
                // --- CREATE: multipart/form-data ---
                const formData = new FormData();
                formData.append('title', currentUI.title || '');
                formData.append('category', currentUI.category || '');
                formData.append('overview', currentUI.overview || '');   // Description field
                formData.append('author', currentUI.author || '');       // Additional Information field

                // File uploads
                if (files.banner) formData.append('banner', files.banner);
                if (files.uiFile) formData.append('uiFile', files.uiFile);
                if (files.showcase && files.showcase.length > 0) {
                    // Max 4 showcase images
                    files.showcase.slice(0, 4).forEach(file => {
                        formData.append('showcase', file);
                    });
                }
                body = formData;
            } else {
                // --- UPDATE: JSON ---
                headers['Content-Type'] = 'application/json';
                body = JSON.stringify({
                    title: currentUI.title,
                    category: currentUI.category,
                    overview: currentUI.overview,   // Description
                    author: currentUI.author,       // Additional Information
                });
            }

            const res = await fetch(url, { method, headers, body });
            const data = await res.json();

            if (data.status) {
                toast.success(isAddOpen ? "Asset Deployed Successfully!" : "Asset Updated!", { id: loadingToast });
                setIsAddOpen(false);
                setIsEditOpen(false);
                setCurrentUI({});
                setFiles({ banner: null, uiFile: null, showcase: [] });
                setPreviews({ banner: null, showcase: [] });
                fetchUIs();
            } else {
                toast.error(data.message || "Operation failed", { id: loadingToast });
            }
        } catch (error) {
            console.error("Save error", error);
            toast.error("An error occurred", { id: loadingToast });
        }
    };



    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this UI?")) return;
        const loadingToast = toast.loading("Deleting Asset...");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';

        try {
            const token = localStorage.getItem('auth_token');
            const headers: any = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch(`${apiUrl}/api/uis/${id}`, {
                method: 'DELETE',
                headers: headers
            });
            const data = await res.json();
            if (data.status) {
                toast.success("Asset Deleted", { id: loadingToast });
                fetchUIs();
            } else {
                toast.error("Delete failed", { id: loadingToast });
            }
        } catch (error) {
            console.error("Delete error", error);
            toast.error("Delete failed", { id: loadingToast });
        }
    };

    // Auto-select UIs tab for Editor
    React.useEffect(() => {
        if (user?.role === 'EDITOR' && (activeTab !== 'uis')) {
            setActiveTab('uis');
        }
    }, [user, activeTab]);

    const navItems = [
        {
            id: 'overview',
            label: 'Overview',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6v7.5m6.75-7.5V15m6.75-10.5v15M21 6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V6z" />
                </svg>
            )
        },
        {
            id: 'uis',
            label: 'UI Assets',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3c.235.083.487.128.75.128H10.5c-.263 0-.515-.045-.75-.128m12 0A2.25 2.25 0 0019.5 9v.878m-15 0a2.25 2.25 0 00-2.25 2.25v7.5A2.25 2.25 0 004.5 21h15a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25m-15 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128" />
                </svg>
            )
        },
        {
            id: 'payments',
            label: 'Payments',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
            )
        },
        {
            id: 'users',
            label: 'Customers',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
            )
        },
        {
            id: 'activity',
            label: 'Notifications',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
            )
        },
        {
            id: 'drive',
            label: 'Drive Storage',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>
            )
        },
    ];

    const handleExport = async () => {
        // ... (Existing export logic could be moved to a util but for now keep here or just disable if not critical)
        // Leaving it here as it was in the original file
        const loadingToast = toast.loading("Preparing data export...");
        try {
            // Fetch all data for export
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
            const [usersRes, paymentsRes, uisRes] = await Promise.all([
                fetch(`${apiUrl}/api/admin/users`),
                fetch(`${apiUrl}/api/admin/payments`),
                fetch(`${apiUrl}/api/uis`)
            ]);

            const [usersData, paymentsData, uisData] = await Promise.all([
                usersRes.json(),
                paymentsRes.json(),
                uisRes.json()
            ]);

            // Create CSV Content
            const createCSV = (data: any[], headers: string[]) => {
                const headerRow = headers.join(',') + '\n';
                const rows = data.map(item => headers.map(header => {
                    const val = item[header] || '';
                    return `"${String(val).replace(/"/g, '""')}"`;
                }).join(',')).join('\n');
                return headerRow + rows;
            };

            const usersCSV = createCSV(usersData.data, ['user_id', 'full_name', 'email', 'role', 'google_id', 'created_at', 'purchases', 'lifetimeValue']);
            const paymentsCSV = createCSV(paymentsData.data, ['payment_id', 'user_id', 'email', 'amount', 'status', 'created_at']);
            const uisCSV = createCSV(uisData.data, ['id', 'title', 'category', 'author', 'downloads', 'likes']);

            // Simple Zip-like download
            const downloadFile = (content: string, filename: string) => {
                const blob = new Blob([content], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };

            downloadFile(usersCSV, 'mockupidea_users.csv');
            setTimeout(() => downloadFile(paymentsCSV, 'mockupidea_payments.csv'), 500);
            setTimeout(() => downloadFile(uisCSV, 'mockupidea_inventory.csv'), 1000);

            toast.success("Export successful!", { id: loadingToast });
        } catch (error) {
            console.error("Export failed", error);
            toast.error("Export failed", { id: loadingToast });
        }
    };

    if (authLoading || !user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row transition-colors duration-500">
            {/* Dynamic Dashboard Theme Override */}
            <style dangerouslySetInnerHTML={{
                __html: `
                ::-webkit-scrollbar-track {
                    background: var(--background) !important;
                }
                ::-webkit-scrollbar-thumb {
                    background-color: var(--secondary) !important;
                    border: 2px solid var(--background) !important;
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background-color: var(--muted-foreground) !important;
                }
                * {
                    scrollbar-color: var(--secondary) var(--background) !important;
                }
            `}} />

            {/* Mobile Header (Dashboard Specific) */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-background/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center gap-2.5">
                        <div className="relative w-9 h-9 rounded-xl bg-card border border-border/50 flex items-center justify-center shadow-lg overflow-hidden shrink-0">
                            <div className="absolute inset-0 bg-blue-600/5 blur-sm"></div>
                            <img src="/logo/M_SHAPE.svg" alt="MOCKUPIDEA" className="w-6 h-6 object-contain relative z-10" />
                        </div>
                        <span className="text-lg font-black tracking-tighter text-foreground">MOCKUPIDEA</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <NotificationBell align="right" />
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 -mr-2 text-muted-foreground hover:text-foreground"
                    >
                        <div className="w-6 h-5 flex flex-col justify-between">
                            <span className={`h-0.5 bg-current rounded-full transition-all duration-300 ${isSidebarOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`} />
                            <span className={`h-0.5 bg-current rounded-full transition-all duration-300 ${isSidebarOpen ? 'opacity-0' : 'w-4 ml-auto'}`} />
                            <span className={`h-0.5 bg-current rounded-full transition-all duration-300 ${isSidebarOpen ? 'w-6 -rotate-45 -translate-y-2.5' : 'w-3 ml-auto'}`} />
                        </div>
                    </button>
                </div>
            </header>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-background/80 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Unified Sidebar (Desktop & Mobile) */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col shadow-2xl`}>
                {/* Brand Logo Area - PRO Version */}
                <div className="h-24 flex flex-col justify-center px-8 border-b border-border/50 relative overflow-hidden group/logo bg-linear-to-b from-secondary/20 to-transparent">
                    {/* Dynamic Background Effects */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full pointer-events-none -mr-16 -mt-16 transition-all duration-700 group-hover/logo:bg-blue-600/20"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 blur-2xl rounded-full pointer-events-none -ml-12 -mb-12"></div>

                    <div className="flex items-center gap-3.5 relative z-10">
                        {/* Logo Container with Glass Effect and Glow */}
                        <div className="relative group/icon">
                            <div className="absolute inset-0 bg-blue-600/20 blur-md rounded-xl transition-all duration-500 group-hover/logo:bg-blue-600/40 group-hover/logo:scale-110"></div>
                            <div className="relative w-10 h-10 rounded-xl bg-card border border-border/50 flex items-center justify-center shadow-2xl transition-all duration-500 group-hover/logo:rotate-3 group-hover/logo:scale-105 overflow-hidden">
                                <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent opacity-0 group-hover/logo:opacity-100 transition-opacity"></div>
                                <img src="/logo/M_SHAPE.svg" alt="MOCKUPIDEA" className="w-7 h-7 object-contain transition-transform duration-500 group-hover/logo:scale-110" />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tight text-foreground leading-none mb-1 group-hover/logo:text-blue-600 transition-colors duration-300">
                                MOCKUPIDEA
                            </span>
                            <div className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Platform Pro</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Navigation */}
                <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="mb-8">
                        <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 pl-4">Main Menu</h2>
                        <nav className="space-y-1">
                            {navItems.filter(item => {
                                if (user?.role === 'EDITOR') return item.id === 'uis';
                                return true;
                            }).map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => { setActiveTab(item.id as Tab); setIsSidebarOpen(false); }}
                                    className={`w-full group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === item.id
                                        ? "bg-linear-to-r from-primary/5 to-transparent text-foreground shadow-[inset_1px_0_0_0_var(--primary)]"
                                        : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                        }`}
                                >
                                    {/* Active Indicator Glow */}
                                    {activeTab === item.id && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(37,99,235,0.5)]"></div>
                                    )}

                                    <span className={`relative transition-colors duration-300 ${activeTab === item.id ? 'text-blue-600' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                        {item.icon}
                                    </span>
                                    <span className={`text-sm font-bold uppercase tracking-widest transition-all ${activeTab === item.id ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                                        {item.label}
                                    </span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* System / Footer Section */}
                <div className="p-6 border-t border-border bg-secondary/10 backdrop-blur-sm">
                    <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 pl-4">System</h2>
                    <nav className="space-y-2">
                        <div className="lg:hidden flex items-center justify-between px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50 mb-2">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Appearance</span>
                            <ThemeToggle />
                        </div>

                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all text-sm font-bold uppercase tracking-widest group"
                        >
                            <span className="p-1 rounded-lg bg-secondary/80 group-hover:bg-blue-600/20 text-muted-foreground group-hover:text-blue-600 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                </svg>
                            </span>
                            View Live Site
                        </Link>


                        {user?.role === 'ADMIN' && (
                            <button
                                onClick={() => setIsResetOpen(true)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-destructive/80 hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all text-sm font-medium group"
                            >
                                <span className="p-1 rounded-lg bg-destructive/10 group-hover:bg-destructive/20 text-destructive/80 group-hover:text-destructive transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:rotate-12 transition-transform">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                    </svg>
                                </span>
                                Reset System Data
                            </button>
                        )}

                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent hover:border-border transition-all text-sm font-medium group"
                        >
                            <span className="p-1 rounded-lg bg-secondary/80 group-hover:bg-secondary text-muted-foreground group-hover:text-foreground transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-0.5 transition-transform">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                </svg>
                            </span>
                            Sign Out
                        </button>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-72 pt-20 lg:pt-8 px-6 lg:px-12 pb-12 overflow-x-hidden w-full">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 animate-fade-in relative z-10">
                    <div>
                        <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">Dashboard</h1>
                        <p className="text-muted-foreground">Welcome back, {user?.full_name?.split(' ')[0] || user?.role || 'User'}</p>
                    </div>
                    {/* Action Toolbar */}
                    <div className="hidden lg:flex items-center gap-4 animate-fade-in-up [animation-delay:100ms]">
                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Date Widget */}
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-default">
                            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        </div>

                        {/* Notification Area */}
                        <div className="flex items-center gap-3 pl-4 border-l border-border">
                            <div className="bg-muted/50 border border-border rounded-full p-0.5 hover:bg-muted transition-all">
                                <NotificationBell align="right" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Views */}
                <div className="relative">
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            <OverviewSection
                                overviewData={overviewData}
                                handleLike={handleLike}
                                handleWishlist={handleWishlist}
                                setOpenCommentsId={setOpenCommentsId}
                            />
                        </div>
                    )}
                    {activeTab === 'activity' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
                            <NotificationTable />
                        </div>
                    )}
                    {activeTab === 'uis' && (
                        <InventorySection
                            isLoading={isLoading}
                            uis={uis}
                            uisPage={uisPage}
                            uisTotalPages={uisTotalPages}
                            setUisPage={setUisPage}
                            handleDelete={handleDelete}
                            setCurrentUI={setCurrentUI}
                            setIsEditOpen={setIsEditOpen}
                            setIsAddOpen={setIsAddOpen}
                        />
                    )}
                    {activeTab === 'payments' && (
                        <PaymentsSection
                            payments={payments}
                            paymentsPage={paymentsPage}
                            paymentsTotalPages={paymentsTotalPages}
                            setPaymentsPage={setPaymentsPage}
                            onRefresh={fetchPayments}
                        />
                    )}
                    {activeTab === 'users' && (
                        <UsersSection
                            users={users}
                            usersPage={usersPage}
                            usersTotalPages={usersTotalPages}
                            setUsersPage={setUsersPage}
                            onRefresh={fetchUsers}
                        />
                    )}
                    {activeTab === 'drive' && <DriveSection />}
                </div>
            </main>

            {openCommentsId && <CommentSection uiId={openCommentsId} isOpen={!!openCommentsId} onClose={() => setOpenCommentsId(null)} />}

            <DashboardModals
                isAddOpen={isAddOpen}
                isEditOpen={isEditOpen}
                setIsAddOpen={setIsAddOpen}
                setIsEditOpen={setIsEditOpen}
                currentUI={currentUI}
                setCurrentUI={setCurrentUI}
                handleSave={handleSave}
                files={files}
                setFiles={setFiles}
                previews={previews}
                setPreviews={setPreviews}
            />

            <ResetDataModal
                isOpen={isResetOpen}
                onClose={() => setIsResetOpen(false)}
            />
        </div>
    );
}

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
import InventorySection from '@/components/dashboard/InventorySection'; // Renamed locally if needed, but exported as InventorySection
import PaymentsSection from '@/components/dashboard/PaymentsSection';
import UsersSection from '@/components/dashboard/UsersSection';
import DashboardModals from '@/components/dashboard/DashboardModals';
import ResetDataModal from '@/components/dashboard/ResetDataModal';
import { OverviewData } from '@/components/dashboard/types';


import NotificationBell from '@/components/NotificationBell';

type Tab = 'overview' | 'uis' | 'payments' | 'users' | 'activity';

import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import toast from 'react-hot-toast';

export default function Dashboard() {
    const { user, logout, isLoading: authLoading } = useAuth(); // Get user
    const { socket } = useSocket();
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
            { label: 'Live UIs', value: '0', change: '+0%', color: 'amber' },
            { label: 'Engagement Rate', value: '0%', change: '0%', color: 'rose' },
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
            if (!user || user.role !== 'ADMIN') {
                router.push('/');
                toast.error("Unauthorized access");
            }
        }
    }, [user, authLoading, router]);

    React.useEffect(() => {
        if (activeTab === 'overview' && user?.role === 'ADMIN') fetchStats();
    }, [activeTab, user]);

    React.useEffect(() => { if (activeTab === 'uis') fetchUIs(); }, [activeTab, uisPage]);
    React.useEffect(() => { if (activeTab === 'users') fetchUsers(); }, [activeTab, usersPage]);
    React.useEffect(() => { if (activeTab === 'payments') fetchPayments(); }, [activeTab, paymentsPage]);

    // Real-time Listeners
    React.useEffect(() => {
        if (!socket) return;

        // Helper to update stats optimistically
        const updateStat = (label: string, increment: number = 1) => {
            setOverviewData(prev => ({
                ...prev,
                stats: prev.stats.map(s =>
                    s.label === label
                        ? { ...s, value: (parseInt(s.value.replace(/[^0-9]/g, '')) + increment).toString() }
                        : s
                )
            }));
        };

        // UI Listeners
        const handleUINew = (data: { ui: Product }) => {
            // Update List
            setUIs(prev => {
                const exists = prev.find(p => p.id === data.ui.id);
                if (exists) return prev;
                return [data.ui, ...prev].slice(0, 12);
            });

            // Update Stats
            updateStat('Live UIs', 1);
            toast("New UI Deployed!", { icon: "🚀" });
        };

        const handleUIDeleted = (data: { id: string }) => {
            setUIs(prev => prev.filter(u => u.id !== data.id));
            toast("UI Deleted", { icon: "🗑️" });
        };

        const handleUIUpdated = (data: { ui: Product }) => {
            setUIs(prev => prev.map(u => u.id === data.ui.id ? { ...u, ...data.ui } : u));
        };

        // User Listeners
        const handleUserNew = (data: { user: any }) => {
            // Update List
            setUsers(prev => {
                if (prev.length === 0) return prev;
                return [data.user, ...prev].slice(0, 10);
            });
            // Update Stats
            updateStat('Active Users', 1);
            toast("New User Registered!", { icon: "👤" });
        };

        // Payment Listeners
        const handlePaymentNew = (data: { payment: any }) => {
            // Update Payments List
            setPayments(prev => {
                if (prev.length === 0) return prev;
                return [data.payment, ...prev].slice(0, 10);
            });

            // Update Payment Distribution & Revenue (Simulated for real-time)
            setOverviewData(prev => {
                const newDist = {
                    ...(prev.paymentStatusDistribution || { completed: 0, pending: 0, canceled: 0, failed: 0 })
                };

                if (data.payment.status === 'COMPLETED') newDist.completed++;
                else if (data.payment.status === 'PENDING') newDist.pending++;

                return {
                    ...prev,
                    paymentStatusDistribution: newDist
                };
            });

            updateStat('Total Downloads', 1); // Assuming payment = download access

            toast("New Payment Received!", { icon: "💰" });
        };

        const handlePaymentUpdated = (data: { paymentIntentId: string, status: string }) => {
            setPayments(prev => prev.map(p => p.stripePaymentIntentId === data.paymentIntentId ? { ...p, status: data.status } : p));
        };

        const handleNewNotification = (notification: any) => {
            setOverviewData(prev => ({
                ...prev,
                formattedActivities: [
                    {
                        id: notification.id,
                        type: notification.type,
                        message: notification.message,
                        time: notification.created_at, // Consider formatting date here if needed, or in component
                        user: notification.user?.full_name || 'Unknown',
                        uiTitle: notification.ui?.title
                    },
                    ...(prev.formattedActivities || []).slice(0, 9)
                ]
            }));
            // toast("New Activity: " + notification.type, { icon: "🔔" }); // Suppressed as per request
        };

        socket.on('ui:new', handleUINew);
        socket.on('ui:updated', handleUIUpdated);
        socket.on('ui:deleted', handleUIDeleted);
        socket.on('user:new', handleUserNew);
        socket.on('payment:new', handlePaymentNew);
        socket.on('payment:updated', handlePaymentUpdated);
        socket.on('new-notification', handleNewNotification);

        return () => {
            socket.off('ui:new', handleUINew);
            socket.off('ui:updated', handleUIUpdated);
            socket.off('ui:deleted', handleUIDeleted);
            socket.off('user:new', handleUserNew);
            socket.off('payment:new', handlePaymentNew);
            socket.off('payment:updated', handlePaymentUpdated);
            socket.off('new-notification', handleNewNotification);
        };
    }, [socket]); // Removed activeTab dependency to ensure background updates

    // Handlers
    const handleSave = async () => {
        const loadingToast = toast.loading(isAddOpen ? "Deploying Asset..." : "Saving Changes...");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
        const method = isAddOpen ? 'POST' : 'PUT';
        const url = isAddOpen ? `${apiUrl}/api/uis` : `${apiUrl}/api/uis/${currentUI.id}`;

        try {
            const token = localStorage.getItem('auth_token');
            const headers: any = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            let body: any;

            if (isAddOpen) {
                const formData = new FormData();
                formData.append('title', currentUI.title || '');
                formData.append('price', currentUI.price || '');
                formData.append('category', currentUI.category || '');
                formData.append('author', currentUI.author || '');
                formData.append('imageSrc', currentUI.imageSrc || '');
                formData.append('google_file_id', currentUI.google_file_id || '');
                formData.append('color', currentUI.color || '');
                formData.append('overview', currentUI.overview || '');
                formData.append('rating', currentUI.rating ? currentUI.rating.toString() : '4.8');
                formData.append('specifications', JSON.stringify(currentUI.specifications || []));
                formData.append('highlights', JSON.stringify(
                    (currentUI.highlights || [])
                        .filter(h => h && h.trim() !== '')
                ));

                if (files.banner) formData.append('banner', files.banner);
                if (files.uiFile) formData.append('uiFile', files.uiFile);
                if (files.showcase && files.showcase.length > 0) {
                    files.showcase.forEach(file => {
                        formData.append('showcase', file);
                    });
                }
                body = formData;
            } else {
                headers['Content-Type'] = 'application/json';
                // Ensure highlights is an array
                const payload = {
                    ...currentUI,
                    highlights: (currentUI.highlights || [])
                        .filter(h => h && h.trim() !== '')
                };
                body = JSON.stringify(payload);
            }

            const res = await fetch(url, { method, headers, body });
            const data = await res.json();

            if (data.status) {
                toast.success(isAddOpen ? "Asset Deployed Successfully!" : "Asset Updated!", { id: loadingToast });
                setIsAddOpen(false);
                setIsEditOpen(false);
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

            const usersCSV = createCSV(usersData.data, ['id', 'name', 'email', 'role', 'joinedDate', 'purchases', 'lifetimeValue']);
            const paymentsCSV = createCSV(paymentsData.data, ['id', 'customerName', 'email', 'item', 'amount', 'status', 'date']);
            const uisCSV = createCSV(uisData.data, ['id', 'title', 'price', 'category', 'author', 'downloads', 'likes', 'rating']);

            // Simple Zip-like download (or just download 3 files, but let's do a single JSON for now or just one main CSV if simple. 
            // Better: Download Payments CSV as it's most critical, OR trigger 3 downloads.)

            // Let's trigger 3 downloads for full export "Pro" style
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

            downloadFile(usersCSV, 'lumina_users.csv');
            setTimeout(() => downloadFile(paymentsCSV, 'lumina_payments.csv'), 500);
            setTimeout(() => downloadFile(uisCSV, 'lumina_inventory.csv'), 1000);

            toast.success("Export successful!", { id: loadingToast });
        } catch (error) {
            console.error("Export failed", error);
            toast.error("Export failed", { id: loadingToast });
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col lg:flex-row">
            {/* Mobile Header (Dashboard Specific) */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-black/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6">
                <div className="flex items-center gap-2">
                    <div className="relative flex items-center justify-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                            <img src="/svg/logo.svg" alt="Monkframe Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-xl font-bold tracking-tighter text-white relative z-10">Monkframe</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <NotificationBell />
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 -mr-2 text-zinc-400 hover:text-white"
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
                    className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Unified Sidebar (Desktop & Mobile) */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-zinc-950 border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col shadow-2xl`}>
                {/* Brand Logo Area */}
                <div className="h-20 flex items-center justify-between px-8 border-b border-white/5 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] rounded-full pointer-events-none -mr-16 -mt-16"></div>
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                            <img src="/svg/logo.svg" alt="Monkframe Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-zinc-400">
                            Monkframe
                        </span>
                    </div>

                </div>

                {/* Main Navigation */}
                <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="mb-8">
                        <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4 pl-4">Main Menu</h2>
                        <nav className="space-y-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => { setActiveTab(item.id as Tab); setIsSidebarOpen(false); }}
                                    className={`w-full group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === item.id
                                        ? "bg-gradient-to-r from-white/10 to-transparent text-white shadow-[inset_1px_0_0_0_#6366f1]"
                                        : "bg-transparent text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
                                        }`}
                                >
                                    {/* Active Indicator Glow */}
                                    {activeTab === item.id && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_12px_#6366f1]"></div>
                                    )}

                                    <span className={`relative transition-colors duration-300 ${activeTab === item.id ? 'text-indigo-400' : 'text-zinc-600 group-hover:text-zinc-300'}`}>
                                        {item.icon}
                                    </span>
                                    <span className={`text-sm font-medium tracking-wide transition-all ${activeTab === item.id ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                                        {item.label}
                                    </span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* System / Footer Section */}
                <div className="p-6 border-t border-white/5 bg-black/20 backdrop-blur-sm">
                    <h2 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4 pl-4">System</h2>
                    <nav className="space-y-2">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium group"
                        >
                            <span className="p-1 rounded-lg bg-zinc-900 group-hover:bg-indigo-500/20 text-zinc-500 group-hover:text-indigo-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                </svg>
                            </span>
                            View Live Site
                        </Link>

                        <button
                            onClick={() => setIsResetOpen(true)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all text-sm font-medium group"
                        >
                            <span className="p-1 rounded-lg bg-zinc-900 group-hover:bg-rose-500/20 text-rose-500/70 group-hover:text-rose-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:rotate-12 transition-transform">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                            </span>
                            Reset System Data
                        </button>

                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent hover:border-zinc-700/50 transition-all text-sm font-medium group"
                        >
                            <span className="p-1 rounded-lg bg-zinc-900 group-hover:bg-zinc-700 text-zinc-500 group-hover:text-zinc-300 transition-colors">
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
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 animate-fade-in relative z-50">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight mb-2">Dashboard</h1>
                        <p className="text-gray-400">Welcome back, {user?.full_name?.split(' ')[0] || 'Admin'}</p>
                    </div>
                    {/* Action Toolbar */}
                    <div className="hidden lg:flex items-center gap-4 animate-fade-in-up [animation-delay:100ms]">
                        {/* Date Widget */}
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-default">
                            <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        </div>

                        {/* Notification Area */}
                        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                            <div className="bg-white/5 border border-white/10 rounded-full p-0.5 hover:bg-white/10 transition-all">
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
                            <h2 className="text-2xl font-bold text-white">Notifications</h2>
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
                        />
                    )}
                    {activeTab === 'users' && (
                        <UsersSection
                            users={users}
                            usersPage={usersPage}
                            usersTotalPages={usersTotalPages}
                            setUsersPage={setUsersPage}
                        />
                    )}
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

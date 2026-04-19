import React, { useState } from 'react';
import Pagination from '@/components/Pagination';
import toast from 'react-hot-toast';
import { Trash2, Shield, User as UserIcon, Mail, Globe, Clock, DollarSign, ShoppingBag } from 'lucide-react';
import DashboardTableSkeleton from './DashboardTableSkeleton';

interface User {
    user_id: number;
    full_name: string;
    email: string;
    role: 'ADMIN' | 'CUSTOMER' | 'EDITOR' | 'DEVELOPER';
    status: string;
    google_id: string | null;
    created_at: string;
    last_active_at: string;
    purchases?: number;
    lifetimeValue?: number;
    dashboard_access?: boolean;
}

interface UsersSectionProps {
    users: User[];
    usersPage: number;
    usersTotalPages: number;
    setUsersPage: (page: number) => void;
    onRefresh: () => void;
    isLoading?: boolean;
}

const UsersSection: React.FC<UsersSectionProps> = ({
    users,
    usersPage,
    usersTotalPages,
    setUsersPage,
    onRefresh,
    isLoading
}) => {
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleRoleChange = async (userId: number, newRole: string) => {
        setUpdatingId(userId);
        const loadingToast = toast.loading("Updating user role...");

        try {
            const token = localStorage.getItem('auth_token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';

            const res = await fetch(`${apiUrl}/api/admin/users/${userId}/role`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ role: newRole })
            });

            const data = await res.json();

            if (data.status) {
                toast.success(data.message, { id: loadingToast });
                onRefresh();
            } else {
                toast.error(data.message || "Failed to update role", { id: loadingToast });
            }
        } catch {
            toast.error("Network error occurred", { id: loadingToast });
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDashboardAccessChange = async (userId: number, access: boolean) => {
        setUpdatingId(userId);
        const loadingToast = toast.loading("Updating dashboard access...");
        try {
            const token = localStorage.getItem('auth_token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
            const res = await fetch(`${apiUrl}/api/admin/users/${userId}/dashboard-access`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ dashboard_access: access })
            });
            const data = await res.json();
            if (data.status) {
                toast.success(data.message, { id: loadingToast });
                onRefresh();
            } else {
                toast.error(data.message || "Failed to update access", { id: loadingToast });
            }
        } catch {
            toast.error("Network error", { id: loadingToast });
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDeleteUser = async (userId: number, userEmail: string) => {
        if (!window.confirm(`Are you sure you want to permanently delete the account for ${userEmail}? This action cannot be undone and will remove all associated data.`)) {
            return;
        }

        setDeletingId(userId);
        const loadingToast = toast.loading("Deleting user account...");

        try {
            const token = localStorage.getItem('auth_token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';

            const res = await fetch(`${apiUrl}/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (data.status) {
                toast.success(data.message, { id: loadingToast });
                onRefresh();
            } else {
                toast.error(data.message || "Failed to delete user", { id: loadingToast });
            }
        } catch (error) {
            console.error("Delete user error", error);
            toast.error("An error occurred while deleting the user", { id: loadingToast });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden animate-fade-in mb-20 shadow-2xl">
            {/* Header with Summary Stats */}
            <div className="p-8 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-secondary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -mr-16 -mt-16 pointer-events-none" />
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-foreground tracking-tight mb-1 flex items-center gap-3">
                        Customer
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium">Manage your customers and their engagement</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] bg-secondary/5">
                            <th className="px-8 py-6 whitespace-nowrap">User Identity</th>
                            <th className="px-8 py-6 whitespace-nowrap">Role</th>
                            <th className="px-8 py-6 whitespace-nowrap">Dash Access</th>
                            <th className="px-8 py-6 whitespace-nowrap">Access</th>
                            <th className="px-8 py-6 whitespace-nowrap">Ingress Date</th>
                            <th className="px-8 py-6 whitespace-nowrap text-right">Activity</th>
                            <th className="px-8 py-6 whitespace-nowrap text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="p-6">
                                    <DashboardTableSkeleton columns={6} rows={5} />
                                </td>
                            </tr>
                        ) : users.length > 0 ? (
                            users.map((user, idx) => (
                                <tr key={user.user_id ?? idx} className="hover:bg-secondary/30 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative shrink-0">
                                                <div className="h-10 w-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                                                    <UserIcon size={18} />
                                                </div>
                                                {(() => {
                                                    const lastActive = user.last_active_at ? new Date(user.last_active_at).getTime() : 0;
                                                    const isOnline = Date.now() - lastActive < 300000;
                                                    if (isOnline) {
                                                        return (
                                                            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-background border-2 border-background">
                                                                <div className="h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)] animate-pulse"></div>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                })()}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <p className="font-bold text-foreground text-sm truncate max-w-[180px]">
                                                    {user.full_name && user.full_name !== 'Unknown' ? user.full_name : user.email.split('@')[0]}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-[10px] font-bold text-muted-foreground/60 truncate max-w-[150px]">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="relative inline-block">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                                                disabled={updatingId === user.user_id}
                                                className={`text-[9px] font-extrabold uppercase tracking-[0.2em] px-4 py-2 rounded-xl border bg-background/50 backdrop-blur-sm outline-none cursor-pointer transition-all hover:border-primary/40 disabled:opacity-50 disabled:cursor-not-allowed appearance-none pr-8 ${user.role === 'ADMIN'
                                                    ? 'text-purple-400 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                                                    : user.role === 'EDITOR'
                                                        ? 'text-blue-500 border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.05)]'
                                                        : 'text-muted-foreground border-border shadow-sm'
                                                    }`}
                                            >
                                                <option value="CUSTOMER">CUSTOMER</option>
                                                <option value="EDITOR">EDITOR</option>
                                                <option value="DEVELOPER">DEVELOPER</option>
                                                <option value="ADMIN">ADMIN</option>
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/40">
                                                <Shield size={10} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center">
                                            {user.role === 'CUSTOMER' ? (
                                                <span className="text-xs text-muted-foreground font-bold">—</span>
                                            ) : (
                                                <button
                                                    onClick={() => handleDashboardAccessChange(user.user_id, !user.dashboard_access)}
                                                    disabled={updatingId === user.user_id || user.role === 'ADMIN' || user.role === 'EDITOR'}
                                                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out ${(user.dashboard_access || user.role === 'ADMIN' || user.role === 'EDITOR') ? 'bg-blue-600' : 'bg-gray-200'} ${(updatingId === user.user_id || user.role === 'ADMIN' || user.role === 'EDITOR') ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${(user.dashboard_access || user.role === 'ADMIN' || user.role === 'EDITOR') ? 'translate-x-2' : '-translate-x-2'}`} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            {user.google_id ? (
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600/5 border border-blue-600/10 text-blue-600">
                                                    <Globe size={12} />
                                                    <span className="text-[9px] font-bold uppercase tracking-widest">Google</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border text-muted-foreground">
                                                    <Mail size={12} />
                                                    <span className="text-[9px] font-bold uppercase tracking-widest">Email</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Clock size={12} className="opacity-50" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest tabular-nums">
                                                {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                }) : 'N/A'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <span className="text-xs font-bold text-foreground tabular-nums">{user.purchases || 0}</span>
                                            <ShoppingBag size={12} className="text-muted-foreground/40" />
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            onClick={() => handleDeleteUser(user.user_id, user.email)}
                                            disabled={deletingId === user.user_id}
                                            className="p-3 text-muted-foreground/40 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all duration-300 disabled:opacity-30 group/del"
                                            title="Delete User"
                                        >
                                            <Trash2 size={18} className="group-hover/del:scale-110 transition-transform" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-8 py-16 text-center text-muted-foreground/60 text-xs font-medium uppercase tracking-widest">
                                    No customers found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="p-8 bg-secondary/5 border-t border-border">
                    <Pagination
                        currentPage={usersPage}
                        totalPages={usersTotalPages}
                        onPageChange={setUsersPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default UsersSection;

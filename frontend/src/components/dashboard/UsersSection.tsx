import React, { useState } from 'react';
import Pagination from '@/components/Pagination';
import toast from 'react-hot-toast';

interface UsersSectionProps {
    users: any[]; // Consider defining a User type
    usersPage: number;
    usersTotalPages: number;
    setUsersPage: (page: number) => void;
    onRefresh: () => void;
}

const UsersSection: React.FC<UsersSectionProps> = ({
    users,
    usersPage,
    usersTotalPages,
    setUsersPage,
    onRefresh
}) => {
    const [updatingId, setUpdatingId] = useState<number | null>(null);

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
                onRefresh(); // Refresh the list
            } else {
                toast.error(data.message || "Failed to update role", { id: loadingToast });
            }
        } catch (error) {
            console.error("Role update error", error);
            toast.error("An error occurred while updating the role", { id: loadingToast });
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="bg-card border border-border rounded-4xl overflow-hidden animate-fade-in mb-20">
            {/* Header with Summary Stats */}
            <div className="p-5 sm:p-8 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-secondary/10">
                <div>
                    <h3 className="text-xl font-bold text-foreground tracking-tight mb-1">Customer Ecosystem</h3>
                    <p className="text-sm text-muted-foreground">Relationship management and user engagement metrics</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Users</p>
                        <p className="text-xl font-bold text-foreground">{users.length}</p>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-secondary/10">
                            <th className="px-8 py-5 whitespace-nowrap">User Identity</th>
                            <th className="px-8 py-5 whitespace-nowrap">Role</th>
                            <th className="px-8 py-5 whitespace-nowrap">Ingress Date</th>
                            <th className="px-8 py-5 whitespace-nowrap text-right">Lifetime Value</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {users.map((user, idx) => (
                            <tr key={user.user_id ?? user.id ?? idx} className="hover:bg-secondary/50 transition-all group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex h-2 w-2 shrink-0">
                                            {(() => {
                                                const lastActive = user.last_active_at ? new Date(user.last_active_at).getTime() : 0;
                                                const isOnline = Date.now() - lastActive < 300000;
                                                if (isOnline) {
                                                    return (
                                                        <>
                                                            <div className="absolute inline-flex h-full w-full rounded-full animate-ping bg-amber-400 opacity-75"></div>
                                                            <div className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></div>
                                                        </>
                                                    );
                                                }
                                                return <div className="relative inline-flex rounded-full h-2 w-2 bg-muted"></div>;
                                            })()}
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                                                {user.name && user.name !== 'Unknown' ? user.name : user.email}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                {user.name && user.name !== 'Unknown' && (
                                                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{user.email}</p>
                                                )}
                                                {(() => {
                                                    const lastActive = user.last_active_at ? new Date(user.last_active_at).getTime() : 0;
                                                    const isOnline = Date.now() - lastActive < 300000;
                                                    if (isOnline) return <span className="text-[8px] font-bold text-amber-500/60 uppercase tracking-tighter">Online</span>;
                                                    return null;
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                                        disabled={updatingId === user.user_id}
                                        className={`text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border bg-transparent outline-none cursor-pointer transition-all hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed ${user.role === 'ADMIN'
                                            ? 'text-purple-400 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]'
                                            : user.role === 'EDITOR'
                                                ? 'text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.05)]'
                                                : 'text-amber-500/80 border-amber-500/10 shadow-[0_0_10px_rgba(245,158,11,0.02)]'
                                            }`}
                                    >
                                        <option value="CUSTOMER" className="bg-background text-amber-500">CUSTOMER</option>
                                        <option value="EDITOR" className="bg-background text-amber-400">EDITOR</option>
                                        <option value="ADMIN" className="bg-background text-purple-400">ADMIN</option>
                                    </select>
                                </td>
                                <td className="px-8 py-6 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] font-mono">
                                    {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    }) : 'N/A'}
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-bold text-foreground">{user.purchases} <span className="text-[10px] text-muted-foreground/60 font-bold ml-1 uppercase tracking-widest">Orders</span></span>
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">LTV: ${user.lifetimeValue || 0}</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Pagination
                    currentPage={usersPage}
                    totalPages={usersTotalPages}
                    onPageChange={setUsersPage}
                    className="pb-6"
                />
            </div>
        </div>
    );
};

export default UsersSection;

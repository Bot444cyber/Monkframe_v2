import React from 'react';
import Pagination from '@/components/Pagination';

interface UsersSectionProps {
    users: any[]; // Consider defining a User type
    usersPage: number;
    usersTotalPages: number;
    setUsersPage: (page: number) => void;
}

const UsersSection: React.FC<UsersSectionProps> = ({
    users,
    usersPage,
    usersTotalPages,
    setUsersPage
}) => {
    return (
        <div className="bg-zinc-900/30 border border-white/5 rounded-[2rem] overflow-hidden animate-fade-in mb-20">
            {/* Header with Summary Stats */}
            <div className="p-5 sm:p-8 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white/[0.01]">
                <div>
                    <h3 className="text-xl font-bold text-white tracking-tight mb-1">Customer Ecosystem</h3>
                    <p className="text-sm text-gray-500">Relationship management and user engagement metrics</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Users</p>
                        <p className="text-xl font-bold text-white">{users.length}</p>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/[0.01]">
                            <th className="px-8 py-5 whitespace-nowrap">User Identity</th>
                            <th className="px-8 py-5 whitespace-nowrap">Status</th>
                            <th className="px-8 py-5 whitespace-nowrap">Role</th>
                            <th className="px-8 py-5 whitespace-nowrap">Ingress Date</th>
                            <th className="px-8 py-5 whitespace-nowrap text-right">Lifetime Value</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.map((user, idx) => (
                            <tr key={user.user_id ?? user.id ?? idx} className="hover:bg-white/[0.02] transition-all group">
                                <td className="px-8 py-6">
                                    <div className="flex flex-col">
                                        <p className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">
                                            {user.name && user.name !== 'Unknown' ? user.name : user.email}
                                        </p>
                                        {user.name && user.name !== 'Unknown' && (
                                            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-0.5">{user.email}</p>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="flex items-center gap-2">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>
                                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active</span>
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border ${user.role === 'ADMIN'
                                        ? 'text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]'
                                        : 'text-blue-400 bg-blue-500/5 border-blue-500/20'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">{user.joinedDate}</td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-bold text-white">{user.purchases} <span className="text-[10px] text-gray-600 font-bold ml-1 uppercase tracking-widest">Orders</span></span>
                                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5">LTV: ${user.lifetimeValue || 0}</span>
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

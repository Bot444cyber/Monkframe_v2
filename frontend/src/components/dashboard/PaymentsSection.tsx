import React from 'react';
import toast from 'react-hot-toast';
import Pagination from '@/components/Pagination';

interface PaymentsSectionProps {
    payments: any[]; // Consider defining a Payment type
    paymentsPage: number;
    paymentsTotalPages: number;
    setPaymentsPage: (page: number) => void;
    onRefresh?: () => void;
}

const PaymentsSection: React.FC<PaymentsSectionProps> = ({
    payments,
    paymentsPage,
    paymentsTotalPages,
    setPaymentsPage,
    onRefresh
}) => {
    const handleDelete = async (id: string, orderId: string) => {
        if (!confirm(`Are you sure you want to delete Payment ${orderId}? This cannot be undone.`)) return;

        const loadingToast = toast.loading("Deleting payment record...");
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
            const token = localStorage.getItem('auth_token');

            const res = await fetch(`${apiUrl}/api/admin/payments/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await res.json();
            if (data.status) {
                toast.success("Payment deleted successfully", { id: loadingToast });
                if (onRefresh) onRefresh();
            } else {
                toast.error(data.message || "Failed to delete", { id: loadingToast });
            }
        } catch (error) {
            console.error("Delete Error", error);
            toast.error("An error occurred during deletion", { id: loadingToast });
        }
    };

    return (
        <div className="bg-zinc-900/30 border border-white/5 rounded-[2rem] overflow-hidden animate-fade-in mb-20">
            <div className="p-5 sm:p-8 border-b border-white/5 bg-white/[0.01]">
                <h3 className="text-xl font-bold text-white tracking-tight mb-1">Ledger Operations</h3>
                <p className="text-sm text-gray-500">Real-time transaction monitoring and dispute management</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/[0.01]">
                            <th className="px-8 py-5 whitespace-nowrap">Order ID</th>
                            <th className="px-8 py-5 whitespace-nowrap">Customer Identity</th>
                            <th className="px-8 py-5 whitespace-nowrap">Timestamp</th>
                            <th className="px-8 py-5 whitespace-nowrap">Amount</th>
                            <th className="px-8 py-5 whitespace-nowrap">Status</th>
                            <th className="px-8 py-5 whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {payments.map((tx) => {
                            const status = tx.status?.toUpperCase();
                            const userName = tx.user?.full_name || tx.customerName || 'Anonymous';
                            const userEmail = tx.user?.email || tx.email || 'No email';
                            const initial = userName.charAt(0).toUpperCase();
                            const orderId = tx.stripePaymentIntentId ? tx.stripePaymentIntentId.slice(-8).toUpperCase() : tx.id.slice(0, 8).toUpperCase();

                            return (
                                <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6 font-mono text-[10px] text-zinc-500 group-hover:text-zinc-300 transition-colors">
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold">{orderId}</span>
                                            <span className="text-[9px] opacity-30" title={tx.id}>UUID: {tx.id.slice(0, 8)}...</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center text-[10px] font-bold text-indigo-400">
                                                {initial}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-white">{userName}</span>
                                                <span className="text-[10px] text-zinc-500">{userEmail}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-zinc-500 text-xs font-medium">
                                        {tx.created_at ? new Date(tx.created_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        }) : tx.date || 'N/A'}
                                    </td>
                                    <td className="px-8 py-6 font-black text-white text-base tracking-tight">
                                        ${Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${status === 'COMPLETED' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10' :
                                            status === 'PENDING' ? 'border-amber-500/20 text-amber-400 bg-amber-500/10' :
                                                status === 'FAILED' ? 'border-rose-500/20 text-rose-400 bg-rose-500/10' :
                                                    'border-zinc-500/20 text-zinc-400 bg-zinc-500/10'
                                            }`}>
                                            {status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <button
                                            onClick={status !== 'COMPLETED' ? () => handleDelete(tx.id, orderId) : undefined}
                                            disabled={status === 'COMPLETED'}
                                            className={`p-2 rounded-lg border transition-all 
                                                ${status === 'COMPLETED'
                                                    ? 'bg-zinc-800/50 border-white/5 text-zinc-600 cursor-not-allowed opacity-40'
                                                    : 'bg-rose-500/5 border-rose-500/10 text-rose-500/60 hover:text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/30 opacity-0 group-hover:opacity-100'
                                                }`}
                                            title={status === 'COMPLETED' ? "Completed payments cannot be deleted" : "Delete Record"}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <Pagination
                    currentPage={paymentsPage}
                    totalPages={paymentsTotalPages}
                    onPageChange={setPaymentsPage}
                    className="pb-6"
                />
            </div>
        </div>
    );
};

export default PaymentsSection;

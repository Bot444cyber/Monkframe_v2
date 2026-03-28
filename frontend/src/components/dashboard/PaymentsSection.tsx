import React from 'react';
import Pagination from '@/components/Pagination';

interface PaymentsSectionProps {
    payments: any[]; // Consider defining a Payment type
    paymentsPage: number;
    paymentsTotalPages: number;
    setPaymentsPage: (page: number) => void;
}

const PaymentsSection: React.FC<PaymentsSectionProps> = ({
    payments,
    paymentsPage,
    paymentsTotalPages,
    setPaymentsPage
}) => {
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
                            <th className="px-8 py-5 whitespace-nowrap">Trace ID</th>
                            <th className="px-8 py-5 whitespace-nowrap">Customer Identity</th>
                            <th className="px-8 py-5 whitespace-nowrap">Timestamp</th>
                            <th className="px-8 py-5 whitespace-nowrap">Amount</th>
                            <th className="px-8 py-5 whitespace-nowrap">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {payments.map((tx) => {
                            const status = tx.status?.toUpperCase();
                            const userName = tx.user?.full_name || tx.customerName || 'Anonymous';
                            const userEmail = tx.user?.email || tx.email || 'No email';
                            const initial = userName.charAt(0).toUpperCase();

                            return (
                                <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6 font-mono text-[10px] text-zinc-500 group-hover:text-zinc-300 transition-colors">
                                        <span title={tx.id}>{tx.id.split('-')[0]}...</span>
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
                                                'border-rose-500/20 text-rose-400 bg-rose-500/10'
                                            }`}>
                                            {status}
                                        </span>
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

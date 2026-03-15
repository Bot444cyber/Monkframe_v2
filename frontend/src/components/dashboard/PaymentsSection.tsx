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
                        {payments.map((tx) => (
                            <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="px-8 py-6 font-mono text-xs text-gray-600">{tx.id}</td>
                                <td className="px-8 py-6 font-medium text-white text-sm">{tx.customerName}</td>
                                <td className="px-8 py-6 text-gray-500 text-xs font-medium">{tx.date}</td>
                                <td className="px-8 py-6 font-medium text-white text-lg">{tx.amount}</td>
                                <td className="px-8 py-6">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${tx.status === 'completed' ? 'border-emerald-500/10 text-emerald-400 bg-emerald-500/5' :
                                        tx.status === 'pending' ? 'border-amber-500/10 text-amber-400 bg-amber-500/5' :
                                            'border-rose-500/10 text-rose-400 bg-rose-500/5'
                                        }`}>
                                        {tx.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
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

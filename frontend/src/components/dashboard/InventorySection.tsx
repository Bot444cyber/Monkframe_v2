import React from 'react';
import Pagination from '@/components/Pagination';
import { Product } from '@/components/ts/types';

interface InventorySectionProps {
    isLoading: boolean;
    uis: Product[];
    uisPage: number;
    uisTotalPages: number;
    setUisPage: (page: number) => void;
    handleDelete: (id: string) => void;
    setCurrentUI: (ui: Partial<Product>) => void;
    setIsEditOpen: (isOpen: boolean) => void;
    setIsAddOpen: (isOpen: boolean) => void;
}

const InventorySection: React.FC<InventorySectionProps> = ({
    isLoading,
    uis,
    uisPage,
    uisTotalPages,
    setUisPage,
    handleDelete,
    setCurrentUI,
    setIsEditOpen,
    setIsAddOpen
}) => {
    return (
        <div className="bg-zinc-900/30 border border-white/5 rounded-[2rem] overflow-hidden mb-20 relative animate-fade-in-up">
            <div className="p-5 sm:p-8 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white/[0.01]">
                <div>
                    <h3 className="text-xl font-bold text-white tracking-tight mb-1">Inventory Management</h3>
                    <p className="text-sm text-gray-500">Manage and deploy digital assets to the marketplace</p>
                </div>
                <button onClick={() => { setCurrentUI({}); setIsAddOpen(true); }} className="px-6 py-3 bg-white text-black font-bold uppercase tracking-wider rounded-xl text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5 whitespace-nowrap hover:shadow-indigo-500/20">
                    Deploy New UI
                </button>
            </div>

            {/* Loading / Table */}
            {isLoading ?
                <div className="p-20 text-center text-gray-400 font-medium animate-pulse">Accessing Database...</div>
                : (
                    <div className="overflow-x-auto animate-fade-in-up delay-200">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/[0.01]">
                                    <th className="px-8 py-5 whitespace-nowrap">Identity</th>
                                    <th className="px-8 py-5 whitespace-nowrap">Pricing</th>
                                    <th className="px-8 py-5 whitespace-nowrap">Category</th>
                                    <th className="px-8 py-5 whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {uis.map((product: any) => (
                                    <tr key={product.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-5 min-w-[300px]">
                                                <div className="h-14 w-20 rounded-xl overflow-hidden bg-zinc-800 border border-white/10 shrink-0">
                                                    <img src={product.imageSrc} referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                                <div>
                                                    <span className="block font-medium text-white group-hover:text-indigo-400 transition-colors text-sm mb-0.5">{product.title}</span>
                                                    <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">By {product.author}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${product.price === 'Free' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-white border border-white/10'}`}>
                                                {product.price}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-medium text-gray-400">{product.category}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex gap-2">
                                                <button onClick={() => { setCurrentUI(product); setIsEditOpen(true); }} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-indigo-400 transition-colors">Edit</button>
                                                <button onClick={() => handleDelete(product.id)} className="px-4 py-2 bg-red-500/5 hover:bg-red-500/10 rounded-lg text-xs font-bold text-red-500 transition-colors">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination
                            currentPage={uisPage}
                            totalPages={uisTotalPages}
                            onPageChange={setUisPage}
                            className="pb-6"
                        />
                    </div>
                )}
        </div>
    );
};

export default InventorySection;

import React from 'react';
import Pagination from '@/components/Pagination';
import { Product } from '@/components/ts/types';
import DashboardTableSkeleton from './DashboardTableSkeleton';

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
        <div className="bg-card border border-border rounded-[2rem] overflow-hidden mb-20 relative animate-fade-in-up">
            <div className="p-5 sm:p-8 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-secondary/10">
                <div>
                    <h3 className="text-xl font-bold text-foreground tracking-tight mb-1">Inventory Management</h3>
                    <p className="text-sm text-muted-foreground">Manage and deploy digital assets to the marketplace</p>
                </div>
                <button onClick={() => { setCurrentUI({}); setIsAddOpen(true); }} className="px-6 py-3 bg-foreground text-background font-bold uppercase tracking-wider rounded-xl text-xs hover:scale-105 active:scale-95 transition-all shadow-sm whitespace-nowrap hover:opacity-90">
                    Deploy New UI
                </button>
            </div>

            {/* Loading / Table */}
            {isLoading ?
                <div className="p-6">
                    <DashboardTableSkeleton columns={4} />
                </div>
                : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-secondary/10">
                                    <th className="px-8 py-5 whitespace-nowrap">Identity</th>
                                    <th className="px-8 py-5 whitespace-nowrap">Pricing</th>
                                    <th className="px-8 py-5 whitespace-nowrap">Category</th>
                                    <th className="px-8 py-5 whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {uis.map((product: any) => (
                                    <tr key={product.id} className="group hover:bg-secondary/50">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-5 min-w-[300px]">
                                                <div className="h-14 w-20 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
                                                    <img src={product.imageSrc} referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                                                </div>
                                                <div>
                                                    <span className="block font-medium text-foreground group-hover:text-primary text-sm mb-0.5">{product.title}</span>
                                                    <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5 mt-1">
                                                        <svg className="w-2.5 h-2.5 text-blue-600/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        By {product.creator?.full_name || 'System Admin'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${product.price === 'Free' ? 'bg-blue-600/10 text-blue-600 border border-blue-600/20' : 'bg-secondary text-foreground border border-border'}`}>
                                                {product.price}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-medium text-muted-foreground">{product.category}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex gap-2">
                                                <button onClick={() => { setCurrentUI(product); setIsEditOpen(true); }} className="px-4 py-2 bg-secondary hover:bg-blue-600/10 rounded-lg text-xs font-bold text-blue-600 transition-colors">Edit</button>
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

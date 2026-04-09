import React from 'react';

interface ProductInfoProps {
    product: any;
    isWished?: boolean;
    onToggleWishlist?: (e: React.MouseEvent) => void;
}

export default function ProductInfo({ product, isWished, onToggleWishlist }: ProductInfoProps) {
    let tagsToRender: string[] = [];
    if (product?.tags) {
        if (Array.isArray(product.tags)) {
            tagsToRender = product.tags;
        } else if (typeof product.tags === 'string') {
            try { tagsToRender = JSON.parse(product.tags); } catch { tagsToRender = []; }
        }
    }

    let highlights: string[] = [];
    if (product?.highlights) {
        if (Array.isArray(product.highlights)) {
            highlights = product.highlights;
        } else if (typeof product.highlights === 'string') {
            try { highlights = JSON.parse(product.highlights); } catch { highlights = []; }
        }
    }

    const category = product?.category || "UI Resource";
    const additionalInfo = product?.additionalInfo;

    return (
        <div className="w-full flex flex-col gap-10 relative">
            {/* Header Section */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-blue-600/10 border border-blue-600/20 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                            {category}
                        </span>
                        <div className="hidden sm:block h-px w-12 bg-gray-100" />
                    </div>

                    {onToggleWishlist && (
                        <button
                            onClick={onToggleWishlist}
                            className={`group flex items-center gap-2.5 px-5 py-2.5 rounded-full border transition-all duration-300 text-[11px] font-black uppercase tracking-[0.15em] shrink-0 ${isWished
                                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20'
                                : 'bg-white border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-200 shadow-sm'}`}
                        >
                            <svg className={`w-3.5 h-3.5 ${isWished ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                            {isWished ? "Saved" : "Save"}
                        </button>
                    )}
                </div>

                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight uppercase break-words overflow-hidden">
                    {product?.title || "Premium Mockup Kit"}
                </h1>
            </div>

            {/* Description / Overview */}
            <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600/20 rounded-full" />
                <div className="pl-6 text-gray-600 leading-relaxed text-[16px] font-medium selection:bg-blue-500/30 break-words">
                    <p className="whitespace-pre-wrap italic opacity-90">
                        {product?.overview || product?.description || "This premium quality UI kit is carefully crafted and organized. Highly useful for any professional design work, featuring a modern aesthetic and scalable components."}
                    </p>
                </div>
            </div>

            {/* Additional Information Section */}
            {additionalInfo && (
                <div className="flex flex-col gap-6 p-8 sm:p-10 rounded-[2.5rem] bg-secondary border border-border shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-blue-600/10 transition-transform duration-1000" />

                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 flex items-center justify-center bg-background rounded-2xl border border-border text-blue-600 shadow-sm group-hover:scale-110 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                            </svg>
                        </div>
                        <h3 className="text-xs font-black text-foreground uppercase tracking-[0.25em]">Technical Details</h3>
                    </div>

                    <div className="relative pl-0.5">
                        <p className="text-sm text-muted-foreground leading-relaxed font-semibold break-words">
                            {additionalInfo}
                        </p>
                    </div>
                </div>
            )}

            {/* Tags (optional secondary) */}
            {tagsToRender.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                    {tagsToRender.map((tag: string, idx: number) => (
                        <span key={idx} className="px-4 py-2 rounded-xl border border-gray-100 bg-white text-gray-500 text-[11px] font-bold uppercase tracking-wider hover:border-blue-600/50 hover:text-blue-600 hover:bg-blue-50/30 transition-all cursor-default shadow-sm">
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

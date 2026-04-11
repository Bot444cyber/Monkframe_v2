import React from 'react';

interface ProductInfoProps {
    product: any;
    isWished?: boolean;
    onToggleWishlist?: (e: React.MouseEvent) => void;
}

export default function ProductInfo({ product, isWished, onToggleWishlist }: ProductInfoProps) {
    // Reusable Markdown Parser
    const parseMarkdown = (text: string, isBlock = false) => {
        if (!text) return "";
        let parsed = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\*\*(.*?)\*\*/g, '<b class="font-black">$1</b>')
            .replace(/__(.*?)__/g, '<u class="decoration-blue-600/30 decoration-2 underline-offset-4">$1</u>')
            .replace(/\*(.*?)\*/g, '<i class="italic opacity-90">$1</i>');

        if (isBlock) {
            parsed = parsed
                .replace(/^### (.*$)/gm, '<h3 class="text-lg font-black text-gray-900 mt-8 mb-4 uppercase tracking-wider block">$1</h3>')
                .replace(/^- (.*$)/gm, '<div class="flex items-start gap-3 my-2 pl-2"><span class="text-blue-600 font-bold text-lg leading-none mt-0.5">•</span><span class="flex-1">$1</span></div>');
        }
        return parsed;
    };

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
    const additionalInfoRaw = product?.additionalInfo || "";
    let additionalInfoItems: string[] = [];
    if (typeof additionalInfoRaw === 'string') {
        try {
            const parsed = JSON.parse(additionalInfoRaw);
            additionalInfoItems = Array.isArray(parsed) ? parsed : [additionalInfoRaw];
        } catch {
            // Fallback to comma splitting for legacy data
            additionalInfoItems = additionalInfoRaw.split(',').map(item => item.trim()).filter(Boolean);
        }
    } else if (Array.isArray(additionalInfoRaw)) {
        additionalInfoItems = additionalInfoRaw;
    }

    // Combine highlights and additional info items for a comprehensive list
    const allInfoItems = [...new Set([...highlights, ...additionalInfoItems])];

    const overview = product?.overview || product?.description || "This premium quality UI kit is carefully crafted and organized. Highly useful for any professional design work, featuring a modern aesthetic and scalable components.";
    const isLongDescription = overview.length > 350;
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <div className="w-full flex flex-col gap-10 relative">
            {/* Header Section */}
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span
                            className="px-4 py-1.5 bg-blue-600/5 border border-blue-600/10 text-blue-600 text-[11px] font-black uppercase tracking-[0.2em] rounded-full"
                            dangerouslySetInnerHTML={{ __html: parseMarkdown(category) }}
                        />
                    </div>

                    {onToggleWishlist && (
                        <button
                            onClick={onToggleWishlist}
                            aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
                            title={isWished ? "Remove from wishlist" : "Add to wishlist"}
                            className={`group flex items-center gap-2.5 px-6 py-3 rounded-full border transition-all duration-300 text-[11px] font-black uppercase tracking-[0.15em] shrink-0 ${isWished
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

                <h1
                    className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight uppercase wrap-break-word overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(product?.title || "Premium Mockup Kit") }}
                />
            </div>

            {/* Description / Overview */}
            <div className="relative group/desc">
                <div
                    className={`pl-0 text-gray-700 leading-relaxed text-[16px] font-medium selection:bg-blue-500/30 wrap-break-word whitespace-pre-wrap transition-all duration-500 ${!isExpanded && isLongDescription ? 'max-h-[160px] overflow-hidden' : 'max-h-[5000px]'}`}
                    dangerouslySetInnerHTML={{
                        __html: parseMarkdown(isExpanded || !isLongDescription ? overview : overview.substring(0, 350) + '...', true)
                    }}
                />
                {isLongDescription && (
                    <div className="mt-4 flex justify-start">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="group/btn flex items-center gap-2 px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-black uppercase tracking-[0.12em] rounded-xl transition-all active:scale-95 shadow-sm border border-blue-100/50"
                        >
                            {isExpanded ? (
                                <>
                                    Show Less
                                    <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
                                </>
                            ) : (
                                <>
                                    Read Full Description
                                    <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Additional Information Section (Large Pill Design) */}
            {allInfoItems.length > 0 && (
                <div className="flex flex-col gap-4 pt-4">
                    <h2 className="text-xl font-black text-gray-900">Additional info:</h2>

                    <div className="flex flex-col gap-4">
                        {allInfoItems.map((item: string, idx: number) => (
                            <div
                                key={idx}
                                className="w-fit px-8 py-6 rounded-[2rem] border border-gray-100 bg-white text-gray-700 text-[12px] font-black uppercase tracking-widest leading-relaxed shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_50px_-12px_rgba(0,0,0,0.1)] transition-all cursor-default"
                                dangerouslySetInnerHTML={{ __html: parseMarkdown(item) }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Tags (optional secondary) - More subtle */}
            {tagsToRender.length > 0 && !allInfoItems.some(i => tagsToRender.includes(i)) && (
                <div className="flex flex-wrap gap-2 mt-6">
                    {tagsToRender.map((tag: string, idx: number) => (
                        <span key={idx} className="px-4 py-2 rounded-xl border border-gray-100 bg-gray-50/50 text-gray-500 text-[10px] font-black uppercase tracking-widest cursor-default">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

import React from 'react';

interface ProductIncludesProps {
    product?: any;
}

export default function ProductIncludes({ product }: ProductIncludesProps) {
    // Helper to get icon for label
    const getIcon = (label: string) => {
        const lower = label.toLowerCase();
        if (lower.includes('screen')) return (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25v-15a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 4.5v15a2.25 2.25 0 002.25 2.25z" />
            </svg>
        );
        if (lower.includes('file') || lower.includes('format')) return (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
            </svg>
        );
        if (lower.includes('vector') || lower.includes('scale')) return (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
        );
        if (lower.includes('update')) return (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
        );
        return (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        );
    }

    // Use dynamic specifications if available
    let specsToRender: any[] = [];
    if (product?.specifications) {
        if (Array.isArray(product.specifications)) {
            specsToRender = product.specifications;
        } else if (typeof product.specifications === 'string') {
            try {
                specsToRender = JSON.parse(product.specifications);
            } catch {
                specsToRender = [];
            }
        }
    }

    const fileType = product?.fileType || "Figma";
    const isFigma = fileType.toLowerCase().includes('figma');

    return (
        <div className="h-full w-full rounded-3xl bg-[#050505] border border-white/5 relative overflow-hidden flex flex-col group/panel">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-white/[0.02]" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none opacity-50" />

            <div className="relative z-10 p-6 sm:p-8 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                        <span className="w-1 h-6 rounded-full bg-emerald-500" />
                        Specification
                    </h2>
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">V 1.0</span>
                </div>

                <div className="flex flex-col flex-1 overflow-y-auto pr-2 -mr-2">
                    {/* Features List */}
                    {specsToRender.map((item: any, i: number) => (
                        <div key={i} className="group flex items-center gap-4 py-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors -mx-4 px-4 sm:mx-0 sm:px-2 rounded-xl shrink-0">
                            <div className={`h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                {item.icon || getIcon(item.label || '')}
                            </div>
                            <div className="flex-1 flex flex-col gap-0.5">
                                <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">{item.label}</span>
                                <span className="text-xs text-zinc-500 font-mono tracking-tight">{item.desc}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-bold tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                                    {item.value}
                                </span>
                            </div>
                        </div>
                    ))}


                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-3 shrink-0">
                    <h3 className="text-sm font-bold text-white">{product?.price === 'Free' ? 'Format & Download' : 'File Format'}</h3>
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#1e1e1e] flex items-center justify-center border border-white/5 shrink-0 group-hover:scale-105 transition-transform">
                            {(() => {
                                const type = fileType.toLowerCase();
                                if (type.includes('figma')) return <svg className="w-6 h-6" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 28.5C19 25.9804 20.0009 23.5641 21.7825 21.7825C23.5641 20.0009 25.9804 19 28.5 19C31.0196 19 33.4359 20.0009 35.2175 21.7825C36.9991 23.5641 38 25.9804 38 28.5C38 31.0196 36.9991 33.4359 35.2175 35.2175C33.4359 36.9991 31.0196 38 28.5 38L19 38V28.5Z" fill="#1ABCFE" /><path d="M9.5 38C6.98043 38 4.56408 36.9991 2.78249 35.2175C1.00089 33.4359 0 31.0196 0 28.5C0 25.9804 1.00089 23.5641 2.78249 21.7825C4.56408 20.0009 6.98043 19 9.5 19L19 19V38H9.5Z" fill="#A259FF" /><path d="M19 19V9.5C19 6.98043 17.9991 4.56408 16.2175 2.78249C14.4359 1.00089 12.0196 0 9.5 0C6.98043 0 4.56408 1.00089 2.78249 2.78249C1.00089 4.56408 0 6.98043 0 9.5L0 19L19 19Z" fill="#F24E1E" /><path d="M9.5 38C6.34963 37.999 3.32846 39.2498 1.10086 41.4774C-1.12674 43.705 -1.12674 47.317 1.10086 49.5446C3.32846 51.7722 6.34963 53.023 9.5 53.022C12.0196 53.022 14.4359 52.0211 16.2175 50.2395C17.9991 48.4579 19 46.0416 19 43.522L19 38L9.5 38Z" fill="#0ACF83" /><path d="M19 0V19H28.5C31.0196 19 33.4359 17.9991 35.2175 16.2175C36.9991 14.4359 38 12.0196 38 9.5C38 6.98043 36.9991 4.56408 35.2175 2.78249C33.4359 1.00089 31.0196 0 28.5 0L19 0Z" fill="#FF7262" /></svg>;
                                if (type.includes('sketch')) return <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.7758 5.76019L11.9961 0.490234L21.2163 5.76019L21.2163 18.2392L11.9961 23.5113L2.7758 18.2392V5.76019Z" fill="#FDB300" /><path d="M11.9961 0.490234L11.9961 23.5113L21.2163 18.2392V5.76019L11.9961 0.490234Z" fill="#EA6C00" /></svg>;
                                if (type.includes('react')) return <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#61DAFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2" /><path d="M12 2C16.5 2 20 6.5 20 12C20 17.5 16.5 22 12 22C7.5 22 4 17.5 4 12C4 6.5 7.5 2 12 2Z" /><path d="M12 2C7.5 2 3 6.5 3 12C3 17.5 7.5 22 12 22C16.5 22 21 17.5 21 12C21 6.5 16.5 2 12 2Z" transform="rotate(60 12 12)" /><path d="M12 2C7.5 2 3 6.5 3 12C3 17.5 7.5 22 12 22C16.5 22 21 17.5 21 12C21 6.5 16.5 2 12 2Z" transform="rotate(-60 12 12)" /></svg>;
                                return (
                                    <div className="w-6 h-6 rounded-md bg-zinc-700 flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-inner">
                                        {fileType.slice(0, 1)}
                                    </div>
                                );
                            })()}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-white capitalize">{fileType} File</span>
                            <span className="text-xs text-zinc-500">{product?.fileSize || "189.6 KB"}</span>
                        </div>
                    </div>
                    {product?.price === 'Free' && (
                        <a
                            href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000'}/api/uis/${product?.id}/download`}
                            className="w-full h-12 rounded-xl bg-white text-black font-bold text-sm hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download File
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

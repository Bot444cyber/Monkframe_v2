import React from 'react';

interface ProductInfoProps {
    product: any;
}

export default function ProductInfo({ product }: ProductInfoProps) {
    let tagsToRender: string[] = [];
    if (product?.tags) {
        if (Array.isArray(product.tags)) {
            tagsToRender = product.tags;
        } else if (typeof product.tags === 'string') {
            try { tagsToRender = JSON.parse(product.tags); } catch { tagsToRender = []; }
        }
    } else {
        tagsToRender = ["UI Kit", "Design", "Figma", "App Design"];
    }

    let highlights: string[] = [];
    if (product?.highlights) {
        if (Array.isArray(product.highlights)) {
            highlights = product.highlights;
        } else if (typeof product.highlights === 'string') {
            try { highlights = JSON.parse(product.highlights); } catch { highlights = []; }
        }
    }

    return (
        <div className="w-full flex flex-col gap-8 relative">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{product?.title || "Premium Mockup Kit"}</h1>

            <div className="text-gray-600 leading-relaxed text-[15px] font-normal max-w-4xl">
                <p className="mb-4 whitespace-pre-wrap">
                    {product?.overview || product?.description || "This premium quality UI kit is carefully crafted and organized. Highly useful for any professional design work, featuring a modern aesthetic and scalable components for easy customization and adaptation."}
                </p>
            </div>

            {highlights.length > 0 && (
                <div className="mt-2 flex flex-col gap-5 bg-gray-50/50 p-6 sm:p-8 rounded-2xl border border-gray-100">
                    <h3 className="text-[17px] font-bold text-gray-900 tracking-tight">Highlights</h3>
                    <ul className="flex flex-col gap-4">
                        {highlights.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3.5 text-[15px] font-medium text-gray-600">
                                <div className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600 mt-0.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </div>
                                <span className="leading-snug">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {tagsToRender.length > 0 && (
                <div className="flex flex-col gap-3 mt-4">
                    <span className="text-xs font-bold text-gray-900 tracking-widest uppercase">Tags</span>
                    <div className="flex flex-wrap gap-2">
                        {tagsToRender.map((tag: string, idx: number) => (
                            <span key={idx} className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 text-xs font-bold uppercase tracking-wider cursor-pointer hover:border-gray-300 hover:text-gray-900 hover:shadow-sm transition-all">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

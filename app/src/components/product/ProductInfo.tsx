interface ProductInfoProps {
    product: any;
}

export default function ProductInfo({ product }: ProductInfoProps) {
    return (
        <div className="max-w-[1000px] mx-auto mb-32 relative">
            {/* Decorative side line */}
            {/* Decorative side line REMOVED */}
            {/* <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-x-12 hidden xl:block" /> */}
            {/* <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent translate-x-12 hidden xl:block" /> */}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                {/* Overview */}
                <div className="lg:col-span-7">
                    <h2 className="mb-8 text-2xl font-bold text-white flex items-center gap-3">
                        Overview
                        <div className="h-px flex-1 bg-white/10" />
                    </h2>
                    <div className="flex flex-col gap-6 text-gray-400 leading-relaxed text-lg font-light">
                        <p>
                            <span className="text-white font-normal">{product.title}</span> is a premium design resource.
                        </p>
                        <p>
                            {product.overview || product.description || "This UI kit focuses on clarity, usability, and visual consistency, making it suitable for real-world applications. The design features clean layouts, soft colors, and playful visual elements to create a warm and trustworthy experience."}
                        </p>
                        <p className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-base">
                            This package includes UI design only, without UX flow, prototype, animation, branding, or logo design.
                        </p>
                    </div>
                </div>

                {/* Highlights & Format */}
                <div className="lg:col-span-5 flex flex-col gap-12">
                    <div className="p-8 rounded-3xl bg-black border border-white/5 relative overflow-hidden group">
                        {/* Gradients removed for simple solid look */}
                        <div className="absolute inset-0 bg-transparent" />
                        <h2 className="mb-6 text-xl font-bold text-white">Highlights</h2>
                        <ul className="flex flex-col gap-4 mb-8">
                            {(() => {
                                const raw = product.highlights;
                                let highlights: string[] = [];
                                if (Array.isArray(raw)) {
                                    highlights = raw;
                                } else if (typeof raw === 'string') {
                                    try { highlights = JSON.parse(raw); } catch { highlights = []; }
                                }
                                const list = highlights.length > 0 ? highlights : [
                                    "Mobile-first ecommerce UI kit",
                                    "Clean, modern & friendly visual style",
                                    "Well organized Figma layers & Auto layout",
                                    "Component Library",
                                    "Easy to customize and developer ready",
                                    "Suitable for personal & commercial projects",
                                ];
                                return list.map((item: string, i: number) => (
                                    <li key={i} className="flex items-start gap-4 text-sm text-gray-300 group">
                                        <div className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-green-500/10 text-green-400 group-hover:bg-green-500/20 group-hover:scale-110 transition-all mt-0.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                        </div>
                                        <span className="group-hover:text-white transition-colors leading-tight">{item}</span>
                                    </li>
                                ));
                            })()}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

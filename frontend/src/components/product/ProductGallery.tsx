import Image from 'next/image';

interface ProductGalleryProps {
    product: any;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
    const color = product.color || "bg-gray-100";

    const bannerImage = product.imageSrc || product.image || "";

    let showcase: string[] = [];
    if (Array.isArray(product.showcase)) {
        showcase = product.showcase;
    } else if (typeof product.showcase === 'string') {
        try { showcase = JSON.parse(product.showcase); } catch { showcase = []; }
    }

    const rawShowcase = Array.isArray(showcase) ? showcase : [];
    const highlights = Array.isArray(product.highlights) ? product.highlights : [];
    const highlightImages = highlights.filter((h: any) => typeof h === 'string' && (h.startsWith('http') || h.startsWith('/')));

    const allImages = [...new Set([
        bannerImage,
        ...rawShowcase,
        ...highlightImages
    ].filter(Boolean))];

    return (
        <div className="flex flex-col gap-10 w-full">
            {allImages.length > 0 ? (
                allImages.map((src, idx) => (
                    <div
                        key={idx}
                        className={`relative w-full overflow-hidden rounded-[2.5rem] border border-gray-100/50 shadow-2xl ${color} bg-opacity-20`}
                        style={{ aspectRatio: '16 / 10' }}
                    >
                        <Image
                            src={src}
                            alt={`${product.title} - view ${idx + 1}`}
                            fill
                            priority={idx === 0}
                            loading={idx === 0 ? 'eager' : 'lazy'}
                            sizes="(max-width: 1024px) 100vw, 62vw"
                            className="object-cover"
                            style={{ willChange: 'auto' }}
                            unoptimized={src.includes('://') || src.startsWith('/api') || src.includes('google')}
                            {...({ referrerPolicy: "no-referrer" } as any)}
                        />
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[2.5rem] pointer-events-none" />
                    </div>
                ))
            ) : (
                <div
                    className={`relative w-full overflow-hidden rounded-[2.5rem] ${color} bg-opacity-20`}
                    style={{ aspectRatio: '16 / 10' }}
                >
                    <div className="absolute inset-0 p-4">
                        <div className="relative w-full h-full bg-white rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-center">
                            <span className="text-gray-400 font-medium">No exhibition images available</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

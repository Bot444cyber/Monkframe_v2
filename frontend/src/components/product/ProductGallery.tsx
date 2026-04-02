interface ProductGalleryProps {
    product: any;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
    const color = product.color || "bg-gray-100";

    // Aggregate images
    const heroImage = product.image || product.imageSrc;

    let showcase: string[] = [];
    if (Array.isArray(product.showcase)) {
        showcase = product.showcase;
    } else if (typeof product.showcase === 'string') {
        try { showcase = JSON.parse(product.showcase); } catch { showcase = []; }
    }

    // Fallback for showcases spelling
    if (showcase.length === 0 && product.showcases) {
        if (Array.isArray(product.showcases)) {
            showcase = product.showcases;
        } else if (typeof product.showcases === 'string') {
            try { showcase = JSON.parse(product.showcases); } catch { showcase = []; }
        }
    }

    const allImages = [heroImage, ...showcase].filter(Boolean);

    return (
        <div className="flex flex-col gap-6 w-full">
            {allImages.length > 0 ? (
                allImages.map((src, idx) => (
                    <div key={idx} className={`relative w-full overflow-hidden ${idx === 0 ? 'rounded-2xl border border-gray-100 shadow-sm' : ''} ${color} bg-opacity-20 aspect-[1.4/1]`}>
                        <img
                            src={src}
                            alt={`${product.title} - view ${idx + 1}`}
                            referrerPolicy="no-referrer"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                ))
            ) : (
                <div className={`relative w-full overflow-hidden rounded-2xl ${color} bg-opacity-20 aspect-[1.4/1]`}>
                    <div className="absolute inset-0 p-2">
                        <div className="relative w-full h-full bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                            <span className="text-gray-400">No images available</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

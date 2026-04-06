interface ProductGalleryProps {
    product: any;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
    const color = product.color || "bg-gray-100";

    // Banner is the primary hero image
    const bannerImage = product.imageSrc || product.image;

    let showcase: string[] = [];
    if (Array.isArray(product.showcase)) {
        showcase = product.showcase;
    } else if (typeof product.showcase === 'string') {
        try { showcase = JSON.parse(product.showcase); } catch { showcase = []; }
    }

    // Limit showcase to 3 images
    const galleryImages = showcase.slice(0, 3).filter(Boolean);

    const allImages = [bannerImage, ...galleryImages].filter(Boolean);

    return (
        <div className="flex flex-col gap-6 w-full">
            {allImages.length > 0 ? (
                allImages.map((src, idx) => (
                    <div key={idx} className={`relative w-full overflow-hidden rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm ${color} bg-opacity-20 aspect-[16/10] sm:aspect-[1.4/1]`}>
                        <img
                            src={src}
                            alt={`${product.title} - view ${idx + 1}`}
                            referrerPolicy="no-referrer"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
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

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from './ts/types';
import { InteractionService } from '@/services/interaction.service';
import CommentSection from './CommentSection';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
    const { user } = useAuth();
    const [isWishlisted, setIsWishlisted] = useState(product.wished);

    React.useEffect(() => {
        setIsWishlisted(product.wished);
    }, [product]);

    const isFree = product.price.toLowerCase() === 'free';

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation();
        if (!user) { toast.error("Please login to manage your wishlist"); return; }
        const newState = !isWishlisted;
        setIsWishlisted(newState);
        try {
            await InteractionService.toggleWishlist(product.id);
            toast.success(newState ? "Added to wishlist" : "Removed from wishlist");
        } catch {
            setIsWishlisted(!newState);
            toast.error("Failed to update wishlist");
        }
    };


    const fileLabel = product.fileType
        ? `${product.fileType} file`
        : isFree ? 'Free download' : product.price;

    return (
        <>
            <Link
                href={`/product/v1/${product.id}`}
                className="group flex flex-col gap-3 cursor-pointer"
            >
                {/* ── Image Block ── */}
                <div className="relative w-full aspect-4/3 bg-[#EEF0F5] rounded-2xl overflow-hidden">
                    {product.imageSrc ? (
                        <Image
                            src={product.imageSrc}
                            alt={product.title}
                            fill
                            priority={priority}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 will-change-transform transform-gpu backface-hidden"
                            unoptimized={product.imageSrc.includes('drive.google.com')}
                            {...({ referrerPolicy: "no-referrer" } as any)}
                        />
                    ) : (
                        <div className="h-full w-full bg-[#EEF0F5]" />
                    )}

                    {/* Subtle hover dim */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-300 rounded-2xl" />

                    {/* Action buttons — slide in on hover */}
                    <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                        {/* Wishlist */}
                        <button
                            onClick={toggleWishlist}
                            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                            className={`flex h-8 w-8 items-center justify-center rounded-xl border shadow-sm transition-all duration-200 ${isWishlisted
                                ? 'bg-blue-600 text-white border-blue-500'
                                : 'bg-white/95 border-gray-200/80 text-gray-400 hover:text-blue-600'
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                            </svg>
                        </button>

                    </div>
                </div>

                {/* ── Text Info ── */}
                <div className="flex flex-col gap-1 px-0.5">
                    {/* Category */}
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest leading-none">
                        {product.category}
                    </span>

                    {/* Title */}
                    <h3 className="text-[15px] sm:text-[16px] font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-gray-600 transition-colors duration-200">
                        {product.title}
                    </h3>

                    {/* File meta */}
                    <p className="text-[13px] text-gray-500 leading-none mt-0.5">
                        {fileLabel}
                    </p>
                </div>
            </Link>

        </>
    );
}

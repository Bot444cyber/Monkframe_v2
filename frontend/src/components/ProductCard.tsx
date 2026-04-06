import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from './ts/types';
import { InteractionService } from '@/services/interaction.service';
import CommentSection from './CommentSection';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }: { product: Product }) {
    const { user } = useAuth();
    const [isWishlisted, setIsWishlisted] = useState(product.wished);
    const [isLiked, setIsLiked] = useState(product.liked);
    const [likesCount, setLikesCount] = useState(product.likes);
    const [isLikeAnimating, setIsLikeAnimating] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);

    React.useEffect(() => {
        setIsLiked(product.liked);
        setLikesCount(product.likes);
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

    const toggleLike = async (e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation();
        if (!user) { toast.error("Please login to like this asset"); return; }
        const newLikedState = !isLiked;
        setIsLiked(newLikedState);
        setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
        if (newLikedState) { setIsLikeAnimating(true); setTimeout(() => setIsLikeAnimating(false), 1000); }
        try {
            const response = await InteractionService.toggleLike(product.id);
            if (typeof response.likesCount === 'number') setLikesCount(response.likesCount);
            if (response.liked !== undefined) {
                setIsLiked(response.liked);
                toast.success(response.message || (response.liked ? "Liked!" : "Unliked"));
            }
        } catch {
            setIsLiked(!newLikedState);
            setLikesCount(prev => !newLikedState ? prev + 1 : prev - 1);
            toast.error("Failed to like");
        }
    };

    const fileLabel = product.fileType
        ? `${likesCount > 0 ? likesCount + ' ' : ''}${product.fileType} file${likesCount !== 1 ? 's' : ''}`
        : isFree ? 'Free download' : product.price;

    return (
        <>
            <Link
                href={`/product/${product.id}`}
                className="group flex flex-col gap-3 cursor-pointer"
            >
                {/* ── Image Block ── */}
                <div className="relative w-full aspect-4/3 bg-[#EEF0F5] rounded-2xl overflow-hidden">
                    {product.imageSrc ? (
                        <img
                            src={product.imageSrc}
                            alt={product.title}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
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
                            className={`flex h-8 w-8 items-center justify-center rounded-xl border backdrop-blur-sm shadow-sm transition-all duration-200 ${isWishlisted
                                ? 'bg-amber-400 text-white border-amber-300'
                                : 'bg-white/95 border-gray-200/80 text-gray-400 hover:text-amber-500'
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                            </svg>
                        </button>

                        {/* Like */}
                        <button
                            onClick={toggleLike}
                            title={isLiked ? "Unlike" : "Like"}
                            className={`flex h-8 w-8 items-center justify-center rounded-xl border backdrop-blur-sm shadow-sm transition-all duration-200 ${isLiked
                                ? 'bg-rose-500 text-white border-rose-400'
                                : 'bg-white/95 border-gray-200/80 text-gray-400 hover:text-rose-500'
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} className={`w-4 h-4 ${isLikeAnimating ? 'animate-bounce' : ''}`}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </button>

                        {/* Comment */}
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsCommentsOpen(true); }}
                            title="Comments"
                            className="flex h-8 w-8 items-center justify-center rounded-xl border border-gray-200/80 bg-white/95 backdrop-blur-sm text-gray-400 hover:text-gray-700 shadow-sm transition-all duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ── Text Info ── */}
                <div className="flex flex-col gap-1 px-0.5">
                    {/* Category */}
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest leading-none">
                        {product.category}
                    </span>

                    {/* Title */}
                    <h3 className="text-[15px] sm:text-[16px] font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-gray-600 transition-colors duration-200">
                        {product.title}
                    </h3>

                    {/* File meta */}
                    <p className="text-[13px] text-gray-400 leading-none mt-0.5">
                        {fileLabel}
                    </p>
                </div>
            </Link>

            <CommentSection uiId={product.id} isOpen={isCommentsOpen} onClose={() => setIsCommentsOpen(false)} />
        </>
    );
}

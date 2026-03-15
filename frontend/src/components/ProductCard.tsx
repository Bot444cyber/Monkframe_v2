import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from './ts/types';
import { InteractionService } from '@/services/interaction.service';
import CommentSection from './CommentSection';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }: { product: Product }) {
    const { user } = useAuth();
    const [isWishlisted, setIsWishlisted] = useState(product.wished);
    const [isLiked, setIsLiked] = useState(product.liked);
    const [likesCount, setLikesCount] = useState(product.likes);
    const [isLikeAnimating, setIsLikeAnimating] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);

    const { socket } = useSocket();

    React.useEffect(() => {
        if (!socket) return;

        socket.on("like:updated", (data: any) => {
            if (data.uiId === product.id) {
                setLikesCount(data.likesCount);
                // If the event was triggered by the current user (e.g. from another tab/device), update state
                // Note: user.id must be string compared to data.userId
                if (user && String(user.user_id) === String(data.userId)) {
                    setIsLiked(data.liked);
                }
            }
        });

        return () => {
            socket.off("like:updated");
        };
    }, [socket, product.id, user]);

    React.useEffect(() => {
        setIsLiked(product.liked);
        setLikesCount(product.likes);
        setIsWishlisted(product.wished);
    }, [product]);

    const isFree = product.price.toLowerCase() === 'free';

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.error("Please login to manage your wishlist");
            return;
        }

        const newState = !isWishlisted;
        setIsWishlisted(newState);

        try {
            await InteractionService.toggleWishlist(product.id);
            if (newState) toast.success("Added to wishlist");
            else toast.success("Removed from wishlist");
        } catch (error) {
            setIsWishlisted(!newState);
            console.error(error);
            toast.error("Failed to update wishlist");
        }
    };

    const toggleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            toast.error("Please login to like this asset");
            return;
        }

        const newLikedState = !isLiked;
        setIsLiked(newLikedState);
        setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);

        if (newLikedState) {
            setIsLikeAnimating(true);
            setTimeout(() => setIsLikeAnimating(false), 1000);
        }

        try {
            const response = await InteractionService.toggleLike(product.id);
            if (typeof response.likesCount === 'number') {
                setLikesCount(response.likesCount);
            }
            if (response.liked !== undefined) {
                setIsLiked(response.liked);
                if (response.liked) {
                    toast.success(response.message || "Liked!");
                } else {
                    toast.success(response.message || "Unliked");
                }
            }
        } catch (error) {
            setIsLiked(!newLikedState);
            setLikesCount(prev => !newLikedState ? prev + 1 : prev - 1);
            console.error(error);
            toast.error("Failed to like");
        }
    };



    return (
        <>
            <Link href={`/product/${product.id}`} className="group relative flex flex-col overflow-hidden rounded-3xl bg-[#0a0a0a] border border-white/5 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-xl">
                {/* Subtle internal gradient shine REMOVED for clean design */}
                <div className="absolute inset-0 bg-transparent opacity-0 transition-opacity duration-700 pointer-events-none" />

                {/* Top Info Overlay (Exclusive Tag) */}
                <div className="absolute top-4 left-4 z-30 flex gap-2">
                    <span className="bg-black text-white/90 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/5 uppercase tracking-widest">
                        Premium
                    </span>
                    {product.fileType && (
                        <span className="bg-white/10 backdrop-blur-md text-white/90 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/5 uppercase tracking-widest">
                            {product.fileType}
                        </span>
                    )}
                </div>

                {/* Floating Actions */}
                <div className="absolute top-4 right-4 z-40 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <button
                        onClick={toggleWishlist}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 ${isWishlisted
                            ? "bg-amber-500 text-white border-amber-400"
                            : "bg-[#111] border-white/10 text-zinc-400 hover:text-white hover:bg-[#222]"
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                        </svg>
                    </button>

                    <button
                        onClick={toggleLike}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 ${isLiked
                            ? "bg-rose-500 text-white border-rose-400"
                            : "bg-[#111] border-white/10 text-zinc-400 hover:text-white hover:bg-[#222]"
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} className={`w-4 h-4 ${isLikeAnimating ? 'animate-ping' : ''}`}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                    </button>

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsCommentsOpen(true);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#111] text-zinc-400 hover:text-white hover:bg-[#222] transition-all duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                        </svg>
                    </button>
                </div>

                {/* Asset Preview */}
                <div className={`relative aspect-[1.5/1] w-full overflow-hidden ${product.color || 'bg-[#111]'}`}>
                    <img
                        src={product.imageSrc}
                        alt={product.title}
                        className="h-full w-full object-cover transition-transform duration-[1.2s] ease-in-out group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-transparent" />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-3 p-5 pt-2 relative z-10 flex-1">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-zinc-400 transition-colors">
                            {product.category}
                        </span>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-zinc-600 group-hover:text-yellow-500 transition-colors">
                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                </svg>
                                <span className="text-[10px] font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors">{(product.rating || 4.8).toFixed(1)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-3 h-3 ${isLiked ? 'text-rose-500' : 'text-zinc-600 group-hover:text-rose-500/50'} transition-colors`}>
                                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                </svg>
                                <span className="text-[10px] font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors">{likesCount}</span>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-base font-bold text-zinc-200 group-hover:text-white transition-colors leading-tight line-clamp-2">
                        {product.title}
                    </h3>

                    <div className="mt-auto pt-3 flex items-center justify-between border-t border-white/5">
                        <span className={`text-sm font-bold ${isFree ? 'text-emerald-400' : 'text-white'}`}>
                            {product.price}
                        </span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/5 text-zinc-400 group-hover:bg-white group-hover:text-black transition-all transform group-hover:-rotate-45">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </div>
                    </div>
                </div>
            </Link>
            <CommentSection uiId={product.id} isOpen={isCommentsOpen} onClose={() => setIsCommentsOpen(false)} />
        </>
    );
}

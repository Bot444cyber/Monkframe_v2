"use client";

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductHeader from "@/components/product/ProductHeader";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import { useParams } from "next/navigation";
import { InteractionService } from "@/services/interaction.service";
import CommentSection from "@/components/CommentSection";
import ProductIncludes from "@/components/product/ProductIncludes";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";

export default function ProductDetailsPage() {
    const params = useParams();
    const [product, setProduct] = useState<any>(null);
    const [likesCount, setLikesCount] = useState(0);
    const [commentsCount, setCommentsCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isWished, setIsWished] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);

    const { socket } = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        if (!socket || !product) return;

        socket.on("like:updated", (data: any) => {
            if (data.uiId === product.id) {
                setLikesCount(data.likesCount);
                if (user && String(user.user_id) === String(data.userId)) {
                    setIsLiked(data.liked);
                }
            }
        });

        socket.on("wishlist:updated", (data: any) => {
            if (data.uiId === product.id) {
                if (user && String(user.user_id) === String(data.userId)) {
                    setIsWished(data.wished);
                }
            }
        });

        socket.on("ui:updated", (data: any) => {
            if (data.ui.id === product.id) {
                // Normalize incoming data to match component state structure
                const raw = data.ui;
                const normalized = {
                    ...raw,
                    price: !raw.price || raw.price == 0 ? 'Free' : `$${raw.price}`,
                    author: raw.creator?.full_name || raw.author || "Unknown",
                };
                setProduct((prev: any) => ({ ...prev, ...normalized }));
            }
        });

        return () => {
            socket.off("like:updated");
            socket.off("ui:updated");
            socket.off("wishlist:updated");
        };
    }, [socket, product, user]);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!params?.id) return;
            try {
                const response = await InteractionService.getUI(params.id as string);
                if (response.status) {
                    const raw = response.data;
                    const normalized = {
                        ...raw,
                        price: !raw.price || raw.price == 0 ? 'Free' : `$${raw.price}`,
                        author: raw.creator?.full_name || raw.author || "Unknown",
                    };
                    setProduct(normalized);
                    setLikesCount(raw.likes || 0);
                    setIsLiked(raw.liked || false);
                    setIsWished(raw.wished || false);
                    if (raw.comments) setCommentsCount(raw.comments.length);
                }
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [params?.id]);

    const handleToggleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Optimistic update
        const newState = !isLiked;
        setIsLiked(newState);
        setLikesCount(prev => newState ? prev + 1 : prev - 1);

        try {
            const response = await InteractionService.toggleLike(product.id);
            // Sync
            if (response.likesCount !== undefined) setLikesCount(response.likesCount);
            if (response.liked !== undefined) {
                setIsLiked(response.liked);
                if (response.liked) {
                    toast.success(response.message || "Liked!");
                } else {
                    toast.success(response.message || "Unliked");
                }
            }
        } catch (error) {
            // Revert
            setIsLiked(!newState);
            setLikesCount(prev => !newState ? prev + 1 : prev - 1);
            toast.error("Failed to like");
        }
    };

    const handleToggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Optimistic
        const newState = !isWished;
        setIsWished(newState);

        try {
            const response = await InteractionService.toggleWishlist(product.id);
            // Sync
            if (response.wished !== undefined) {
                setIsWished(response.wished);
                if (response.wished) {
                    toast.success("Added to wishlist");
                } else {
                    toast.success("Removed from wishlist");
                }
            }
        } catch (error) {
            // Revert
            setIsWished(!newState);
            toast.error("Failed to update wishlist");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-zinc-500 animate-pulse">Loading details...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p className="text-xl text-zinc-500">Product not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30">
            {/* Background Ambient Glow REMOVED */}
            <div className="fixed inset-0 pointer-events-none">
                {/* Clean dark background is already set on the container */}
            </div>

            <Header />

            <main className="relative mx-auto max-w-[1600px] px-6 lg:px-12 py-24">

                <ProductHeader
                    id={product.id}
                    title={product.title}
                    subtitle={product.category || "Design Resource"}
                    author={product.creator?.full_name || product.author || "Unknown"}
                    price={product.price}
                    isLiked={isLiked}
                    isWished={isWished}
                    likesCount={likesCount}
                    commentsCount={commentsCount}
                    fileType={product.fileType}
                    previewUrl={product.previewUrl || product.link || "https://lumina-ui.com/demo"}
                    onToggleLike={handleToggleLike}
                    onToggleWishlist={handleToggleWishlist}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
                    {/* Left Column - Images */}
                    <div>
                        <ProductGallery product={product} />
                    </div>

                    {/* Right Column - Whats Included & Details */}
                    <div className="flex flex-col gap-8 h-full">
                        <ProductIncludes product={product} />

                        {/* Mobile/Tablet Download (Hidden on desktop if we want strict layout, but let's keep it accessible) */}
                        {/* Actually, let's just put ProductInfo below or rearrange. 
                            If strict equality is needed, maybe Includes sits next to Hero.
                            But Hero has showcase below it in Gallery.
                            Let's rely on the grid to flow naturally. 
                        */}
                    </div>
                </div>

                <div className="mb-24">
                    <ProductInfo product={product} />
                </div>

                {/* Discussion / Comments Section */}
                <div className="mb-24 flex flex-col gap-8 border-t border-white/5 pt-16">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white">Discussion & Feedback</h2>
                        <p className="text-zinc-400 mt-2">Share your thoughts on this resource</p>
                    </div>

                    <div className="w-full max-w-4xl mx-auto">
                        <CommentSection
                            uiId={product.id}
                            variant="embedded"
                            onCommentsChange={setCommentsCount}
                        />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

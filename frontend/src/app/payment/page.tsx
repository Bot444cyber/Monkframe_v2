"use client";

import React, { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PaymentForm from '@/components/payment/PaymentForm';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

function PaymentContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const title = searchParams?.get('title') || 'Premium UI Kit';
    const price = searchParams?.get('price') || '$29.00';
    const id = searchParams?.get('id');

    const handleSuccess = () => {
        toast.success("Payment successful!");
        if (id) {
            router.push(`/product/${id}`);
        } else {
            router.push('/');
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            {/* Left Side Summary */}
            <div className="p-5 md:p-8 bg-zinc-900/50 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between min-h-[400px]">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
                    <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="w-16 h-16 rounded-xl bg-linear-to-br from-indigo-500 to-purple-500 shrink-0" />
                        <div>
                            <h3 className="font-bold text-white leading-tight mb-1">{title}</h3>
                            <span className="text-xs text-zinc-400 font-mono uppercase tracking-wide">Digital License</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-white/5">
                    <div className="flex justify-between text-zinc-400">
                        <span>Subtotal</span>
                        <span>{price}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                        <span>Tax</span>
                        <span>$0.00</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-white/5 mt-2">
                        <span>Total</span>
                        <span>{price}</span>
                    </div>
                </div>
            </div>

            {/* Right Side Form */}
            <div className="p-5 md:p-8 bg-black">
                <PaymentForm
                    productTitle={title}
                    productPrice={price}
                    onSuccess={handleSuccess}
                />
            </div>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col font-sans">
            {/* Background Ambient Glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-purple-500/10 rounded-full blur-[100px]" />
            </div>

            <Header />

            <main className="flex-1 flex items-center justify-center p-6 py-24 relative z-10 opacity-0 animate-in fade-in duration-500 forwards animation-delay-300" style={{ animationFillMode: 'forwards' }}>
                <Suspense fallback={
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-10 w-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-zinc-500">Loading checkout...</p>
                    </div>
                }>
                    <PaymentContent />
                </Suspense>
            </main>

            <Footer />
        </div>
    );
}

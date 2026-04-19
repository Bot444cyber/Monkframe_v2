"use client";

import React, { Suspense, useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PaymentForm from '@/components/payment/PaymentForm';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PaymentContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const title = searchParams?.get('title') || 'Premium UI Kit';
    const price = searchParams?.get('price') || '$29.00';
    const id = searchParams?.get('id');

    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const redirectStatus = searchParams?.get('redirect_status');
    const paymentIntentIdParam = searchParams?.get('payment_intent');

    useEffect(() => {
        const handleSuccessRedirect = async () => {
            if (paymentIntentIdParam) {
                try {
                    const token = localStorage.getItem('auth_token');
                    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
                    await fetch(`${API_BASE_URL}/api/payment/confirm-payment`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ paymentIntentId: paymentIntentIdParam })
                    });
                } catch (err) {
                    console.error("Failed to confirm payment in backend via redirect", err);
                }
            }
            toast.success("Payment successful!");
            if (id) {
                const cat = searchParams?.get('category') || 'mockups';
                router.push(`/${cat}/${id}?autoDownload=true`);
            } else {
                router.push('/');
            }
        };

        if (redirectStatus === 'succeeded') {
            handleSuccessRedirect();
            return;
        }

        const fetchPaymentIntent = async () => {
            try {
                const priceString = price.replace(/[^0-9.-]+/g, "");
                const amount = Math.round(parseFloat(priceString) * 100) || 2900;

                const token = localStorage.getItem('auth_token');
                const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';

                const res = await fetch(`${API_BASE_URL}/api/payment/create-payment-intent`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ amount, currency: 'usd', uiId: id }),
                });

                if (res.status === 401) {
                    toast.error("Please log in to complete your checkout.");
                    router.push('/login');
                    return;
                }

                if (res.ok) {
                    const data = await res.json();
                    if (data.clientSecret) {
                        setClientSecret(data.clientSecret);
                    }
                } else {
                    const errText = await res.text();
                    toast.error(`Checkout initialization failed: ${res.statusText}`);
                    console.error("Payment intent fetch failed:", res.status, errText);
                }
            } catch (err) {
                console.error("Failed to fetch payment intent", err);
            }
        };

        fetchPaymentIntent();
    }, [price, id, redirectStatus, paymentIntentIdParam, router]);

    const handleSuccess = async (paymentIntentId?: string) => {
        if (paymentIntentId) {
            try {
                const token = localStorage.getItem('auth_token');
                const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
                await fetch(`${API_BASE_URL}/api/payment/confirm-payment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ paymentIntentId })
                });
            } catch (err) {
                console.error("Failed to confirm payment in backend", err);
            }
        }

        toast.success("Payment successful!");
        if (id) {
            const cat = searchParams?.get('category') || 'mockups';
            router.push(`/${cat}/${id}?autoDownload=true`);
        } else {
            router.push('/');
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="p-5 md:p-8 bg-white border-b md:border-b-0 md:border-r border-gray-100 flex flex-col justify-between min-h-[400px]">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="w-16 h-16 rounded-xl bg-linear-to-br from-blue-50 to-blue-100 border border-blue-600/10 shrink-0" />
                        <div>
                            <h3 className="font-bold text-gray-900 leading-tight mb-1">{title}</h3>
                            <span className="text-xs text-gray-500 font-mono uppercase tracking-wide">Digital License</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-gray-100">
                    <div className="flex justify-between text-gray-500">
                        <span>Subtotal</span>
                        <span>{price}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                        <span>Tax</span>
                        <span>$0.00</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                        <span>Total</span>
                        <span>{price}</span>
                    </div>
                </div>
            </div>

            {/* Right Side Form */}
            <div className="p-5 md:p-8 bg-gray-50/50 transition-colors duration-500">
                {clientSecret ? (
                    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'flat' } }}>
                        <PaymentForm
                            productTitle={title}
                            productPrice={price}
                            onSuccess={handleSuccess}
                        />
                    </Elements>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center min-h-[300px] gap-4 animate-pulse">
                        <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-lg">
                            <img src="/logo/M_SHAPE.svg" alt="Loading" className="w-6 h-6 object-contain" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading Payment</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans selection:bg-blue-600/10 selection:text-blue-600 transition-colors duration-500">
            <Header />

            <main className="flex-1 flex items-center justify-center p-6 py-24 relative z-10 animate-fade-in-up">
                <Suspense fallback={
                    <div className="flex flex-col items-center gap-4 animate-pulse">
                        <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-lg">
                            <img src="/logo/M_SHAPE.svg" alt="Loading checkout" className="w-6 h-6 object-contain" />
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading checkout...</p>
                    </div>
                }>
                    <PaymentContent />
                </Suspense>
            </main>

            <Footer />
        </div>
    );
}

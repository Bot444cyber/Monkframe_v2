"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PaymentForm from './PaymentForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useParams } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: {
        id?: string;
        title: string;
        price: string;
        imageSrc?: string;
    };
    onSuccess: () => void;
}

export default function PaymentModal({ isOpen, onClose, product, onSuccess }: PaymentModalProps) {
    const params = useParams();
    const [mounted, setMounted] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Fetch PaymentIntent
            const fetchPaymentIntent = async () => {
                try {
                    // Parse price: "$99.00" -> 9900
                    const priceString = product.price.replace(/[^0-9.-]+/g, "");
                    const amount = Math.round(parseFloat(priceString) * 100);

                    const token = localStorage.getItem('auth_token');
                    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';

                    const res = await fetch(`${API_BASE_URL}/api/payment/create-payment-intent`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            amount,
                            currency: 'usd',
                            uiId: product.id || params?.id
                        }),
                    });

                    if (!res.ok) {
                        const errorText = await res.text();
                        console.error("Payment intent fetch failed:", res.status, errorText);
                        // If 401, maybe redirect to login? For now just log.
                        return;
                    }

                    const data = await res.json();
                    if (data.clientSecret) {
                        setClientSecret(data.clientSecret);
                    } else {
                        console.error("No clientSecret returned", data);
                    }
                } catch (err) {
                    console.error("Failed to fetch payment intent", err);
                }
            };
            fetchPaymentIntent();
        } else {
            document.body.style.overflow = 'unset';
            setClientSecret(null);
        }
        return () => {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen, product.price]);

    if (!mounted || !isOpen) return null;

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
        onSuccess();
        onClose();
    };

    const modalContent = (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center sm:text-left">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />

                {/* Modal Window */}
                <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row transform transition-all animate-in fade-in zoom-in-95 duration-200 text-left my-8">

                    {/* Left Side: Order Summary */}
                    <div className="w-full md:w-1/3 bg-zinc-900/50 p-5 md:p-8 border-b md:border-b-0 md:border-r border-white/5 flex flex-col">
                        <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>

                        <div className="flex gap-4 mb-6">
                            {product.imageSrc ? (
                                <img src={product.imageSrc} alt={product.title} className="w-16 h-16 rounded-xl object-cover bg-zinc-800" />
                            ) : (
                                <div className="w-16 h-16 rounded-xl bg-linear-to-br from-indigo-500 to-purple-500 shrink-0" />
                            )}
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-white line-clamp-2">{product.title}</span>
                                <span className="text-xs text-zinc-400 mt-1">Digital License</span>
                            </div>
                        </div>

                        <div className="mt-auto space-y-3 pt-6 border-t border-white/5">
                            <div className="flex justify-between text-sm text-zinc-400">
                                <span>Subtotal</span>
                                <span>{product.price}</span>
                            </div>
                            <div className="flex justify-between text-sm text-zinc-400">
                                <span>Tax</span>
                                <span>$0.00</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-white pt-2">
                                <span>Total</span>
                                <span>{product.price}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Payment Form */}
                    <div className="flex-1 p-5 md:p-8 bg-black">
                        {clientSecret ? (
                            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
                                <PaymentForm
                                    productTitle={product.title}
                                    productPrice={product.price}
                                    onSuccess={handleSuccess}
                                    onCancel={onClose}
                                    isModal={true}
                                />
                            </Elements>
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <span className="loading loading-spinner text-white">Loading payment...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}

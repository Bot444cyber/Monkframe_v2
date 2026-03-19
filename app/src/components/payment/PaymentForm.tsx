"use client";

import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

export interface PaymentFormProps {
    productTitle: string;
    productPrice: string;
    onSuccess: (paymentIntentId?: string) => void;

    onCancel?: () => void;
    isModal?: boolean;
}

export default function PaymentForm({ productTitle, productPrice, onSuccess, onCancel, isModal = false }: PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return URL where the customer should be redirected after the PaymentIntent is confirmed.
                return_url: window.location.href, // Or a dedicated success page
            },
            redirect: 'if_required' // Prevent redirect if not needed (e.g. for simple card payments)
        });

        if (error) {
            setMessage(error.message || "An unexpected error occurred.");
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            // Payment succeeded
            setMessage("Payment successful!");
            setIsProcessing(false);
            onSuccess(paymentIntent.id);
        } else {
            // Unexpected state
            setIsProcessing(false);
            onSuccess();
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-white">Payment Details</h3>
                {onCancel && (
                    <button onClick={onCancel} className="text-zinc-500 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <PaymentElement />

                {message && <div className="text-red-500 text-sm mt-2">{message}</div>}

                <button
                    type="submit"
                    disabled={isProcessing || !stripe || !elements}
                    className={`mt-4 w-full h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${isProcessing || !stripe || !elements
                        ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                        : 'bg-white text-black hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] shadow-white/10'
                        }`}
                >
                    {isProcessing ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        <>
                            Pay {productPrice}
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </>
                    )}
                </button>

                <div className="flex items-center justify-center gap-2 text-zinc-500 text-xs">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    Secure encrypted payment
                </div>
            </form>
        </div>
    );
}

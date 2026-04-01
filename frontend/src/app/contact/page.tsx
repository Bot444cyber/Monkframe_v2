"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        // Simulate sending
        setTimeout(() => setStatus('sent'), 1500);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Header />
            <main className="flex-1 pt-32 pb-16 px-6">
                <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Info */}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Let's start a conversation</h1>
                        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                            Have a question about our products or need custom work? We're here to help you build something amazing.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-muted-foreground">
                                <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                <span>support@monkframe.com</span>
                            </div>
                            <div className="flex items-center gap-4 text-muted-foreground">
                                <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <span>San Francisco, CA</span>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-card border border-border rounded-3xl p-8">
                        {status === 'sent' ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4 shadow-xl">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-2">Message Sent</h3>
                                <p className="text-muted-foreground">We'll get back to you shortly.</p>
                                <button onClick={() => setStatus('idle')} className="mt-8 text-sm font-bold text-foreground hover:underline">Send another</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-muted-foreground uppercase">First Name</label>
                                        <input className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-primary outline-none transition-colors placeholder:text-muted-foreground/30" placeholder="John" required />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-muted-foreground uppercase">Last Name</label>
                                        <input className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-primary outline-none transition-colors placeholder:text-muted-foreground/30" placeholder="Doe" required />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-muted-foreground uppercase">Email Address</label>
                                    <input type="email" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-primary outline-none transition-colors placeholder:text-muted-foreground/30" placeholder="john@example.com" required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-muted-foreground uppercase">Message</label>
                                    <textarea rows={4} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-primary outline-none transition-colors resize-none placeholder:text-muted-foreground/30" placeholder="Tell us about your project..." required />
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="w-full py-3 text-sm bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

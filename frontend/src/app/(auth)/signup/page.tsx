"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [otpStep, setOtpStep] = useState(false);
    const [otp, setOtp] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGoogleLogin = () => {
        toast.loading("Redirecting to Google...", { duration: 3000 });
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1000";
        const fullUrl = apiUrl.startsWith('http') ? apiUrl : `https://${apiUrl}`;
        window.location.href = `${fullUrl}/api/auth/google`;
    };

    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading("Sending OTP...");

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1000";
            const res = await fetch(`${apiUrl}/api/auth/otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email }),
            });
            const data = await res.json();

            if (data.status) {
                setOtpStep(true);
                toast.success("OTP sent to your email!", { id: toastId });
            } else {
                toast.error(data.message || "Failed to send OTP.", { id: toastId });
            }
        } catch (err) {
            toast.error("Something went wrong. Please try again.", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const handleOtpVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading("Verifying & Creating Account...");

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1000";
            const res = await fetch(`${apiUrl}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    otp: parseInt(otp)
                }),
            });

            const data = await res.json();

            if (data.status) {
                localStorage.setItem('auth_token', data.token);
                toast.success("Welcome! Account created.", { id: toastId });
                window.location.href = '/';
            } else {
                toast.error(data.message || "Registration failed.", { id: toastId });
            }

        } catch (err) {
            toast.error("Verification failed.", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-background text-foreground selection:bg-foreground selection:text-background font-sans transition-colors duration-500">
            {/* Left Panel (Visual) - Hidden on Mobile, Fixed Full Height on Desktop */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-background/50 items-center justify-center border-r border-border overflow-hidden">
                {/* Subtle Dotted Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1]"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
                        backgroundSize: '24px 24px'
                    }}
                />

                {/* Simple Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_100%)] pointer-events-none opacity-40 dark:opacity-80" />

                <div className="relative z-10 flex flex-col items-center text-center px-12">
                    {/* Logo Container */}
                    <div className="flex items-center justify-center mb-10 animate-fade-in-up">
                        <img src="/svg/logo.svg" alt="Monkframe" className="w-24 h-24 object-contain light:invert" />
                    </div>

                    <h1 className="text-6xl font-black tracking-tighter mb-6 text-foreground animate-fade-in-up [animation-delay:100ms]">
                        Monkframe
                    </h1>

                    <p className="text-muted-foreground text-lg font-medium max-w-sm animate-fade-in-up [animation-delay:200ms] leading-relaxed">
                        The professional standard for UI management and digital asset orchestration.
                    </p>
                </div>

                {/* Bottom copyright */}
                <div className="absolute bottom-10 text-muted-foreground/30 text-[10px] font-bold tracking-[0.3em] uppercase">
                    © 2025 Monkframe Inc.
                </div>
            </div>

            {/* Right Panel (Form) */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 md:px-20 lg:px-32 bg-background relative transition-colors duration-500">
                {/* Mobile Logo */}
                <div className="lg:hidden mb-12 flex items-center gap-3">
                    <div className="flex items-center justify-center">
                        <img src="/svg/logo.svg" alt="Monkframe" className="w-10 h-10 object-contain light:invert" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-foreground">Monkframe</span>
                </div>

                <div className="w-full max-w-md mx-auto animate-fade-in">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">
                            {otpStep ? "Verify Email" : "Create Account"}
                        </h2>
                        <p className="text-muted-foreground font-medium">
                            {otpStep ? `Enter the code sent to ${formData.email}` : "Join the professional network."}
                        </p>
                    </div>

                    {!otpStep ? (
                        <>
                            <form onSubmit={handleSignupSubmit} className="space-y-6">
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] pl-1">Full Name</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within:text-foreground transition-colors duration-300">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full bg-foreground/3 border border-border focus:border-primary focus:bg-background pl-12 pr-4 py-4 rounded-2xl text-foreground text-sm placeholder:text-muted-foreground/20 outline-none transition-all duration-300"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] pl-1">Email Address</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within:text-foreground transition-colors duration-300">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                                </svg>
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full bg-foreground/3 border border-border focus:border-primary focus:bg-background pl-12 pr-4 py-4 rounded-2xl text-foreground text-sm placeholder:text-muted-foreground/20 outline-none transition-all duration-300"
                                                placeholder="name@monkframe.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] pl-1">Password</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within:text-foreground transition-colors duration-300">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full bg-foreground/3 border border-border focus:border-primary focus:bg-background pl-12 pr-4 py-4 rounded-2xl text-foreground text-sm placeholder:text-muted-foreground/20 outline-none transition-all duration-300"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input type="checkbox" className="w-4 h-4 rounded border-border bg-transparent text-primary focus:ring-offset-background focus:ring-primary" required />
                                    <p className="text-xs text-muted-foreground">I agree to the <a href="#" className="text-foreground hover:underline">Terms of Service</a>.</p>
                                </div>

                                <div className="space-y-4 pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-primary hover:opacity-90 text-primary-foreground h-14 rounded-full font-bold text-sm uppercase tracking-widest transition-all shadow-xl active:scale-[0.99] disabled:opacity-50"
                                    >
                                        {loading ? "Processing..." : "Get Started"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleGoogleLogin}
                                        className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border h-14 rounded-full font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-[0.99]"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor" />
                                        </svg>
                                        Google
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="space-y-6">
                            <form onSubmit={handleOtpVerify} className="space-y-8">
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                            className="w-full bg-foreground/3 border border-border focus:border-primary py-6 text-center text-5xl font-black tracking-[0.3em] text-foreground rounded-2xl outline-none transition-all duration-300 placeholder:text-muted-foreground/10"
                                            placeholder="000000"
                                            autoFocus
                                        />
                                        <div className="absolute inset-x-0 -bottom-px h-px bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                    </div>
                                    <p className="text-center text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em]">Secret Verification Code</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || otp.length < 6}
                                    className="w-full bg-primary hover:opacity-90 text-primary-foreground h-14 rounded-full font-bold text-sm uppercase tracking-widest transition-all shadow-xl active:scale-[0.99] disabled:opacity-50"
                                >
                                    {loading ? "Verifying..." : "Confirm & Sign Up"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setOtpStep(false)}
                                    className="w-full text-muted-foreground/40 hover:text-foreground text-xs font-bold uppercase tracking-widest transition-colors"
                                >
                                    Change Email
                                </button>
                            </form>
                        </div>
                    )}

                    <div className="mt-12 text-center">
                        <p className="text-muted-foreground/40 text-sm">
                            Already a member? {' '}
                            <Link href="/login" className="text-foreground font-bold hover:underline transition-colors border-b border-foreground/10 pb-0.5">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

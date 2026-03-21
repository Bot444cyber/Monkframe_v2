"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [flow, setFlow] = useState<'login' | 'forgot-email' | 'forgot-otp' | 'forgot-reset'>('login');
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Logging in...");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1000";
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.status) {
        localStorage.setItem('auth_token', data.token);
        toast.success("Login Successful!", { id: toastId });
        // Force full page reload to refresh app state
        window.location.href = '/';
      } else {
        const msg = data.message || "Login failed.";
        toast.error(msg, { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Sending OTP...");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1000";
      const res = await fetch(`${apiUrl}/api/auth/forgot-password/otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();

      if (data.status) {
        toast.success("OTP sent to your email!", { id: toastId });
        setFlow('forgot-otp');
      } else {
        toast.error(data.message || "Failed to send OTP.", { id: toastId });
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    const toastId = toast.loading("Resetting password...");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1000";
      const res = await fetch(`${apiUrl}/api/auth/forgot-password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: parseInt(otp),
          newPassword
        }),
      });
      const data = await res.json();

      if (data.status) {
        toast.success("Password reset successfully! Please login.", { id: toastId });
        setFlow('login');
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.message || "Failed to reset password.", { id: toastId });
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.loading("Redirecting to Google...", { duration: 3000 });
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1000";
    const fullUrl = apiUrl.startsWith('http') ? apiUrl : `https://${apiUrl}`;
    window.location.href = `${fullUrl}/api/auth/google`;
  };

  return (
    <div className="min-h-screen w-full flex bg-black text-white selection:bg-white selection:text-black font-sans">
      {/* Left Panel (Visual) - Hidden on Mobile, Fixed Full Height on Desktop */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#020202] items-center justify-center border-r border-white/5 overflow-hidden">
        {/* Subtle Dotted Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #333 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Simple Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center px-12">
          {/* Logo Container */}
          <div className="flex items-center justify-center mb-10 animate-fade-in-up">
            <img src="/svg/logo.svg" alt="Monkframe" className="w-24 h-24 object-contain" />
          </div>

          <h1 className="text-6xl font-black tracking-tighter mb-6 text-white animate-fade-in-up [animation-delay:100ms]">
            Monkframe
          </h1>

          <p className="text-zinc-500 text-lg font-medium max-w-sm animate-fade-in-up [animation-delay:200ms] leading-relaxed">
            The professional standard for UI management and digital asset orchestration.
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="absolute bottom-10 text-zinc-800 text-[10px] font-bold tracking-[0.3em] uppercase">
          © 2025 Monkframe Inc.
        </div>
      </div>

      {/* Right Panel (Form) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 md:px-20 lg:px-32 bg-black relative">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-12 flex items-center gap-3">
          <div className="flex items-center justify-center">
            <img src="/svg/logo.svg" alt="Monkframe" className="w-10 h-10 object-contain" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">Monkframe</span>
        </div>

        <div className="w-full max-w-md mx-auto animate-fade-in">
          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-3">
              {flow === 'login' && "Access Portal"}
              {flow === 'forgot-email' && "Recovery Request"}
              {flow === 'forgot-otp' && "Verify Identity"}
              {flow === 'forgot-reset' && "Secure Reset"}
            </h2>
            <p className="text-zinc-500">
              {flow === 'login' && "Secure entry for authorized personnel."}
              {flow === 'forgot-email' && "Enter your email to receive a recovery code."}
              {flow === 'forgot-otp' && `Enter the code sent to ${formData.email}`}
              {flow === 'forgot-reset' && "Create a new secure password for your account."}
            </p>
          </div>

          {flow === 'login' && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em] pl-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors duration-300">
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
                      className="w-full bg-zinc-900/40 border border-white/5 focus:border-white/20 focus:bg-zinc-900/60 pl-12 pr-4 py-4 rounded-2xl text-white text-sm placeholder-zinc-700 outline-none transition-all duration-300 shadow-inner"
                      placeholder="name@monkframe.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between px-1">
                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Password</label>
                    <button
                      type="button"
                      onClick={() => setFlow('forgot-email')}
                      className="text-[10px] font-bold text-zinc-600 hover:text-white transition-colors"
                    >
                      FORGOT PASSWORD?
                    </button>
                  </div>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors duration-300">
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
                      className="w-full bg-zinc-900/40 border border-white/5 focus:border-white/20 focus:bg-zinc-900/60 pl-12 pr-4 py-4 rounded-2xl text-white text-sm placeholder-zinc-700 outline-none transition-all duration-300 shadow-inner"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white hover:bg-zinc-200 text-black h-14 rounded-full font-bold text-sm uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.99] disabled:opacity-50"
                >
                  {loading ? "Authenticating..." : "Sign In"}
                </button>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-white h-14 rounded-full font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-[0.99]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" />
                  </svg>
                  Google
                </button>
              </div>
            </form>
          )}

          {flow === 'forgot-email' && (
            <form onSubmit={handleForgotPasswordOTP} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em] pl-1">Registered Email</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors duration-300">
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
                    className="w-full bg-zinc-900/40 border border-white/5 focus:border-white/20 focus:bg-zinc-900/60 pl-12 pr-4 py-4 rounded-2xl text-white text-sm placeholder-zinc-700 outline-none transition-all duration-300 shadow-inner"
                    placeholder="name@monkframe.com"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white hover:bg-zinc-200 text-black h-14 rounded-full font-bold text-sm uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.99] disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Continue"}
                </button>
                <button
                  type="button"
                  onClick={() => setFlow('login')}
                  className="w-full text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}

          {flow === 'forgot-otp' && (
            <form onSubmit={(e) => { e.preventDefault(); setFlow('forgot-reset'); }} className="space-y-8">
              <div className="space-y-4">
                <div className="relative group">
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-zinc-900/60 border border-white/10 focus:border-white/30 py-6 text-center text-5xl font-black tracking-[0.3em] text-white rounded-2xl outline-none transition-all duration-300 placeholder-zinc-800 shadow-2xl"
                    placeholder="000000"
                    autoFocus
                  />
                  <div className="absolute inset-x-0 -bottom-px h-px bg-linear-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
                </div>
                <p className="text-center text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Verification Code</p>
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={otp.length < 6}
                  className="w-full bg-white hover:bg-zinc-200 text-black h-14 rounded-full font-bold text-sm uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.99] disabled:opacity-50"
                >
                  Verify Code
                </button>
                <button
                  type="button"
                  onClick={() => setFlow('forgot-email')}
                  className="w-full text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Change Email
                </button>
              </div>
            </form>
          )}

          {flow === 'forgot-reset' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em] pl-1">New Password</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full bg-zinc-900/40 border border-white/5 focus:border-white/20 focus:bg-zinc-900/60 pl-12 pr-4 py-4 rounded-2xl text-white text-sm placeholder-zinc-700 outline-none transition-all duration-300 shadow-inner"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em] pl-1">Confirm New Password</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full bg-zinc-900/40 border border-white/5 focus:border-white/20 focus:bg-zinc-900/60 pl-12 pr-4 py-4 rounded-2xl text-white text-sm placeholder-zinc-700 outline-none transition-all duration-300 shadow-inner"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white hover:bg-zinc-200 text-black h-14 rounded-full font-bold text-sm uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.99] disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
                <button
                  type="button"
                  onClick={() => setFlow('forgot-otp')}
                  className="w-full text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  Back
                </button>
              </div>
            </form>
          )}

          <div className="mt-12 text-center">
            <p className="text-zinc-600 text-sm">
              Not a member? {' '}
              <Link href="/signup" className="text-white font-bold hover:underline transition-colors">
                Apply for access
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

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
            <h2 className="text-3xl font-bold tracking-tight text-white mb-3">Access Portal</h2>
            <p className="text-zinc-500">Secure entry for authorized personnel.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-6">
              <div className="group space-y-2">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest group-focus-within:text-white transition-colors">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-transparent border-b border-zinc-800 focus:border-white py-3 text-white text-lg placeholder-zinc-700 outline-none transition-all"
                  placeholder="name@monkframe.com"
                />
              </div>

              <div className="group space-y-2">
                <div className="flex justify-between">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest group-focus-within:text-white transition-colors">Password</label>
                  <a href="#" className="text-[11px] font-bold text-zinc-600 hover:text-white transition-colors">FORGOT?</a>
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-transparent border-b border-zinc-800 focus:border-white py-3 text-white text-lg placeholder-zinc-700 outline-none transition-all"
                  placeholder="••••••••"
                />
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

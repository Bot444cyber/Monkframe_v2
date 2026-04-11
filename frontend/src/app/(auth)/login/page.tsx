"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, KeyRound, Fingerprint } from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [flow, setFlow] = useState<'login' | 'forgot-email' | 'forgot-otp' | 'forgot-reset'>('login');
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Load Remembered Email
  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

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

        // Handle Remember Me
        if (rememberMe) {
          localStorage.setItem('remembered_email', formData.email);
        } else {
          localStorage.removeItem('remembered_email');
        }

        toast.success("Login Successful!", { id: toastId });
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

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return;

    setLoading(true);
    const toastId = toast.loading("Verifying code...");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1000";
      const res = await fetch(`${apiUrl}/api/auth/forgot-password/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: parseInt(otp),
        }),
      });
      const data = await res.json();

      if (data.status) {
        toast.success("Identity verified!", { id: toastId });
        setFlow('forgot-reset');
      } else {
        toast.error(data.message || "Invalid OTP.", { id: toastId });
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
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center py-20 px-4 sm:px-6 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,white_100%)] pointer-events-none opacity-80" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -z-10 mix-blend-multiply transition-all duration-1000 hover:scale-110" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-3xl -z-10 mix-blend-multiply transition-all duration-1000 hover:scale-110" />

        <div className="w-full max-w-[420px] mx-auto z-10 transition-all duration-500 ease-in-out transform">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2.5 mb-5 group cursor-default">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center p-1.5 shadow-sm ring-1 ring-blue-100/50">
                <img src="/logo/M_SHAPE.svg" alt="Logo" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="font-black tracking-widest text-xl text-[#1200FF]">MOCKUPIDEA</span>
            </div>

            <h2 className="text-[32px] font-bold tracking-tight text-gray-900 mb-2">
              {flow === 'login' && "Welcome Back"}
              {flow === 'forgot-email' && "Recovery Request"}
              {flow === 'forgot-otp' && "Verify Identity"}
              {flow === 'forgot-reset' && "Secure Reset"}
            </h2>
            <p className="text-gray-500 font-medium text-[15px]">
              {flow === 'login' && "Sign in to access your premium mockups."}
              {flow === 'forgot-email' && "Enter your email to receive a recovery code."}
              {flow === 'forgot-otp' && `Enter the 6-digit code sent to ${formData.email}`}
              {flow === 'forgot-reset' && "Create a new secure password for your account."}
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-10 shadow-[0_15px_40px_rgba(18,0,255,0.06)] border border-gray-100/80 w-full">
            {flow === 'login' && (
              <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-5">
                  <div className="space-y-1.5 group">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1200FF] transition-colors duration-300">
                        <Mail className="w-5 h-5" strokeWidth={2} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-gray-50/80 border border-gray-200/80 focus:border-[#1200FF]/50 focus:bg-white focus:ring-[4px] focus:ring-[#1200FF]/10 pl-12 pr-4 py-3.5 rounded-2xl text-gray-900 text-[15px] font-medium placeholder:text-gray-400 outline-none transition-all duration-300"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 group">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Password</label>
                      <button
                        type="button"
                        onClick={() => setFlow('forgot-email')}
                        className="text-[11px] font-bold text-[#1200FF] hover:text-blue-800 transition-colors tracking-wide"
                      >
                        FORGOT?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1200FF] transition-colors duration-300">
                        <Lock className="w-5 h-5" strokeWidth={2} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-gray-50/80 border border-gray-200/80 focus:border-[#1200FF]/50 focus:bg-white focus:ring-[4px] focus:ring-[#1200FF]/10 pl-12 pr-12 py-3.5 rounded-2xl text-gray-900 text-[15px] font-medium placeholder:text-gray-400 outline-none transition-all duration-300"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={2.5} /> : <Eye className="w-4 h-4" strokeWidth={2.5} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-start px-1 mt-4">
                  <label className="flex items-center gap-2.5 cursor-pointer group hover:opacity-80 transition-opacity">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="w-[18px] h-[18px] border-2 border-gray-300 rounded-[5px] peer-checked:bg-[#1200FF] peer-checked:border-[#1200FF] transition-all duration-200 shadow-sm" />
                      <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[13px] font-semibold text-gray-600 transition-colors select-none pt-0.5">Remember Me</span>
                  </label>
                </div>

                <div className="space-y-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full group bg-[#1200FF] hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-[15px] transition-all disabled:opacity-70 shadow-md shadow-[#1200FF]/25 active:scale-[0.98] flex items-center justify-center relative overflow-hidden"
                  >
                    <span className="flex items-center gap-2 relative z-10 transition-transform group-hover:gap-3">
                      {loading ? "Authenticating..." : "Sign In"}
                      {!loading && <ArrowRight className="w-4 h-4" />}
                    </span>
                  </button>

                  <div className="relative flex items-center justify-center my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative bg-white px-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      Or continue with
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 py-3.5 rounded-xl font-bold text-[15px] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                  </button>
                </div>
              </form>
            )}

            {flow === 'forgot-email' && (
              <form onSubmit={handleForgotPasswordOTP} className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                <div className="w-14 h-14 bg-blue-50/80 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100">
                  <ShieldCheck className="w-7 h-7 text-[#1200FF]" />
                </div>
                <div className="space-y-1.5 group">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Registered Email</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1200FF] transition-colors">
                      <Mail className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-50/80 border border-gray-200/80 focus:border-[#1200FF]/50 focus:bg-white focus:ring-[4px] focus:ring-[#1200FF]/10 pl-12 pr-4 py-3.5 rounded-2xl text-gray-900 text-[15px] font-medium placeholder:text-gray-400 outline-none transition-all duration-300"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1200FF] hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-[15px] transition-all disabled:opacity-70 shadow-md shadow-[#1200FF]/25 active:scale-[0.98]"
                  >
                    {loading ? "Processing..." : "Continue"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlow('login')}
                    className="w-full text-gray-400 hover:text-gray-900 text-[13px] font-bold uppercase tracking-wide transition-colors mt-2"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            )}

            {flow === 'forgot-otp' && (
              <form onSubmit={handleVerifyOTP} className="space-y-8 animate-in slide-in-from-right-8 duration-300">
                <div className="w-14 h-14 bg-blue-50/80 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-sm border border-blue-100">
                  <KeyRound className="w-7 h-7 text-[#1200FF]" />
                </div>
                <div className="space-y-4">
                  <div className="relative group mx-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-gray-50/80 border border-gray-200/80 focus:border-[#1200FF]/50 focus:bg-white focus:ring-[4px] focus:ring-[#1200FF]/10 py-5 text-center text-[36px] font-black tracking-[0.3em] text-gray-900 rounded-2xl outline-none transition-all duration-300 placeholder:text-gray-300"
                      placeholder="000000"
                      autoFocus
                    />
                  </div>
                  <p className="text-center text-gray-400 text-[11px] font-bold uppercase tracking-widest">Verification Code</p>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    disabled={otp.length < 6 || loading}
                    className="w-full bg-[#1200FF] hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-[15px] transition-all disabled:opacity-70 shadow-md shadow-[#1200FF]/25 active:scale-[0.98]"
                  >
                    {loading ? "Verifying..." : "Verify Code"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlow('forgot-email')}
                    className="w-full text-gray-400 hover:text-gray-900 text-[13px] font-bold uppercase tracking-wide transition-colors mt-2"
                  >
                    Change Email
                  </button>
                </div>
              </form>
            )}

            {flow === 'forgot-reset' && (
              <form onSubmit={handleResetPassword} className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                <div className="w-14 h-14 bg-blue-50/80 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-blue-100">
                  <Fingerprint className="w-7 h-7 text-[#1200FF]" />
                </div>
                <div className="space-y-5">
                  <div className="space-y-1.5 group">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">New Password</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1200FF] transition-colors">
                        <Lock className="w-5 h-5" strokeWidth={2} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full bg-gray-50/80 border border-gray-200/80 focus:border-[#1200FF]/50 focus:bg-white focus:ring-[4px] focus:ring-[#1200FF]/10 pl-12 pr-12 py-3.5 rounded-2xl text-gray-900 text-[15px] font-medium outline-none transition-all duration-300"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={2.5} /> : <Eye className="w-4 h-4" strokeWidth={2.5} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5 group">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Confirm New Password</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1200FF] transition-colors">
                        <Lock className="w-5 h-5" strokeWidth={2} />
                      </div>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full bg-gray-50/80 border border-gray-200/80 focus:border-[#1200FF]/50 focus:bg-white focus:ring-[4px] focus:ring-[#1200FF]/10 pl-12 pr-4 py-3.5 rounded-2xl text-gray-900 text-[15px] font-medium outline-none transition-all duration-300"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1200FF] hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-[15px] transition-all disabled:opacity-70 shadow-md shadow-[#1200FF]/25 active:scale-[0.98]"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlow('forgot-otp')}
                    className="w-full text-gray-400 hover:text-gray-900 text-[13px] font-bold uppercase tracking-wide transition-colors mt-2"
                  >
                    Back
                  </button>
                </div>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-500 text-[14.5px] font-medium">
                Not a member? {' '}
                <Link href="/signup" className="text-[#1200FF] font-bold hover:text-blue-800 transition-colors">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

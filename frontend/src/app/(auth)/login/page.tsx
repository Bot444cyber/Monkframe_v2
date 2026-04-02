"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center py-24 px-6 relative overflow-hidden">
        {/* Subtle Background Pattern matching home page aesthetic */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,white_100%)] pointer-events-none opacity-80" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -z-10 mix-blend-multiply" />
        <div className="absolute bottom-1/4 right-1/4 w-md h-112 bg-indigo-50/50 rounded-full blur-3xl -z-10 mix-blend-multiply" />


        <div className="w-full max-w-md mx-auto z-10 animate-fade-in-up">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
              {flow === 'login' && "Welcome Back"}
              {flow === 'forgot-email' && "Recovery Request"}
              {flow === 'forgot-otp' && "Verify Identity"}
              {flow === 'forgot-reset' && "Secure Reset"}
            </h2>
            <p className="text-gray-500 font-medium text-[15px]">
              {flow === 'login' && "Sign in to access your premium mockups."}
              {flow === 'forgot-email' && "Enter your email to receive a recovery code."}
              {flow === 'forgot-otp' && `Enter the code sent to ${formData.email}`}
              {flow === 'forgot-reset' && "Create a new secure password for your account."}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            {flow === 'login' && (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-5">
                  <div className="space-y-2 relative group">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300">
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
                        className="w-full bg-gray-50/50 border border-gray-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 pl-12 pr-4 py-3.5 rounded-2xl text-gray-900 text-[15px] placeholder:text-gray-400 outline-none transition-all duration-300"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 relative group">
                    <div className="flex justify-between items-center px-1 mb-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
                      <button
                        type="button"
                        onClick={() => setFlow('forgot-email')}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        FORGOT?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300">
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
                        className="w-full bg-gray-50/50 border border-gray-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 pl-12 pr-4 py-3.5 rounded-2xl text-gray-900 text-[15px] placeholder:text-gray-400 outline-none transition-all duration-300"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-[15px] transition-all disabled:opacity-50 shadow-sm shadow-blue-600/20"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Authenticating...
                      </span>
                    ) : "Sign In"}
                  </button>

                  <div className="relative flex items-center justify-center my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative bg-white px-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      Or continue with
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 py-3.5 rounded-xl font-bold text-[15px] transition-all flex items-center justify-center gap-3"
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
              <form onSubmit={handleForgotPasswordOTP} className="space-y-6">
                <div className="space-y-2 relative group">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Registered Email</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300">
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
                      className="w-full bg-gray-50/50 border border-gray-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 pl-12 pr-4 py-3.5 rounded-2xl text-gray-900 text-[15px] placeholder:text-gray-400 outline-none transition-all duration-300"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-[15px] transition-all disabled:opacity-50 shadow-sm shadow-blue-600/20"
                  >
                    {loading ? "Processing..." : "Continue"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlow('login')}
                    className="w-full text-gray-500 hover:text-gray-900 text-sm font-semibold transition-colors mt-2"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            )}

            {flow === 'forgot-otp' && (
              <form onSubmit={handleVerifyOTP} className="space-y-8">
                <div className="space-y-4">
                  <div className="relative group mx-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-gray-50/50 border border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 py-6 text-center text-[40px] font-black tracking-[0.2em] text-gray-900 rounded-3xl outline-none transition-all duration-300 placeholder:text-gray-300"
                      placeholder="000000"
                      autoFocus
                    />
                  </div>
                  <p className="text-center text-gray-500 text-xs font-bold uppercase tracking-widest">Verification Code</p>
                </div>

                <div className="space-y-4 pt-2">
                  <button
                    type="submit"
                    disabled={otp.length < 6 || loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-[15px] transition-all disabled:opacity-50 shadow-sm shadow-blue-600/20"
                  >
                    {loading ? "Verifying..." : "Verify Code"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlow('forgot-email')}
                    className="w-full text-gray-500 hover:text-gray-900 text-sm font-semibold transition-colors"
                  >
                    Change Email
                  </button>
                </div>
              </form>
            )}

            {flow === 'forgot-reset' && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-5">
                  <div className="space-y-2 relative group">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">New Password</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                      </div>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full bg-gray-50/50 border border-gray-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 pl-12 pr-4 py-3.5 rounded-2xl text-gray-900 text-[15px] placeholder:text-gray-400 outline-none transition-all duration-300"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 relative group">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Confirm New Password</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full bg-gray-50/50 border border-gray-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 pl-12 pr-4 py-3.5 rounded-2xl text-gray-900 text-[15px] placeholder:text-gray-400 outline-none transition-all duration-300"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-[15px] transition-all disabled:opacity-50 shadow-sm shadow-blue-600/20"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlow('forgot-otp')}
                    className="w-full text-gray-500 hover:text-gray-900 text-sm font-semibold transition-colors"
                  >
                    Back
                  </button>
                </div>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-500 text-[15px]">
                Not a member? {' '}
                <Link href="/signup" className="text-blue-600 font-bold hover:underline transition-colors">
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

"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import NotificationBell from './NotificationBell';
import { ICONS } from '../page/home/ts/constants';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

export default function Header({ searchQuery, onSearchChange, onSearchClick }: any) {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    // Assuming role is accessible on user object. Adjust if role is nested or named differently.
    const canAccessDashboard = ['ADMIN', 'EDITOR'].includes(String(user?.role).toUpperCase());

    const [isScrolled, setIsScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none">
                <header
                    className={`pointer-events-auto flex items-center justify-between px-6 transition-all duration-500 ease-out
                    ${isScrolled
                            ? 'mt-5 w-[90%] md:w-[78%] lg:w-[70%] h-14 rounded-2xl bg-background/95 backdrop-blur-xl border border-border shadow-[0_8px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.9)]'
                            : 'mt-0 w-full h-20 bg-transparent border border-transparent'}`}
                >
                    {/* Logo Section */}
                    <div className="flex items-center gap-3 shrink-0">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <img src="/svg/logo.svg" alt="Monkframe Logo" className="w-full h-full object-contain invert dark:invert-0 transition-all" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-foreground hidden sm:block">Monkframe</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation - Centered */}
                    <nav className="hidden lg:flex items-center gap-1 bg-transparent p-1 rounded-full">
                        {['Explore', 'Licenses', 'FAQ', 'Contact'].map((item) => {
                            const href = item === 'Explore' ? '/' : `/${item.toLowerCase()}`;
                            const isActive = pathname === href;

                            return (
                                <Link
                                    key={item}
                                    href={href}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                                    ${isActive
                                            ? 'text-foreground bg-foreground/5 border border-border'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'}`}
                                >
                                    <span className="relative z-10">{item}</span>
                                    {isActive && (
                                        <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-150%] animate-[shimmer_2s_infinite]" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Actions Section */}
                    <div className="flex items-center gap-3">
                        {/* Expandable Search Bar */}


                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Notifications */}
                        {user && <NotificationBell />}

                        {/* User Profile Dropdown */}
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl border border-border bg-card/50 hover:bg-accent hover:border-border/50 transition-all"
                                >
                                    <div className="w-7 h-7 rounded-lg bg-primary/10 border border-border flex items-center justify-center text-[10px] font-bold text-primary">
                                        {user.full_name ? user.full_name.charAt(0) : user.email?.charAt(0) || "U"}
                                    </div>
                                    <span className="text-sm font-medium text-foreground hidden sm:block">Account</span>
                                    <svg className={`w-3 h-3 text-muted-foreground transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-3 w-52 bg-card border border-border rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.95)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                        <div className="p-4 border-b border-border bg-foreground/2">
                                            <p className="text-xs font-bold text-foreground">{user.full_name || "User"}</p>
                                            <p className="text-[10px] text-muted-foreground mt-0.5">{user.email}</p>
                                        </div>
                                        <div className="p-1.5">
                                            {[
                                                { label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', href: '/profile' },
                                                ...(canAccessDashboard ? [{ label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', href: '/dashboard' }] : [])
                                            ].map((item) => (
                                                <Link key={item.label} href={item.href} className="flex items-center gap-3 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-all">
                                                    <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                                                    </svg>
                                                    {item.label}
                                                </Link>
                                            ))}
                                            <div className="h-px bg-border my-1.5" />
                                            <button
                                                onClick={() => logout()}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-xs text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Log in</Link>
                                <Link href="/signup" className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:scale-105">
                                    Sign up
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 lg:hidden text-muted-foreground hover:text-foreground"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </header>
            </div>

            {/* Premium Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-[90] lg:hidden transition-all duration-500 ${isMobileMenuOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'}`}>
                <div
                    className={`absolute inset-0 bg-background/80 backdrop-blur-2xl transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
                <div className={`absolute top-0 right-0 h-full w-[80%] max-w-sm bg-background border-l border-border flex flex-col p-8 transition-transform duration-500 ease-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="mt-20 space-y-6">
                        {['Explore', 'Licenses', 'FAQ', 'Contact'].map((item, i) => (
                            <Link
                                key={item}
                                href={item === 'Explore' ? '/' : `/${item.toLowerCase()}`}
                                className={`block text-2xl font-bold text-foreground hover:text-primary transition-colors transform ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                                style={{ transitionDelay: `${i * 100}ms` }}
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                    {user ? (
                        <div className="mt-auto pb-10 space-y-4">
                            <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-secondary border border-border">
                                <div className="h-10 w-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-sm font-bold text-foreground">
                                    {user.full_name ? user.full_name.charAt(0) : user.email?.charAt(0) || "U"}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground">{user.full_name}</p>
                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                            </div>
                            {canAccessDashboard && (
                                <Link
                                    href="/dashboard"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block w-full text-center py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all border border-indigo-500/20 shadow-lg shadow-indigo-600/20"
                                >
                                    Go to Dashboard
                                </Link>
                            )}
                            <button onClick={() => logout()} className="w-full py-4 rounded-2xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500/20 transition-all border border-red-500/20">Sign Out</button>
                        </div>
                    ) : (
                        <div className="mt-auto pb-10 space-y-4">
                            <Link href="/signup" className="block w-full text-center py-4 rounded-2xl bg-foreground text-background font-bold">Get Started</Link>
                            <Link href="/login" className="block w-full text-center py-4 rounded-2xl bg-secondary border border-border text-foreground font-bold">Sign In</Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}





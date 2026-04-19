"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import NotificationBell from './NotificationBell';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DropdownMenu = ({ items }: { items: { label: string; href: string }[] }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="absolute top-full mt-2 left-0 w-48 bg-white border border-gray-100 shadow-xl rounded-lg py-2 z-50 normal-case tracking-normal"
    >
        {items.map((item, i) => (
            <Link
                key={i}
                href={item.href}
                className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
                {item.label}
            </Link>
        ))}
    </motion.div>
);

export default function Header() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const canAccessDashboard = ['ADMIN', 'EDITOR'].includes(String(user?.role).toUpperCase()) || (String(user?.role).toUpperCase() === 'DEVELOPER' && user?.dashboard_access);

    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const navItems = [
        { label: "Explore", href: "/" },
        { label: "Licenses", href: "/licenses" },
        { label: "Faq", href: "/faq" },
        { label: "Contact", href: "/contact" }
    ];

    return (
        <>
            <header className="border-b border-gray-100 sticky top-0 bg-white/70 backdrop-blur-sm z-50 overflow-visible">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center relative">
                            <Image src="/logo/M_SHAPE.svg" alt="MOCKUPIDEA Logo" fill className="object-contain" />
                        </div>
                        <span className="font-bold tracking-wider text-[15px] text-gray-900">MOCKUPIDEA</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-gray-600 uppercase tracking-wide">
                            {navItems.map((item) => (
                                <div key={item.label} className="relative group">
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-1 transition-colors py-4 ${pathname === item.href ? 'text-blue-600' : 'hover:text-blue-600'}`}
                                    >
                                        {item.label}
                                    </Link>
                                </div>
                            ))}
                        </nav>

                        <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            {user && <NotificationBell />}

                            {user ? (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold text-sm hover:bg-blue-100 transition-colors"
                                    >
                                        {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || "U"}
                                    </button>

                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute right-0 mt-3 w-52 bg-white border border-gray-100 shadow-xl rounded-lg py-2 z-50"
                                            >
                                                <div className="px-4 py-2 border-b border-gray-100 mb-2">
                                                    <p className="text-sm font-bold text-gray-900 truncate">{user.full_name || "User"}</p>
                                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                </div>
                                                <Link href="/profile" className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600" onClick={() => setIsDropdownOpen(false)}>
                                                    Profile
                                                </Link>
                                                {canAccessDashboard && (
                                                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600" onClick={() => setIsDropdownOpen(false)}>
                                                        Dashboard
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={() => { logout(); setIsDropdownOpen(false); }}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    Logout
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="hidden sm:flex flex-row items-center gap-3">
                                    <Link href="/login" className="text-[13px] font-bold text-gray-600 hover:text-blue-600 uppercase tracking-wide">
                                        Login
                                    </Link>
                                    <Link href="/signup" className="text-[13px] font-bold bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors uppercase tracking-wide">
                                        Sign up
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Toggle */}
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-gray-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>



            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden border-b border-gray-100 bg-white overflow-hidden absolute w-full top-16 left-0 z-40"
                    >
                        <div className="px-4 py-4 space-y-4">
                            {navItems.map((item) => (
                                <Link key={item.label} href={item.href} className="block text-sm font-bold text-gray-800 uppercase tracking-wide" onClick={() => setIsMobileMenuOpen(false)}>
                                    {item.label}
                                </Link>
                            ))}
                            {!user && (
                                <div className="pt-4 border-t border-gray-100 space-y-3">
                                    <Link href="/login" className="block text-sm font-bold text-gray-600 uppercase" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                                    <Link href="/signup" className="block text-sm font-bold text-blue-600 uppercase" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

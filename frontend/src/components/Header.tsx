"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import NotificationBell from './NotificationBell';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, Instagram, Facebook, Twitter, Box, Shirt, Smartphone, Coffee, Plus, Monitor, Book, ShoppingBag } from 'lucide-react';
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
    const router = useRouter();
    const canAccessDashboard = ['ADMIN', 'EDITOR'].includes(String(user?.role).toUpperCase());

    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const categories = [
        { icon: <Box className="w-8 h-8" />, label: "Free Mockups" },
        { icon: <Shirt className="w-8 h-8" />, label: "Tshirts" },
        { icon: <Smartphone className="w-8 h-8" />, label: "Devices" },
        { icon: <Coffee className="w-8 h-8" />, label: "Mugs" },
        { icon: <Monitor className="w-8 h-8" />, label: "Hats" },
        { icon: <Book className="w-8 h-8" />, label: "Books" },
        { icon: <ShoppingBag className="w-8 h-8" />, label: "Bags" },
        { icon: <Plus className="w-8 h-8" />, label: "And More" },
    ];

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
            <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50 overflow-visible">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center overflow-hidden">
                            <span className="text-white font-bold text-xl">M</span>
                        </div>
                        <span className="font-bold tracking-wider text-sm text-gray-900">MONKFRAME</span>
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

            {/* Categories Section */}
            <section className="border-b border-gray-100 py-8 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-8 z-10 relative">
                    <div className="text-center lg:text-left">
                        <h2 className="text-2xl font-bold leading-tight text-gray-900">
                            23,000+<br />
                            <span className="text-gray-500 font-medium text-lg">Instant<br />Mockups</span>
                        </h2>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                        {categories.map((cat, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.15, y: -8, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    const path = cat.label === 'And More' ? '/' : `/?category=${encodeURIComponent(cat.label)}`;
                                    router.push(path);
                                }}
                                className="flex flex-col items-center gap-3 cursor-pointer group"
                            >
                                <motion.div
                                    className="text-purple-400 group-hover:text-purple-600 transition-colors"
                                    animate={{ rotate: [0, -5, 5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    {cat.icon}
                                </motion.div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-purple-600">
                                    {cat.label}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <span className="font-black text-2xl italic tracking-tighter text-gray-800">Placeit</span>
                            <span className="text-[9px] font-bold text-green-500 uppercase mt-1">by envato</span>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-8 py-2.5 rounded-md font-bold text-sm transition-all shadow-sm"
                        >
                            Create Now
                        </motion.button>
                    </div>
                </div>
            </section>

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

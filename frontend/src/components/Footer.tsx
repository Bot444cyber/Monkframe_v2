"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

// ── Custom Brand Icons (High-Fidelity SVGs for premium look) ────────────────
const SocialIcons = {
  Instagram: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
  ),
  Binance: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M16.624 13.9202l2.7175 2.7154-7.3418 7.3418-7.3418-7.3418 2.7175-2.7154L11.9997 19.3444l4.6243-4.4242zm2.7175-3.8404l2.7175 2.7175-2.7175 2.7175-2.7175-2.7175 2.7175-2.7175zm-14.6836 0l2.7175 2.7175-2.7175 2.7175-2.7175-2.7175 2.7175-2.7175zm7.3418-10.0573l7.3418 7.3418-2.7175 2.7154L11.9997 5.6554 7.3754 10.0798l-2.7175-2.7154 7.3418-7.3418zm0 9.6239l2.4334 2.4334-2.4334 2.4334-2.4334-2.4334 2.4334-2.4334z" /></svg>
  ),
  Dribbble: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10" /><path d="M8.56 2.74c4.37 2.62 6.12 7.35 7.06 12.04" /><path d="M2 12c5.44.2 11.35-1 17.08-5.14" /><path d="M11 20c4.9-3.1 4.9-9.1 4.9-9.1" /></svg>
  ),
  Pinterest: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.261 7.929-7.261 4.162 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" /></svg>
  )
};

const SOCIAL_LINKS = [
  { name: 'Instagram', href: '#', icon: SocialIcons.Instagram },
  { name: 'Binance', href: '#', icon: SocialIcons.Binance },
  { name: 'Dribbble', href: '#', icon: SocialIcons.Dribbble },
  { name: 'Pinterest', href: '#', icon: SocialIcons.Pinterest },
];

export default function Footer() {
  const { user } = useAuth();
  const canAccessDashboard = ['ADMIN', 'EDITOR'].includes(String(user?.role).toUpperCase()) || (String(user?.role).toUpperCase() === 'DEVELOPER' && user?.dashboard_access);

  return (
    <footer className="mt-20 border-t border-gray-100 bg-white pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-8 group cursor-default">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center p-0.5 relative">
                <Image src="/logo/M_SHAPE.svg" alt="Logo" fill className="object-contain group-hover:rotate-12 transition-transform duration-500" />
              </div>
              <span className="font-extrabold tracking-widest text-lg text-blue-600">MOCKUPIDEA</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed font-medium mb-8 max-w-[240px]">
              Crafting premium digital experiences through high-fidelity assets and thoughtful design.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="p-2.5 bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-300 group shadow-sm ring-1 ring-gray-100 border-0"
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Browse */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-8 py-1">Categories</h4>
            <ul className="space-y-4">
              <li><Link href="/?category=Flyer" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">Flyer Design</Link></li>
              <li><Link href="/?category=Brochure" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">Brochure Pack</Link></li>
              <li><Link href="/?category=Business Card" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">Business Cards</Link></li>
              <li><Link href="/?category=Outdoor" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">Outdoor Media</Link></li>
              <li><Link href="/?category=Packaging" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">Packaging Sets</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="md:pl-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-8 py-1">Essentials</h4>
            <ul className="space-y-4">
              <li><Link href="/licenses" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">Licensing Info</Link></li>
              <li><Link href="/contact" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">Contact Support</Link></li>
              <li><Link href="/faq" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">Common FAQ</Link></li>
            </ul>
          </div>

          {/* Column 4: Platform */}
          <div className="md:pl-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-8 py-1">My Account</h4>
            <ul className="space-y-4">
              <li><Link href="/profile" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">Your Profile</Link></li>
              {canAccessDashboard && (
                <li><Link href="/dashboard" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">Admin Portal</Link></li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-[11px] font-black uppercase tracking-widest text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full ring-1 ring-gray-100">
            © 2026 MOCKUPIDEA. All rights reserved
          </p>
          <div className="flex gap-8">
            <a href="#" className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-all group">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
              Platform Status
            </a>
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-500">
              Made with Precision
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}


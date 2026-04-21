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
  Facebook: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" /></svg>
  ),
  Behance: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.665 1.45.665 2.36 0 .75-.13 1.39-.41 1.93-.28.55-.67 1-1.16 1.35-.48.348-1.05.6-1.69.75-.64.15-1.31.22-2.01.22H0V4.51h6.938v-.008zm-.34 4.888c.586 0 1.065-.13 1.434-.397.37-.263.55-.68.55-1.24 0-.3-.06-.56-.17-.77-.11-.22-.27-.39-.47-.522-.2-.13-.44-.22-.7-.268-.26-.05-.54-.07-.84-.07H2.92v3.267h3.678zm.19 5.087c.32 0 .618-.034.898-.1.28-.067.52-.18.72-.33.2-.15.36-.35.47-.6.12-.25.17-.56.17-.93 0-.74-.207-1.27-.617-1.6-.41-.33-.95-.49-1.62-.49H2.92v4.05h3.868zm9.255-1.073c.27.67.74 1 1.56 1 .48 0 .89-.12 1.24-.38.34-.256.55-.53.62-.82h2.42c-.38 1.2-1.01 2.06-1.88 2.58-.87.52-1.93.78-3.17.78-.86 0-1.64-.14-2.33-.42-.7-.28-1.29-.67-1.79-1.17-.49-.5-.87-1.1-1.13-1.8-.26-.7-.39-1.47-.39-2.31 0-.82.13-1.58.4-2.28.27-.7.65-1.31 1.14-1.82.49-.51 1.07-.91 1.77-1.19.7-.28 1.45-.43 2.27-.43.93 0 1.74.18 2.44.56.7.37 1.27.88 1.72 1.51.45.63.77 1.35.97 2.15.2.8.28 1.64.24 2.52h-7.26c0 .7.18 1.37.45 2.02zm2.8-4.99c-.22-.63-.66-.94-1.35-.94-.39 0-.72.07-.97.2-.26.13-.46.3-.62.5-.16.2-.27.41-.33.64-.07.23-.1.45-.11.66h4.01c-.08-.74-.38-1.37-.62-2.01zm-3.88-5.68h5.04v1.28h-5.04V3.63z" /></svg>
  ),
  Dribbble: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10" /><path d="M8.56 2.74c4.37 2.62 6.12 7.35 7.06 12.04" /><path d="M2 12c5.44.2 11.35-1 17.08-5.14" /><path d="M11 20c4.9-3.1 4.9-9.1 4.9-9.1" /></svg>
  ),
  Pinterest: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.261 7.929-7.261 4.162 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" /></svg>
  )
};

const SOCIAL_LINKS = [
  { name: 'Instagram', href: 'https://www.instagram.com/mockupidea/', icon: SocialIcons.Instagram },
  { name: 'Pinterest', href: 'https://www.pinterest.com/mockupidea1/', icon: SocialIcons.Pinterest },
  { name: 'Behance', href: 'https://www.behance.net/mockupidea', icon: SocialIcons.Behance },
  { name: 'Dribbble', href: 'https://dribbble.com/mockupidea1', icon: SocialIcons.Dribbble },
  { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61573660727141', icon: SocialIcons.Facebook },
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
              <li><Link href="/blog" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">Our Blog</Link></li>
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


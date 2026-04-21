"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

// ── Custom Brand Icons (High-Fidelity SVGs for premium look) ────────────────
const SocialIcons = {
  Instagram: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 md:w-5 md:h-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
  ),
  Facebook: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 md:w-5 md:h-5"><path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" /></svg>
  ),
  Behance: () => (
    <div className="relative w-4 h-4 md:w-5 md:h-5">
      <Image src="/logo/behance-svgrepo-com.svg" alt="Behance" fill className="object-contain filter group-hover:brightness-0 group-hover:invert transition-all duration-300" />
    </div>
  ),
  Dribbble: () => (
    <div className="relative w-4 h-4 md:w-5 md:h-5">
      <Image src="/logo/dribbble-svgrepo-com.svg" alt="Dribbble" fill className="object-contain filter group-hover:brightness-0 group-hover:invert transition-all duration-300" />
    </div>
  ),
  Pinterest: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 md:w-5 md:h-5"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.261 7.929-7.261 4.162 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" /></svg>
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
    <footer className="relative mt-32 bg-white border-t border-gray-100 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-8 gap-y-16 mb-20">

          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4">
            <div className="flex items-center gap-3 mb-8 group cursor-default">
              <div className="relative w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:shadow-blue-500/20 group-hover:border-blue-100">
                <Image src="/logo/M_SHAPE.svg" alt="Logo" fill className="object-contain p-2 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <span className="font-extrabold tracking-widest text-xl text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                MOCKUPIDEA
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed font-medium mb-10 max-w-[280px]">
              Crafting premium digital experiences through high-fidelity assets and thoughtful, forward-thinking design.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="relative flex items-center justify-center p-3 sm:p-3.5 bg-white text-gray-400 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-600/20 hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden md:block md:col-span-1" />

          {/* Links Columns Container */}
          <div className="col-span-2 md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Column 1: Browse */}
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8 pb-3 border-b border-gray-200/50 inline-block">Categories</h4>
              <ul className="space-y-4">
                {[
                  { name: 'Flyer Design', link: '/?category=Flyer' },
                  { name: 'Brochure Pack', link: '/?category=Brochure' },
                  { name: 'Business Cards', link: '/?category=Business Card' },
                  { name: 'Outdoor Media', link: '/?category=Outdoor' },
                  { name: 'Packaging Sets', link: '/?category=Packaging' },
                ].map(item => (
                  <li key={item.name}>
                    <Link href={item.link} className="group flex items-center text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors duration-300 w-fit">
                      <span className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-blue-600 mr-2 text-[10px]">▶</span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Essentials */}
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8 pb-3 border-b border-gray-200/50 inline-block">Essentials</h4>
              <ul className="space-y-4">
                {[
                  { name: 'Our Blog', link: '/blog' },
                  { name: 'Licensing Info', link: '/licenses' },
                  { name: 'Contact Support', link: '/contact' },
                  { name: 'Common FAQ', link: '/faq' },
                ].map(item => (
                  <li key={item.name}>
                    <Link href={item.link} className="group flex items-center text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors duration-300 w-fit">
                      <span className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-blue-600 mr-2 text-[10px]">▶</span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Platform */}
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8 pb-3 border-b border-gray-200/50 inline-block">My Account</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/profile" className="group flex items-center text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors duration-300 w-fit">
                    <span className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-blue-600 mr-2 text-[10px]">▶</span>
                    Your Profile
                  </Link>
                </li>
                {canAccessDashboard && (
                  <li>
                    <Link href="/dashboard" className="group flex items-center text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors duration-300 w-fit">
                      <span className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-blue-600 mr-2 text-[10px]">▶</span>
                      Admin Portal
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 w-full flex flex-col md:flex-row justify-between items-center gap-6 relative">
          {/* Subtle top border that fades out at edges */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-gray-200 to-transparent" />

          <p className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
            © {new Date().getFullYear()} <span className="text-gray-900 font-black tracking-widest">MOCKUPIDEA</span>
            <span className="hidden sm:inline text-gray-300 mx-2">|</span>
            <span className="hidden sm:inline">All rights reserved</span>
          </p>

          <div className="flex items-center gap-8">
            <a href="#" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-all group">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 group-hover:bg-emerald-400 transition-colors"></span>
              </span>
              Platform Status
            </a>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
              Made with <span className="text-blue-600">Precision</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}



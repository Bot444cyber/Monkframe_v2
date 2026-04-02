"use client";
import React from 'react';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-32 pb-16 bg-white border-t border-gray-100 pt-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Social Icons */}
        <div className="flex justify-center items-center gap-6 mb-8">
          <a href="#" className="flex justify-center items-center text-gray-900 hover:text-blue-600 transition-colors font-bold text-lg">Bē</a>
          <a href="#" className="flex justify-center items-center text-gray-900 hover:text-blue-600 transition-colors">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="#" className="flex justify-center items-center text-gray-900 hover:text-blue-600 transition-colors">
            <Facebook className="w-5 h-5" />
          </a>
          <a href="#" className="flex justify-center items-center text-gray-900 hover:text-blue-600 transition-colors">
            <Twitter className="w-5 h-5" />
          </a>
        </div>

        <div className="border-t border-gray-100 mb-12"></div>

        {/* Partner Banner - Matching UI exactly, but genericized or strictly as requested */}
        <div className="flex justify-center mb-12">
          <div className="w-full max-w-3xl bg-[#1A45C1] rounded-lg p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            {/* Abstract decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 border-2 border-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 right-1/4 w-24 h-24 border border-white/5 rounded-full mb-4"></div>

            <div className="flex items-baseline gap-1 text-white">
              <span className="text-4xl font-black tracking-tighter">LH</span>
              <span className="text-xl font-bold opacity-80">.PL</span>
            </div>

            <div className="h-16 w-px bg-white/20 hidden md:block"></div>

            <div className="text-white text-center md:text-left z-10 relative">
              <h4 className="text-lg font-black uppercase tracking-wider mb-1">OUR PARTNER</h4>
              <p className="text-sm font-medium opacity-90 leading-relaxed max-w-md">
                All premium assets that are on Monkframe are secured and powered thanks to the technological partnership with our cloud providers.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 mb-8"></div>

        <div className="flex flex-col sm:flex-row justify-between items-center text-center">
          <div className="flex gap-4 mb-4 sm:mb-0">
            <Link href="/licenses" className="text-[12px] font-bold text-gray-500 uppercase hover:text-blue-600">Licenses</Link>
            <Link href="/contact" className="text-[12px] font-bold text-gray-500 uppercase hover:text-blue-600">Contact</Link>
            <Link href="/faq" className="text-[12px] font-bold text-gray-500 uppercase hover:text-blue-600">Faq</Link>
          </div>
          <p className="text-[13px] font-medium text-gray-500">
            © 2026 Monkframe Design. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

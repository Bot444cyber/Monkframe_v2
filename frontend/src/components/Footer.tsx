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

        <div className="border-t border-gray-100 mb-8"></div>

        <div className="flex flex-col sm:flex-row justify-between items-center text-center">
          <div className="flex gap-4 mb-4 sm:mb-0">
            <Link href="/licenses" className="text-[12px] font-bold text-gray-500 uppercase hover:text-blue-600">Licenses</Link>
            <Link href="/contact" className="text-[12px] font-bold text-gray-500 uppercase hover:text-blue-600">Contact</Link>
            <Link href="/faq" className="text-[12px] font-bold text-gray-500 uppercase hover:text-blue-600">Faq</Link>
          </div>
          <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <img src="/logo/M_SHAPE.svg" alt="MOCKUPIDEA Logo" className="w-6 h-6 object-contain" />
            <span className="font-bold tracking-wider text-[14px] text-gray-900">MOCKUPIDEA</span>
          </div>
          <p className="text-[13px] font-medium text-gray-500">
            © 2026 MOCKUPIDEA Design. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

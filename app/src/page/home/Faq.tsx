"use client";
import React, { useState } from 'react';
import { FAQS } from './ts/constants';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Got Questions?</h2>
        <p className="text-zinc-400 text-lg">Everything you need to know about our products and licenses.</p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, i) => (
          <div
            key={i}
            className={`rounded-3xl overflow-hidden transition-all duration-300 border ${openIndex === i ? 'bg-white border-white' : 'bg-[#0a0a0a] border-white/5'}`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-6 md:p-8 text-left group"
            >
              <span className={`text-lg font-bold transition-colors ${openIndex === i ? 'text-black' : 'text-white group-hover:text-indigo-400'}`}>{faq.question}</span>
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${openIndex === i ? 'border-zinc-200 bg-zinc-100 rotate-180' : 'border-white/10'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 ${openIndex === i ? 'text-black' : 'text-white'}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-96 opacity-100 pb-8 px-8' : 'max-h-0 opacity-0'}`}>
              <p className={`leading-relaxed text-base ${openIndex === i ? 'text-zinc-600' : 'text-zinc-400'}`}>
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;

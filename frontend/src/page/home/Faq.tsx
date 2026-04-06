"use client";
import React, { useState } from 'react';

const CATEGORIES = [
  "About MD",
  "License and legals",
  "Requests and custom jobs",
  "Technical Issues",
  "Migration from Smarty Mockups"
];

const FAQ_DATA = [
  {
    category: "About MD",
    items: [
      { q: "Why are you calling mockups for free?", a: "We believe in providing high-quality resources to the design community without financial barriers. It helps us build a strong community and showcase our premium offerings." },
      { q: "Aren't you afraid of spoiling the mockup market?", a: "Not at all. We believe accessible design tools elevate the entire industry, and there is always room for premium, highly specific mockups." },
      { q: "May we share your mockups on our blog?", a: "Yes, you are welcome to share them as long as you link back to our original page and do not host the source files directly." },
      { q: "What happens with mockups.co?", a: "Mockups.co has been integrated into our main platform to provide a unified experience for all our users." },
      { q: "May we insert our links inside your mockup?", a: "No, you may not redistribute our mockups with your own promotional links embedded within the source files." },
      { q: "Will you teach me how to create mockups?", a: "We occasionally post tutorials on our blog and social media. Stay tuned for educational content!" }
    ]
  },
  {
    category: "License and legals",
    items: [
      { q: "Are the mockups available for free?", a: "Yes, the standard versions of these mockups are available completely for free." },
      { q: "What can and cannot do with mockups from mockupdesign.com?", a: "You can use them for personal and commercial projects. You cannot resell them or redistribute them as your own resources." },
      { q: "Can I use a mockup on platforms like Creative Market or Fiverr?", a: "You may use them to showcase your design work on these platforms, but you cannot sell the mockup files themselves." },
      { q: "Can I use a mockup in a commercial project?", a: "Yes, commercial use is fully permitted under our standard license." },
      { q: "Do I need to tag the author?", a: "Attribution is highly appreciated but not strictly required for most projects. It helps us grow!" },
      { q: "Can I share the modified mockup on my website?", a: "You can showcase the finished design, but providing the modified PSD/source file for download is not allowed." },
      { q: "Can I use a mockup in a video game/online content?", a: "Yes, you can use them as part of your digital media or games." },
      { q: "Can I add text/logo to a mockup?", a: "Absolutely. They are designed exactly for this purpose." },
      { q: "Can I sell your mockup on stock websites?", a: "No. Selling our mockups, modified or unmodified, on stock platforms is strictly prohibited." },
      { q: "Can I claim your mockup as my creation?", a: "No, you cannot claim ownership or authorship of the original mockup files." }
    ]
  },
  {
    category: "Requests and custom jobs",
    items: [
      { q: "I have an idea for a mockup. Can you create it?", a: "We are always open to suggestions! Feel free to send us your ideas through our contact form." },
      { q: "Will you create a mockup I ask for me?", a: "We review requests and often create mockups that appeal to a wide audience. Custom exclusive mockups require a specific commission." },
      { q: "Can you help me modify your mockup?", a: "We do not provide personalized modification services for free files, but our mockups are designed to be user-friendly." },
      { q: "Can you create a custom design/project for me?", a: "Yes! We offer custom 3D modeling and mockup creation services. Please contact our sales team." }
    ]
  },
  {
    category: "Technical Issues",
    items: [
      { q: "How to use mockups downloaded from this page?", a: "Simply open the file in Photoshop (or a compatible editor), find the layer marked 'Your Design Here' or similar, double-click the Smart Object, paste your design, and save it." },
      { q: "What software do I need to use mockups?", a: "Most of our mockups require Adobe Photoshop (CS6 or newer). Some may be compatible with alternatives like Photopea." },
      { q: "How to extract a folder?", a: "Use software like WinRAR, 7-Zip (Windows), or The Unarchiver (Mac), or use the built-in extraction tools in your OS." },
      { q: "Your mockups are missing. Why is that?", a: "If a file is missing, it may be updating or there might be a temporary server issue. Please try again later or contact support." },
      { q: "The mockups show missing smart object.", a: "Ensure you are opening the file in a compatible version of Photoshop. Some features require newer versions." },
      { q: "I can't open a mockup file.", a: "Check that the download finished completely and verify you have the correct software installed." },
      { q: "I can't save the PSD file.", a: "Ensure the file isn't set to 'Read-Only' and that you have enough disk space." },
      { q: "How do I paste my design into the mockup?", a: "Double-click the smart object layer thumbnail, place your artwork inside the new document that opens, and hit Save." }
    ]
  },
  {
    category: "Migration from Smarty Mockups",
    items: [
      { q: "What is the difference between the smaller version and the full-sized ultra version?", a: "Only the resolution - we sell regular premium options at standard sizes, but Ultra offers exceptionally high DPI and larger pixel dimensions. It is used when detail is paramount, such as large print or high-end presentations." },
      { q: "Why are you giving away your premium mockups ultra edition for free?", a: "As part of our migration campaign, we want our users to experience the highest quality we offer, building trust and showcasing our capabilities." },
      { q: "Are the premium mockups really fully commercial?", a: "Yes, you have full commercial rights to use them in projects for clients or marketing." },
      { q: "Can I use Smarty mockups mockups in multiple projects?", a: "Absolutely. Once downloaded, you can use them as many times as you like for different projects." },
      { q: "Why do I need to stay subscribed to verify the legal of your account?", a: "Subscription keeps your license key active and ensures you are receiving the latest compliance updates." },
      { q: "Are you planning to bring the shop back sometime?", a: "We are integrating the shop features directly into this unified platform very soon." },
      { q: "Can I suggest a new packaging mockup for you to create?", a: "Yes! We love community input. Please use the request form in your account dashboard." }
    ]
  }
];

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const scrollToCategory = (category: string) => {
    const element = document.getElementById(`faq-category-${category.replace(/\s+/g, '-').toLowerCase()}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="faq" className="py-24 px-6 max-w-5xl mx-auto font-sans">
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">FAQs</h2>
        <p className="text-gray-600 text-base mb-6">All the questions that have been asked at least twice.</p>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((cat, i) => (
            <button
              key={i}
              onClick={() => scrollToCategory(cat)}
              className="px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-500 text-white text-sm font-bold uppercase tracking-widest transition-colors duration-200"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-10">
        {FAQ_DATA.map((section, catIndex) => (
          <div
            key={catIndex}
            id={`faq-category-${section.category.replace(/\s+/g, '-').toLowerCase()}`}
            className="bg-gray-50/70 p-8 md:p-10 rounded-2xl scroll-mt-24"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{section.category}</h3>

            <div className="flex flex-col">
              {section.items.map((item, itemIndex) => {
                const isOpen = !!openItems[`${catIndex}-${itemIndex}`];
                const isLast = itemIndex === section.items.length - 1;

                return (
                  <div key={itemIndex} className={`group ${!isLast ? 'border-b border-gray-200/60' : ''}`}>
                    <button
                      onClick={() => toggleItem(catIndex, itemIndex)}
                      className="w-full flex items-center justify-between py-5 text-left bg-transparent"
                    >
                      <span className={`text-[15px] font-bold transition-colors duration-200 ${isOpen ? 'text-amber-500' : 'text-gray-700 hover:text-amber-500'}`}>
                        {item.q}
                      </span>
                      <div className="shrink-0 ml-6">
                        {/* Simple Chevron without circle */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={3}
                          stroke="currentColor"
                          className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-90 text-amber-500' : 'text-gray-400 group-hover:text-amber-500'}`}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </div>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 pb-5' : 'max-h-0 opacity-0'}`}
                    >
                      <p className="text-gray-600 text-sm leading-relaxed pr-8">
                        {item.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;

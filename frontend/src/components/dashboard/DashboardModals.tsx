import React, { useState, useEffect } from 'react';
import { Product } from '@/components/ts/types';
import { ChevronDown } from 'lucide-react';

interface DashboardModalsProps {
    isAddOpen: boolean;
    isEditOpen: boolean;
    setIsAddOpen: (isOpen: boolean) => void;
    setIsEditOpen: (isOpen: boolean) => void;
    currentUI: Partial<Product>;
    setCurrentUI: (ui: Partial<Product>) => void;
    handleSave: () => void;
    files: {
        banner: File | null;
        uiFile: File | null;
        showcase: File[];
    };
    setFiles: React.Dispatch<React.SetStateAction<{
        banner: File | null;
        uiFile: File | null;
        showcase: File[];
    }>>;
    previews: {
        banner: string | null;
        showcase: string[];
    };
    setPreviews: React.Dispatch<React.SetStateAction<{
        banner: string | null;
        showcase: string[];
    }>>;
}

const DashboardModals: React.FC<DashboardModalsProps> = ({
    isAddOpen,
    isEditOpen,
    setIsAddOpen,
    setIsEditOpen,
    currentUI,
    setCurrentUI,
    handleSave,
    files,
    setFiles,
    previews,
    setPreviews
}) => {
    const [newItem, setNewItem] = React.useState('');
    if (!isAddOpen && !isEditOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
            <div className="bg-card backdrop-blur-xl border border-border p-6 sm:p-8 rounded-3xl w-full max-w-lg relative animate-in fade-in zoom-in-95 shadow-2xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                        {isAddOpen ? 'Deploy New Asset' : 'Update Asset'}
                    </h3>
                    <button
                        onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }}
                        className="p-2 bg-secondary hover:bg-secondary/80 rounded-xl text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form Fields */}
                <div className="space-y-6">

                    {/* Reusable Toolbar Helper */}
                    {(() => {
                        const FormattingToolbar = ({ inputId, value, onChange }: { inputId: string, value: string, onChange: (val: string) => void }) => {
                            const applyFormat = (prefix: string, suffix: string) => {
                                const input = document.getElementById(inputId) as HTMLInputElement | HTMLTextAreaElement;
                                if (!input) return;
                                const start = input.selectionStart || 0;
                                const end = input.selectionEnd || 0;
                                const selected = value.substring(start, end);
                                const before = value.substring(0, start);
                                const after = value.substring(end);
                                const newVal = `${before}${prefix}${selected}${suffix}${after}`;
                                onChange(newVal);
                                setTimeout(() => {
                                    input.focus();
                                    input.setSelectionRange(start + prefix.length, end + prefix.length);
                                }, 0);
                            };

                            const applyLineFormat = (prefix: string) => {
                                const input = document.getElementById(inputId) as HTMLInputElement | HTMLTextAreaElement;
                                if (!input) return;
                                const start = input.selectionStart || 0;
                                const beforeCursor = value.substring(0, start);
                                const lastNewline = beforeCursor.lastIndexOf('\n');
                                const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;
                                const beforeLine = value.substring(0, lineStart);
                                const afterLineStart = value.substring(lineStart);
                                const newVal = `${beforeLine}${prefix}${afterLineStart}`;
                                onChange(newVal);
                                setTimeout(() => {
                                    input.focus();
                                    input.setSelectionRange(start + prefix.length, start + prefix.length);
                                }, 0);
                            };

                            return (
                                <div className="flex flex-wrap items-center gap-1.5 mb-1 px-1">
                                    <button
                                        type="button"
                                        onClick={() => applyFormat('**', '**')}
                                        className="p-1.5 bg-secondary hover:bg-blue-600/10 hover:text-blue-600 rounded-lg text-muted-foreground transition-all"
                                        title="Bold"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3.75h4.125a3.375 3.375 0 110 6.75H6.75V3.75z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 10.5h4.875a3.375 3.375 0 110 6.75H6.75V10.5z" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => applyFormat('*', '*')}
                                        className="p-1.5 bg-secondary hover:bg-blue-600/10 hover:text-blue-600 rounded-lg text-muted-foreground transition-all"
                                        title="Italic"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.625c0-1.036.84-1.875 1.875-1.875h10.5c1.036 0 1.875.839 1.875 1.875v.75c0 1.036-.84 1.875-1.875 1.875h-10.5c-1.036 0-1.875-.839-1.875-1.875v-.75z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v7.5" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 18h4.5" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => applyFormat('__', '__')}
                                        className="p-1.5 bg-secondary hover:bg-blue-600/10 hover:text-blue-600 rounded-lg text-muted-foreground transition-all flex items-center justify-center min-w-[30px]"
                                        title="Underline"
                                    >
                                        <span className="text-[10px] font-black underline decoration-2 leading-none">U</span>
                                    </button>
                                    {inputId === 'description-input' && (
                                        <>
                                            <div className="w-px h-4 bg-border mx-1" />
                                            <button
                                                type="button"
                                                onClick={() => applyLineFormat('### ')}
                                                className="p-1.5 bg-secondary hover:bg-blue-600/10 hover:text-blue-600 rounded-lg text-muted-foreground transition-all"
                                                title="Sub-Header"
                                            >
                                                <span className="text-[10px] font-black leading-none">H3</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => applyLineFormat('- ')}
                                                className="p-1.5 bg-secondary hover:bg-blue-600/10 hover:text-blue-600 rounded-lg text-muted-foreground transition-all"
                                                title="Bullet List"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-0.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                                </svg>
                                            </button>
                                        </>
                                    )}
                                </div>
                            );
                        };

                        return (
                            <>
                                {/* Title */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Name</label>
                                    <FormattingToolbar inputId="title-input" value={currentUI.title || ''} onChange={val => setCurrentUI({ ...currentUI, title: val })} />
                                    <input
                                        id="title-input"
                                        placeholder="Title"
                                        className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus:border-blue-600 outline-none font-bold"
                                        value={currentUI.title || ''}
                                        onChange={e => setCurrentUI({ ...currentUI, title: e.target.value })}
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Exhibition Description</label>
                                    <FormattingToolbar inputId="description-input" value={currentUI.overview || ''} onChange={val => setCurrentUI({ ...currentUI, overview: val })} />
                                    <textarea
                                        id="description-input"
                                        placeholder="Description (**bold**, *italic*, __underline__)"
                                        className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus:border-blue-600 outline-none h-32 resize-none leading-relaxed"
                                        value={currentUI.overview || ''}
                                        onChange={e => setCurrentUI({ ...currentUI, overview: e.target.value })}
                                    />
                                </div>

                                {/* Category */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Category</label>
                                    <div className="relative">
                                        <select
                                            id="category-input"
                                            className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground hover:border-border/80 focus:border-blue-600 outline-none text-sm font-bold appearance-none cursor-pointer transition-all shadow-sm focus:shadow-md focus:shadow-blue-600/10"
                                            value={currentUI.category || ''}
                                            onChange={e => setCurrentUI({ ...currentUI, category: e.target.value })}
                                        >
                                            <option value="" disabled>Select a Category</option>
                                            <option value="Flyer">Flyer</option>
                                            <option value="Brochure">Brochure</option>
                                            <option value="Business Card">Business Card</option>
                                            <option value="Outdoor">Outdoor</option>
                                            <option value="Book">Book</option>
                                            <option value="Stationery">Stationery</option>
                                            <option value="Packaging">Packaging</option>
                                            <option value="Poster">Poster</option>
                                            <option value="More">More</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground group-hover:text-blue-600 transition-colors">
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                {/* Custom URL */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Custom Product URL Slug</label>
                                    {(() => {
                                        const generatedSlug = currentUI.slug || (currentUI.title ? currentUI.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '');
                                        const siteUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

                                        return (
                                            <>
                                                <div className="flex bg-[#EEF0F5]/50 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-600 transition-shadow">
                                                    <span className="flex items-center px-3 text-[11px] font-medium text-gray-400 bg-gray-50 border-r border-gray-200 select-none hidden sm:flex">
                                                        {siteUrl}/{currentUI.category ? currentUI.category.toLowerCase() : 'mockups'}/
                                                    </span>
                                                    <input
                                                        id="custom-url-input"
                                                        type="text"
                                                        placeholder={generatedSlug || "your-custom-slug-here"}
                                                        value={currentUI.customUrl || ''}
                                                        onChange={(e) => setCurrentUI({ ...currentUI, customUrl: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                                                        className="w-full px-4 py-3 bg-transparent border-0 outline-none text-[13px] font-semibold text-gray-900 placeholder:text-gray-400"
                                                    />
                                                </div>
                                                <p className="px-1 text-[9px] font-bold text-gray-400/80 uppercase tracking-widest leading-relaxed mt-1.5">
                                                    IF EMPTY, WE USE YOUR DEFAULT PRODUCT LINK:<br />
                                                    <span className="text-gray-400 font-medium normal-case tracking-normal">{siteUrl}/{currentUI.category ? currentUI.category.toLowerCase() : 'mockups'}/{currentUI.customUrl || generatedSlug || 'free-standing-front-facing-6x9-book-mockup-psd'}</span>
                                                </p>
                                            </>
                                        );
                                    })()}
                                </div>

                                {/* Additional Information */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Additional details (Tags)</label>

                                    {/* Tags Display */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {(() => {
                                            const rawAuthor = currentUI.author || '';
                                            let tags: string[] = [];
                                            try {
                                                const parsed = JSON.parse(rawAuthor);
                                                tags = Array.isArray(parsed) ? parsed : [rawAuthor];
                                            } catch {
                                                tags = rawAuthor.split(',').map(item => item.trim()).filter(Boolean);
                                            }

                                            return tags.map((tag, idx) => (
                                                <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/5 border border-blue-600/10 rounded-full text-[10px] font-black uppercase text-blue-600 group hover:border-blue-600/30 transition-all">
                                                    <span>{tag}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newTags = [...tags];
                                                            newTags.splice(idx, 1);
                                                            setCurrentUI({ ...currentUI, author: JSON.stringify(newTags) });
                                                        }}
                                                        className="hover:text-red-500 transition-colors"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ));
                                        })()}
                                    </div>

                                    <FormattingToolbar inputId="author-input" value={newItem} onChange={setNewItem} />
                                    <div className="relative group">
                                        <input
                                            id="author-input"
                                            placeholder="Add new detail (Press Enter)..."
                                            className="w-full bg-secondary border border-border rounded-xl pl-4 pr-12 py-3 text-foreground focus:border-blue-600 outline-none text-sm font-bold"
                                            value={newItem}
                                            onChange={e => setNewItem(e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    if (newItem.trim()) {
                                                        const rawAuthor = currentUI.author || '';
                                                        let tags: string[] = [];
                                                        try {
                                                            const parsed = JSON.parse(rawAuthor);
                                                            tags = Array.isArray(parsed) ? parsed : [];
                                                        } catch {
                                                            tags = rawAuthor.split(',').map(item => item.trim()).filter(Boolean);
                                                        }
                                                        const newTags = [...tags, newItem.trim()];
                                                        setCurrentUI({ ...currentUI, author: JSON.stringify(newTags) });
                                                        setNewItem('');
                                                    }
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (newItem.trim()) {
                                                    const rawAuthor = currentUI.author || '';
                                                    let tags: string[] = [];
                                                    try {
                                                        const parsed = JSON.parse(rawAuthor);
                                                        tags = Array.isArray(parsed) ? parsed : [];
                                                    } catch {
                                                        tags = rawAuthor.split(',').map(item => item.trim()).filter(Boolean);
                                                    }
                                                    const newTags = [...tags, newItem.trim()];
                                                    setCurrentUI({ ...currentUI, author: JSON.stringify(newTags) });
                                                    setNewItem('');
                                                }
                                            }}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-blue-600 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="text-[9px] text-muted-foreground/60 font-bold uppercase tracking-wider pl-1">Tip: Press Enter to add. Use **bold** for highlights.</p>
                                </div>
                            </>
                        );
                    })()}

                    {/* Banner Image (Add mode only) */}
                    {isAddOpen && (
                        <div className="space-y-2">
                            <label className="text-xs text-muted-foreground font-bold uppercase tracking-widest pl-1">Banner Image</label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="banner-upload"
                                    onChange={e => {
                                        const file = e.target.files ? e.target.files[0] : null;
                                        if (file) {
                                            setFiles(prev => ({ ...prev, banner: file }));
                                            setPreviews(prev => ({ ...prev, banner: URL.createObjectURL(file) }));
                                        }
                                    }}
                                />
                                <label
                                    htmlFor="banner-upload"
                                    className={`flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${previews.banner || currentUI.imageSrc
                                        ? 'border-blue-600/50 bg-blue-600/5'
                                        : 'border-border hover:bg-secondary'
                                        }`}
                                >
                                    {previews.banner || currentUI.imageSrc ? (
                                        <div className="relative w-full h-full p-2">
                                            <img src={previews.banner || currentUI.imageSrc} className="w-full h-full object-cover rounded-lg" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                                <span className="text-xs font-bold text-foreground uppercase tracking-widest bg-background/80 px-4 py-2 rounded-full backdrop-blur-sm border border-border">Change Banner</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <div className="p-3 rounded-full bg-secondary group-hover:bg-secondary/80 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                                </svg>
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-wider">Click to upload banner</span>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Image Up to 4 Max — showcase gallery (Add mode only) */}
                    {isAddOpen && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs text-muted-foreground font-bold uppercase tracking-widest pl-1">Image Upto 3 Max</label>
                                <span className="text-[10px] text-muted-foreground font-bold uppercase">
                                    {Math.max(previews.showcase.length, (currentUI.showcase?.length || 0))}/3 Images
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {[0, 1, 2].map((idx) => {
                                    const preview = previews.showcase[idx];
                                    const existing = currentUI.showcase && currentUI.showcase[idx];
                                    const displayUrl = preview || existing;

                                    return (
                                        <div key={idx} className="relative group aspect-square">
                                            {displayUrl ? (
                                                <div className="w-full h-full relative rounded-2xl overflow-hidden border border-border shadow-lg group-hover:border-blue-600/30 transition-all">
                                                    <img src={displayUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                                                        <input
                                                            type="file" accept="image/*" className="hidden"
                                                            id={`showcase-change-${idx}`}
                                                            onChange={e => {
                                                                if (e.target.files && e.target.files[0]) {
                                                                    const file = e.target.files[0];
                                                                    setFiles(prev => { const s = [...prev.showcase]; s[idx] = file; return { ...prev, showcase: s }; });
                                                                    setPreviews(prev => { const s = [...prev.showcase]; s[idx] = URL.createObjectURL(file); return { ...prev, showcase: s }; });
                                                                }
                                                            }}
                                                        />
                                                        <label htmlFor={`showcase-change-${idx}`} className="p-2 bg-blue-600/20 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all cursor-pointer transform hover:scale-110" title="Replace">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7l3.181 3.182m-4.722 4.99v-4.99m0 0h-4.992m4.993 0l-3.181-3.181a8.25 8.25 0 00-13.803 3.7l3.181-3.182" />
                                                            </svg>
                                                        </label>
                                                        <button
                                                            onClick={() => {
                                                                const nf = [...files.showcase]; const np = [...previews.showcase]; const ns = currentUI.showcase ? [...currentUI.showcase] : [];
                                                                if (preview) { nf.splice(idx, 1); np.splice(idx, 1); } else { ns.splice(idx, 1); setCurrentUI({ ...currentUI, showcase: ns }); }
                                                                setFiles(prev => ({ ...prev, showcase: nf })); setPreviews(prev => ({ ...prev, showcase: np }));
                                                            }}
                                                            className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all transform hover:scale-110" title="Remove"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <input
                                                        type="file" accept="image/*" className="hidden"
                                                        id={`showcase-${idx}`}
                                                        onChange={e => {
                                                            if (e.target.files && e.target.files[0]) {
                                                                const file = e.target.files[0];
                                                                setFiles(prev => { const s = [...prev.showcase]; s[idx] = file; return { ...prev, showcase: s }; });
                                                                setPreviews(prev => { const s = [...prev.showcase]; s[idx] = URL.createObjectURL(file); return { ...prev, showcase: s }; });
                                                            }
                                                        }}
                                                    />
                                                    <label
                                                        htmlFor={`showcase-${idx}`}
                                                        className="flex flex-col items-center justify-center w-full h-full rounded-2xl border-2 border-dashed border-border bg-secondary/50 hover:border-blue-600/30 hover:bg-blue-600/5 transition-all cursor-pointer"
                                                    >
                                                        <div className="p-2 rounded-lg bg-secondary">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-muted-foreground">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-2">Add</span>
                                                    </label>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 mt-8">
                    <button
                        onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }}
                        className="px-6 py-2 text-muted-foreground hover:text-foreground"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-8 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20"
                    >
                        {isAddOpen ? 'Deploy Asset' : 'Save Changes'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default DashboardModals;

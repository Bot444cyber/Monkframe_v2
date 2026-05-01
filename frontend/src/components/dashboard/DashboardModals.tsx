import React, { useState, useCallback } from 'react';
import { Product } from '@/components/ts/types';
import { ChevronDown } from 'lucide-react';

/** Slot state for one showcase slot */
interface ShowcaseSlot {
    existingUrl: string | null; // currently on Drive (from currentUI.showcase)
    newFile: File | null;       // newly picked file (not yet saved)
    newPreview: string | null;  // object URL for newFile
    removed: boolean;           // user clicked Remove on an existing image
}

interface DashboardModalsProps {
    isAddOpen: boolean;
    isEditOpen: boolean;
    setIsAddOpen: (isOpen: boolean) => void;
    setIsEditOpen: (isOpen: boolean) => void;
    currentUI: Partial<Product>;
    setCurrentUI: (ui: Partial<Product>) => void;
    /** Called on Save. Modal passes enriched FormData (with showcaseIndexes) */
    handleSave: (opts: { uiFile: File | null; banner: File | null; showcaseFiles: File[]; showcaseIndexes: number[] }) => void;
    files: { banner: File | null; uiFile: File | null; showcase: File[] };
    setFiles: React.Dispatch<React.SetStateAction<{ banner: File | null; uiFile: File | null; showcase: File[] }>>;
    previews: { banner: string | null; showcase: string[] };
    setPreviews: React.Dispatch<React.SetStateAction<{ banner: string | null; showcase: string[] }>>;
    onDeleteFile: (type: 'banner' | 'showcase' | 'uiFile', index?: number) => Promise<void>;
}

/* ── Formatting Toolbar ────────────────────────────────────────── */
function FormattingToolbar({ inputId, value, onChange, showHeading = false }: {
    inputId: string; value: string; onChange: (val: string) => void; showHeading?: boolean;
}) {
    const applyFormat = (prefix: string, suffix: string) => {
        const input = document.getElementById(inputId) as HTMLInputElement | HTMLTextAreaElement;
        if (!input) return;
        const start = input.selectionStart || 0;
        const end = input.selectionEnd || 0;
        onChange(`${value.substring(0, start)}${prefix}${value.substring(start, end)}${suffix}${value.substring(end)}`);
        setTimeout(() => { input.focus(); input.setSelectionRange(start + prefix.length, end + prefix.length); }, 0);
    };
    const applyLineFormat = (prefix: string) => {
        const input = document.getElementById(inputId) as HTMLInputElement | HTMLTextAreaElement;
        if (!input) return;
        const start = input.selectionStart || 0;
        const lineStart = value.substring(0, start).lastIndexOf('\n') + 1;
        onChange(`${value.substring(0, lineStart)}${prefix}${value.substring(lineStart)}`);
        setTimeout(() => { input.focus(); input.setSelectionRange(start + prefix.length, start + prefix.length); }, 0);
    };
    const insertTable = () => {
        const input = document.getElementById(inputId) as HTMLInputElement | HTMLTextAreaElement;
        if (!input) return;
        const start = input.selectionStart || 0;
        const tableTpl = `\n\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Row 1    | Data     | Data     |\n| Row 2    | Data     | Data     |\n\n`;
        onChange(`${value.substring(0, start)}${tableTpl}${value.substring(start)}`);
        setTimeout(() => { input.focus(); input.setSelectionRange(start + 4, start + 12); }, 0);
    };
    const btn = 'p-1.5 bg-secondary hover:bg-blue-600/10 hover:text-blue-600 rounded-lg text-muted-foreground transition-all';
    return (
        <div className="flex flex-wrap items-center gap-1.5 mb-1 px-1">
            <button type="button" onClick={() => applyFormat('**', '**')} className={btn} title="Bold">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3.75h4.125a3.375 3.375 0 110 6.75H6.75V3.75z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 10.5h4.875a3.375 3.375 0 110 6.75H6.75V10.5z" /></svg>
            </button>
            <button type="button" onClick={() => applyFormat('*', '*')} className={btn} title="Italic">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 4.5L9.75 19.5M4.5 4.5H19.5" /></svg>
            </button>
            <button type="button" onClick={() => applyFormat('__', '__')} className={`${btn} flex items-center justify-center min-w-[30px]`} title="Underline">
                <span className="text-[10px] font-black underline decoration-2 leading-none">U</span>
            </button>
            {showHeading && (
                <>
                    <div className="w-px h-4 bg-border mx-1" />
                    <button type="button" onClick={() => applyLineFormat('### ')} className={btn} title="Sub-Header"><span className="text-[10px] font-black leading-none">H3</span></button>
                    <button type="button" onClick={() => applyLineFormat('- ')} className={btn} title="Bullet List">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-0.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                    </button>
                    <button type="button" onClick={insertTable} className={btn} title="Insert Table">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.375 5.25h17.25a1.5 1.5 0 011.5 1.5v10.5a1.5 1.5 0 01-1.5 1.5H3.375a1.5 1.5 0 01-1.5-1.5V6.75a1.5 1.5 0 011.5-1.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.375 10.5h17.25M9 5.25v15M15 5.25v15" /></svg>
                    </button>
                </>
            )}
        </div>
    );
}

/* ── Showcase Slot Component ────────────────────────────────────── */
function ShowcaseSlotView({ slot, slotIdx, onPickFile, onRemove, isRemoving }: {
    slot: ShowcaseSlot;
    slotIdx: number;
    onPickFile: (idx: number, file: File) => void;
    onRemove: (idx: number) => void;
    isRemoving: boolean;
}) {
    const displayUrl = slot.newPreview || (!slot.removed ? slot.existingUrl : null);
    const fileInputId = `showcase-slot-${slotIdx}`;

    if (isRemoving) {
        return (
            <div className="aspect-square rounded-2xl border border-border bg-secondary/30 flex items-center justify-center">
                <span className="text-[9px] text-red-500 font-bold animate-pulse">Removing…</span>
            </div>
        );
    }

    if (displayUrl) {
        return (
            <div className="relative group aspect-square rounded-2xl overflow-hidden border border-border shadow-lg">
                <img src={displayUrl} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                    <input type="file" accept="image/*" className="hidden" id={fileInputId}
                        onChange={e => { if (e.target.files?.[0]) { onPickFile(slotIdx, e.target.files[0]); e.target.value = ''; } }} />
                    <label htmlFor={fileInputId}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 text-blue-600 rounded-xl text-[11px] font-bold hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m-4.493 4.49l3.181 3.182" /></svg>
                        Replace
                    </label>
                    <button type="button" onClick={() => onRemove(slotIdx)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 text-red-500 rounded-xl text-[11px] font-bold hover:bg-red-500 hover:text-white transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        Remove
                    </button>
                </div>
                {slot.newPreview && (
                    <div className="absolute top-1.5 left-1.5 bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase">New</div>
                )}
            </div>
        );
    }

    return (
        <div className="aspect-square">
            <input type="file" accept="image/*" className="hidden" id={fileInputId}
                onChange={e => { if (e.target.files?.[0]) { onPickFile(slotIdx, e.target.files[0]); e.target.value = ''; } }} />
            <label htmlFor={fileInputId}
                className="flex flex-col items-center justify-center w-full h-full rounded-2xl border-2 border-dashed border-border bg-secondary/50 hover:border-blue-600/30 hover:bg-blue-600/5 transition-all cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-muted-foreground mb-1"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Add</span>
            </label>
        </div>
    );
}

/* ── Main Component ────────────────────────────────────────────── */
const DashboardModals: React.FC<DashboardModalsProps> = ({
    isAddOpen, isEditOpen,
    setIsAddOpen, setIsEditOpen,
    currentUI, setCurrentUI,
    handleSave,
    files, setFiles,
    previews, setPreviews,
    onDeleteFile
}) => {
    const [newItem, setNewItem] = useState('');
    const [deletingFile, setDeletingFile] = useState<string | null>(null);

    // Per-slot showcase state (3 fixed slots)
    const buildInitialSlots = useCallback((): ShowcaseSlot[] => {
        const ex = (currentUI.showcase || []) as string[];
        return [0, 1, 2].map(i => ({
            existingUrl: ex[i] || null,
            newFile: null,
            newPreview: null,
            removed: false,
        }));
    }, [currentUI.showcase]);

    const [slots, setSlots] = React.useState<ShowcaseSlot[]>(buildInitialSlots);

    // Re-initialise slots whenever the modal opens with a different product
    const prevIdRef = React.useRef<string | undefined>(undefined);
    React.useEffect(() => {
        if (currentUI.id !== prevIdRef.current) {
            prevIdRef.current = currentUI.id;
            setSlots(buildInitialSlots());
        }
    }, [currentUI.id, buildInitialSlots]);

    // Banner local state
    const [bannerFile, setBannerFile] = React.useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = React.useState<string | null>(null);

    // uiFile local state
    const [uiFile, setUiFile] = React.useState<File | null>(null);

    if (!isAddOpen && !isEditOpen) return null;

    const close = () => { setIsAddOpen(false); setIsEditOpen(false); };

    /* ── Banner handlers ── */
    const pickBanner = (file: File) => {
        setBannerFile(file);
        setBannerPreview(URL.createObjectURL(file));
    };
    const removeBanner = async () => {
        if (bannerFile) { setBannerFile(null); setBannerPreview(null); return; }
        if (!currentUI.id) return;
        setDeletingFile('banner');
        await onDeleteFile('banner');
        setCurrentUI({ ...currentUI, imageSrc: '' });
        setDeletingFile(null);
    };

    /* ── Showcase slot handlers ── */
    const pickShowcaseFile = (idx: number, file: File) => {
        const preview = URL.createObjectURL(file);
        setSlots(prev => prev.map((s, i) => i === idx ? { ...s, newFile: file, newPreview: preview, removed: false } : s));
    };
    const removeShowcaseSlot = async (idx: number) => {
        const slot = slots[idx];
        if (slot.newFile) {
            // Just clear the local pick
            setSlots(prev => prev.map((s, i) => i === idx ? { ...s, newFile: null, newPreview: null } : s));
            return;
        }
        if (slot.existingUrl && currentUI.id) {
            // Find the real index in the current showcase array (may differ after previous deletes)
            const showcase = (currentUI.showcase || []) as string[];
            const driveIdx = showcase.indexOf(slot.existingUrl);
            setDeletingFile(`showcase-${idx}`);
            await onDeleteFile('showcase', driveIdx >= 0 ? driveIdx : idx);
            setSlots(prev => prev.map((s, i) => i === idx ? { ...s, existingUrl: null, removed: true } : s));
            setDeletingFile(null);
        } else {
            setSlots(prev => prev.map((s, i) => i === idx ? { ...s, removed: true } : s));
        }
    };

    /* ── uiFile handlers ── */
    const pickUiFile = (file: File) => setUiFile(file);
    const removeUiFile = async () => {
        if (uiFile) { setUiFile(null); return; }
        if (!currentUI.id) return;
        setDeletingFile('uiFile');
        await onDeleteFile('uiFile');
        setCurrentUI({ ...currentUI, google_file_id: undefined, fileType: undefined });
        setDeletingFile(null);
    };

    /* ── Build save args ── */
    const onSave = () => {
        // Collect only slots that have a new file
        const showcaseFiles: File[] = [];
        const showcaseIndexes: number[] = [];
        slots.forEach((s, idx) => {
            if (s.newFile) {
                showcaseFiles.push(s.newFile);
                showcaseIndexes.push(idx);
            }
        });
        handleSave({ uiFile, banner: bannerFile, showcaseFiles, showcaseIndexes });
    };

    const bannerDisplay = bannerPreview || (currentUI.imageSrc || null);
    const totalSlotsFilled = slots.filter(s => !s.removed && (s.newPreview || s.existingUrl)).length;

    /* ── Tags helper ── */
    const parseTags = (raw: string): string[] => {
        try { const p = JSON.parse(raw); return Array.isArray(p) ? p : [raw].filter(Boolean); } catch { return raw.split(',').map(t => t.trim()).filter(Boolean); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
            <div className="bg-card backdrop-blur-xl border border-border p-6 sm:p-8 rounded-3xl w-full max-w-lg relative animate-in fade-in zoom-in-95 shadow-2xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                        {isAddOpen ? 'Deploy New Asset' : 'Update Asset'}
                    </h3>
                    <button onClick={close} className="p-2 bg-secondary hover:bg-secondary/80 rounded-xl text-muted-foreground hover:text-foreground transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="space-y-6">

                    {/* ── Title ── */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Name</label>
                        <FormattingToolbar inputId="title-input" value={currentUI.title || ''} onChange={val => setCurrentUI({ ...currentUI, title: val })} />
                        <input id="title-input" placeholder="Title"
                            className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus:border-blue-600 outline-none font-bold"
                            value={currentUI.title || ''}
                            onChange={e => setCurrentUI({ ...currentUI, title: e.target.value })} />
                    </div>

                    {/* ── Description ── */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Exhibition Description</label>
                        <FormattingToolbar inputId="description-input" value={currentUI.overview || ''} onChange={val => setCurrentUI({ ...currentUI, overview: val })} showHeading />
                        <textarea id="description-input" placeholder="Description (**bold**, *italic*, __underline__)"
                            className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus:border-blue-600 outline-none h-32 resize-none leading-relaxed"
                            value={currentUI.overview || ''}
                            onChange={e => setCurrentUI({ ...currentUI, overview: e.target.value })} />
                    </div>

                    {/* ── Category ── */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Category</label>
                        <div className="relative">
                            <select id="category-input"
                                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground hover:border-border/80 focus:border-blue-600 outline-none text-sm font-bold appearance-none cursor-pointer transition-all"
                                value={currentUI.category || ''}
                                onChange={e => setCurrentUI({ ...currentUI, category: e.target.value })}>
                                <option value="" disabled>Select a Category</option>
                                {['Flyer', 'Brochure', 'Business Card', 'Outdoor', 'Book', 'Stationery', 'Packaging', 'Poster', 'More'].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    {/* ── Custom URL Slug ── */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Custom Product URL Slug</label>
                        {(() => {
                            const generatedSlug = currentUI.slug || (currentUI.title ? currentUI.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '');
                            const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
                            return (
                                <>
                                    <div className="flex bg-secondary/50 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-600 transition-shadow border border-border">
                                        <span className="hidden sm:flex items-center px-3 text-[11px] font-medium text-muted-foreground bg-secondary border-r border-border select-none">
                                            {siteUrl}/{currentUI.category ? currentUI.category.toLowerCase() : 'mockups'}/
                                        </span>
                                        <input id="custom-url-input" type="text"
                                            placeholder={generatedSlug || 'your-custom-slug-here'}
                                            value={currentUI.customUrl || ''}
                                            onChange={e => setCurrentUI({ ...currentUI, customUrl: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                                            className="w-full px-4 py-3 bg-transparent border-0 outline-none text-[13px] font-semibold placeholder:text-muted-foreground text-foreground" />
                                    </div>
                                    <p className="px-1 text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest leading-relaxed mt-1.5">
                                        If empty, uses auto-generated slug from the title.
                                    </p>
                                </>
                            );
                        })()}
                    </div>

                    {/* ── Tags ── */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Additional Details (Tags)</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {parseTags(currentUI.author || '').map((tag, idx) => (
                                <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/5 border border-blue-600/10 rounded-full text-[10px] font-black uppercase text-blue-600 hover:border-blue-600/30 transition-all">
                                    <span>{tag}</span>
                                    <button type="button" onClick={() => {
                                        const newTags = parseTags(currentUI.author || '');
                                        newTags.splice(idx, 1);
                                        setCurrentUI({ ...currentUI, author: JSON.stringify(newTags) });
                                    }} className="hover:text-red-500 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <FormattingToolbar inputId="author-input" value={newItem} onChange={setNewItem} />
                        <div className="relative">
                            <input id="author-input" placeholder="Add new detail (Press Enter)..."
                                className="w-full bg-secondary border border-border rounded-xl pl-4 pr-12 py-3 text-foreground focus:border-blue-600 outline-none text-sm font-bold"
                                value={newItem} onChange={e => setNewItem(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        if (newItem.trim()) {
                                            const tags = parseTags(currentUI.author || '');
                                            setCurrentUI({ ...currentUI, author: JSON.stringify([...tags, newItem.trim()]) });
                                            setNewItem('');
                                        }
                                    }
                                }} />
                            <button type="button" onClick={() => {
                                if (newItem.trim()) {
                                    const tags = parseTags(currentUI.author || '');
                                    setCurrentUI({ ...currentUI, author: JSON.stringify([...tags, newItem.trim()]) });
                                    setNewItem('');
                                }
                            }} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-blue-600 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                            </button>
                        </div>
                        <p className="text-[9px] text-muted-foreground/60 font-bold uppercase tracking-wider pl-1">Press Enter to add a tag.</p>
                    </div>

                    {/* ══ MEDIA SECTION DIVIDER ══ */}
                    <div className="flex items-center gap-3 pt-2">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Media Files</span>
                        <div className="flex-1 h-px bg-border" />
                    </div>

                    {/* ── Banner Image ── */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Banner Image</label>
                            {bannerDisplay && (
                                <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest bg-blue-600/5 px-2 py-0.5 rounded-full border border-blue-600/10">
                                    {bannerFile ? 'New — not saved yet' : 'Current'}
                                </span>
                            )}
                        </div>
                        {bannerDisplay ? (
                            <div className="relative group w-full h-44 rounded-2xl overflow-hidden border border-border shadow-lg">
                                <img src={bannerDisplay} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                                    <input type="file" accept="image/*" className="hidden" id="banner-replace"
                                        onChange={e => { if (e.target.files?.[0]) { pickBanner(e.target.files[0]); e.target.value = ''; } }} />
                                    <label htmlFor="banner-replace"
                                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600/20 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m-4.493 4.49l3.181 3.182" /></svg>
                                        Replace Banner
                                    </label>
                                    <button type="button" onClick={removeBanner} disabled={deletingFile === 'banner'}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-red-500/20 text-red-500 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all disabled:opacity-60">
                                        {deletingFile === 'banner' ? 'Removing…' : (
                                            <><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg> Remove Banner</>
                                        )}
                                    </button>
                                </div>
                                {bannerFile && <div className="absolute top-2 left-2 bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase">New</div>}
                            </div>
                        ) : (
                            <>
                                <input type="file" accept="image/*" className="hidden" id="banner-upload"
                                    onChange={e => { if (e.target.files?.[0]) { pickBanner(e.target.files[0]); e.target.value = ''; } }} />
                                <label htmlFor="banner-upload"
                                    className="flex flex-col items-center justify-center w-full h-44 rounded-2xl border-2 border-dashed border-border bg-secondary/50 hover:border-blue-600/30 hover:bg-blue-600/5 transition-all cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-muted-foreground mb-2"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Click to upload banner</span>
                                </label>
                            </>
                        )}
                    </div>

                    {/* ── Showcase Gallery ── */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Showcase Images (up to 3)</label>
                            <span className="text-[10px] text-muted-foreground font-bold uppercase">{totalSlotsFilled}/3</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {slots.map((slot, idx) => (
                                <ShowcaseSlotView
                                    key={idx}
                                    slot={slot}
                                    slotIdx={idx}
                                    onPickFile={pickShowcaseFile}
                                    onRemove={removeShowcaseSlot}
                                    isRemoving={deletingFile === `showcase-${idx}`}
                                />
                            ))}
                        </div>
                        <p className="text-[9px] text-muted-foreground/60 font-bold uppercase tracking-wider pl-1">Hover any image to Replace or Remove.</p>
                    </div>

                    {/* ── Downloadable File ── */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Downloadable File</label>

                        {/* Current / queued file chip */}
                        {(currentUI.google_file_id || uiFile) && (
                            <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-secondary/50">
                                <div className="w-9 h-9 rounded-lg bg-blue-600/10 border border-blue-600/20 flex items-center justify-center shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-foreground truncate">
                                        {uiFile ? uiFile.name : `${currentUI.fileType || 'FILE'} — Google Drive`}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">
                                        {uiFile ? 'Queued — will upload on Save' : 'Stored on Google Drive'}
                                    </p>
                                </div>
                                <button type="button" onClick={removeUiFile} disabled={deletingFile === 'uiFile'}
                                    className="px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg text-[10px] font-bold hover:bg-red-500 hover:text-white transition-all disabled:opacity-60 shrink-0">
                                    {deletingFile === 'uiFile' ? 'Removing…' : 'Remove'}
                                </button>
                            </div>
                        )}

                        {/* Upload picker */}
                        <input type="file" accept=".zip,.rar,.sketch,.fig,.xd,.ai,.psd,.pdf,.7z" className="hidden" id="uiFile-upload"
                            onChange={e => { if (e.target.files?.[0]) { pickUiFile(e.target.files[0]); e.target.value = ''; } }} />
                        <label htmlFor="uiFile-upload"
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 border-dashed border-border hover:border-blue-600/40 hover:bg-blue-600/5 transition-all cursor-pointer">
                            <div className="p-2 rounded-lg bg-secondary shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-muted-foreground"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-foreground">
                                    {currentUI.google_file_id ? 'Replace Download File' : 'Upload Download File'}
                                </p>
                                <p className="text-[10px] text-muted-foreground">.zip · .rar · .psd · .ai · .fig · .sketch · .pdf</p>
                            </div>
                        </label>
                        {uiFile && (
                            <p className="text-[9px] text-blue-600 font-bold pl-1 uppercase tracking-wider">
                                ✓ {uiFile.name} queued — uploads to Drive on Save.
                            </p>
                        )}
                    </div>

                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 mt-8">
                    <button onClick={close} className="px-6 py-2 text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
                    <button onClick={onSave} className="px-8 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20">
                        {isAddOpen ? 'Deploy Asset' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardModals;

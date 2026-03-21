import React from 'react';
import { Product } from '@/components/ts/types';

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
    if (!isAddOpen && !isEditOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <div className="bg-zinc-900/95 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-3xl w-full max-w-lg relative animate-in fade-in zoom-in-95 shadow-2xl shadow-black/50 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{isAddOpen ? 'Deploy New Asset' : 'Update Asset'}</h3>
                    <button
                        onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="space-y-4">
                    <input
                        placeholder="Title"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                        value={currentUI.title || ''}
                        onChange={e => setCurrentUI({ ...currentUI, title: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            placeholder="Price (e.g. $49)"
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none"
                            value={currentUI.price || ''}
                            onChange={e => setCurrentUI({ ...currentUI, price: e.target.value })}
                        />
                        <input
                            placeholder="Category"
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
                            value={currentUI.category || ''}
                            onChange={e => setCurrentUI({ ...currentUI, category: e.target.value })}
                        />
                    </div>
                    <input
                        placeholder="Brand Color (e.g. #4F46E5)"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none"
                        value={currentUI.color || ''}
                        onChange={e => setCurrentUI({ ...currentUI, color: e.target.value })}
                    />
                    <div className="space-y-1">
                        <label className="text-xs text-gray-400 font-bold uppercase tracking-widest pl-1">Rating (0-5)</label>
                        <input
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            placeholder="4.8"
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-yellow-500 outline-none"
                            value={currentUI.rating || ''}
                            onChange={e => setCurrentUI({ ...currentUI, rating: parseFloat(e.target.value) })}
                        />
                    </div>
                    {(isAddOpen || isEditOpen) && (
                        <div className="space-y-4">
                            <label className="text-xs text-gray-400 font-bold uppercase tracking-widest pl-1">Banner Image</label>
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
                                    className={`flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${previews.banner || currentUI.imageSrc ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                                        }`}
                                >
                                    {previews.banner || currentUI.imageSrc ? (
                                        <div className="relative w-full h-full p-2">
                                            <img src={previews.banner || currentUI.imageSrc} className="w-full h-full object-cover rounded-lg" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                                <span className="text-xs font-bold text-white uppercase tracking-widest bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">Change Banner Image</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-gray-500">
                                            <div className="p-3 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
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

                    {(isAddOpen || isEditOpen) && (
                        <div className="space-y-4">
                            <label className="text-xs text-gray-400 font-bold uppercase tracking-widest pl-1">UI Asset File</label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept=".zip,.rar,.7z,.pdf"
                                    className="hidden"
                                    id="file-upload"
                                    onChange={e => setFiles(prev => ({ ...prev, uiFile: e.target.files ? e.target.files[0] : null }))}
                                />
                                <label
                                    htmlFor="file-upload"
                                    className={`flex items-center gap-4 w-full p-4 rounded-xl border cursor-pointer transition-all ${files.uiFile ? 'bg-amber-500/10 border-amber-500/50' : 'bg-black/50 border-white/10 hover:bg-white/5 hover:border-white/20'
                                        }`}
                                >
                                    <div className={`p-3 rounded-lg ${files.uiFile || currentUI.google_file_id ? 'bg-amber-500/20 text-amber-500' : 'bg-white/5 text-gray-500'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {files.uiFile ? (
                                            <>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-bold text-white truncate max-w-[120px]">{files.uiFile.name}</p>
                                                    <span className="px-2 py-0.5 rounded bg-[#FF00FF] border border-white/20 text-white text-[10px] font-black uppercase tracking-widest shadow-[0_0_10px_#FF00FF]">
                                                        {files.uiFile.name.split('.').pop()}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-amber-500 font-medium lowercase">{(files.uiFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </>
                                        ) : currentUI.google_file_id ? (
                                            <>
                                                <p className="text-sm font-medium text-amber-400">G-Drive File Linked</p>
                                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">ID: {currentUI.google_file_id.slice(0, 8)}...</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-sm font-medium text-gray-400">Upload Source File</p>
                                                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">ZIP, RAR, 7Z, PDF</p>
                                            </>
                                        )}
                                    </div>
                                    <div className="px-4 py-2 bg-white/5 rounded-lg text-xs font-bold text-white uppercase tracking-wider group-hover:bg-white/10 transition-colors">
                                        {files.uiFile || currentUI.google_file_id ? 'Change' : 'Browse'}
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}

                    {(isAddOpen || isEditOpen) && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-xs text-gray-400 font-bold uppercase tracking-widest pl-1">Showcase Gallery (Max 3)</label>
                                <span className="text-[10px] text-zinc-600 font-bold uppercase">
                                    {Math.max(previews.showcase.length, (currentUI.showcase?.length || 0))}/3 Images
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {[0, 1, 2].map((idx) => {
                                    const preview = previews.showcase[idx];
                                    const existing = currentUI.showcase && currentUI.showcase[idx];
                                    const displayUrl = preview || existing;

                                    return (
                                        <div key={idx} className="relative group aspect-square">
                                            {displayUrl ? (
                                                <div className="w-full h-full relative rounded-2xl overflow-hidden border border-white/10 shadow-lg group-hover:border-indigo-500/30 transition-all">
                                                    <img src={displayUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            id={`showcase-change-${idx}`}
                                                            onChange={e => {
                                                                if (e.target.files && e.target.files[0]) {
                                                                    const file = e.target.files[0];
                                                                    setFiles(prev => {
                                                                        const newShowcase = [...prev.showcase];
                                                                        newShowcase[idx] = file;
                                                                        return { ...prev, showcase: newShowcase };
                                                                    });
                                                                    setPreviews(prev => {
                                                                        const newShowcase = [...prev.showcase];
                                                                        newShowcase[idx] = URL.createObjectURL(file);
                                                                        return { ...prev, showcase: newShowcase };
                                                                    });
                                                                }
                                                            }}
                                                        />
                                                        <label
                                                            htmlFor={`showcase-change-${idx}`}
                                                            className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500 hover:text-white transition-all cursor-pointer transform hover:scale-110"
                                                            title="Replace Image"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7l3.181 3.182m-4.722 4.99v-4.99m0 0h-4.992m4.993 0l-3.181-3.181a8.25 8.25 0 00-13.803 3.7l3.181-3.182m.051-4.99V7.042m0 0h4.992m-4.993 0l3.181-3.183a8.25 8.25 0 0013.803 3.7l3.181 3.182" />
                                                            </svg>
                                                        </label>
                                                        <button
                                                            onClick={() => {
                                                                const newFiles = [...files.showcase];
                                                                const newPreviews = [...previews.showcase];
                                                                const newShowcase = currentUI.showcase ? [...currentUI.showcase] : [];

                                                                if (preview) {
                                                                    newFiles.splice(idx, 1);
                                                                    newPreviews.splice(idx, 1);
                                                                } else {
                                                                    newShowcase.splice(idx, 1);
                                                                    setCurrentUI({ ...currentUI, showcase: newShowcase });
                                                                }

                                                                setFiles(prev => ({ ...prev, showcase: newFiles }));
                                                                setPreviews(prev => ({ ...prev, showcase: newPreviews }));
                                                            }}
                                                            className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all transform hover:scale-110"
                                                            title="Remove Image"
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
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        id={`showcase-${idx}`}
                                                        onChange={e => {
                                                            if (e.target.files && e.target.files[0]) {
                                                                const file = e.target.files[0];
                                                                setFiles(prev => {
                                                                    const newShowcase = [...prev.showcase];
                                                                    newShowcase[idx] = file;
                                                                    return { ...prev, showcase: newShowcase };
                                                                });
                                                                setPreviews(prev => {
                                                                    const newShowcase = [...prev.showcase];
                                                                    newShowcase[idx] = URL.createObjectURL(file);
                                                                    return { ...prev, showcase: newShowcase };
                                                                });
                                                            }
                                                        }}
                                                    />
                                                    <label
                                                        htmlFor={`showcase-${idx}`}
                                                        className="flex flex-col items-center justify-center w-full h-full rounded-2xl border-2 border-dashed border-white/5 bg-white/2 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all cursor-pointer group/item ring-offset-black focus-within:ring-2 focus-within:ring-indigo-500/50"
                                                    >
                                                        <div className="p-2 rounded-lg bg-zinc-900 group-hover/item:bg-indigo-500/20 transition-colors">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-zinc-500 group-hover/item:text-indigo-400">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-2 group-hover/item:text-zinc-400">Add</span>
                                                    </label>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    <input
                        placeholder="Author Name"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-rose-500 outline-none"
                        value={currentUI.author || ''}
                        onChange={e => setCurrentUI({ ...currentUI, author: e.target.value })}
                    />

                    <textarea
                        placeholder="Details Overview"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-zinc-500 outline-none h-32 resize-none"
                        value={currentUI.overview || ''}
                        onChange={e => setCurrentUI({ ...currentUI, overview: e.target.value })}
                    />

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs text-gray-400 font-bold uppercase tracking-widest pl-1">Specifications</label>
                            <button
                                onClick={() => {
                                    const defaultSpecs = [
                                        { label: "Total Screens", value: "125+", desc: "Mobile & iOS screens included" },
                                        { label: "File Format", value: "Figma", desc: ".fig source file included" },
                                        { label: "Vector", value: "100%", desc: "Fully scalable & editable" },
                                        { label: "Updates", value: "Lifetime", desc: "Free future updates included" }
                                    ];
                                    setCurrentUI({ ...currentUI, specifications: defaultSpecs });
                                }}
                                className="text-[10px] bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-lg transition-colors uppercase font-bold tracking-wider"
                            >
                                Reset Defaults
                            </button>
                        </div>
                        <div className="space-y-3">
                            {(currentUI.specifications && Array.isArray(currentUI.specifications) ? currentUI.specifications : []).map((spec: any, idx: number) => (
                                <div key={idx} className="flex flex-col gap-2 p-3 rounded-xl bg-black/30 border border-white/5 relative group">
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            placeholder="Label (e.g. Total Screens)"
                                            className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                                            value={spec.label}
                                            onChange={(e) => {
                                                const newSpecs = [...(currentUI.specifications || [])];
                                                newSpecs[idx] = { ...spec, label: e.target.value };
                                                setCurrentUI({ ...currentUI, specifications: newSpecs });
                                            }}
                                        />
                                        <input
                                            placeholder="Value (e.g. 100+)"
                                            className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                                            value={spec.value}
                                            onChange={(e) => {
                                                const newSpecs = [...(currentUI.specifications || [])];
                                                newSpecs[idx] = { ...spec, value: e.target.value };
                                                setCurrentUI({ ...currentUI, specifications: newSpecs });
                                            }}
                                        />
                                    </div>
                                    <input
                                        placeholder="Description"
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-400 focus:border-indigo-500 outline-none"
                                        value={spec.desc}
                                        onChange={(e) => {
                                            const newSpecs = [...(currentUI.specifications || [])];
                                            newSpecs[idx] = { ...spec, desc: e.target.value };
                                            setCurrentUI({ ...currentUI, specifications: newSpecs });
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            const newSpecs = (currentUI.specifications || []).filter((_: any, i: number) => i !== idx);
                                            setCurrentUI({ ...currentUI, specifications: newSpecs });
                                        }}
                                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    const newSpecs = [...(currentUI.specifications || []), { label: "", value: "", desc: "" }];
                                    setCurrentUI({ ...currentUI, specifications: newSpecs });
                                }}
                                className="w-full py-2 border border-dashed border-white/10 rounded-xl text-xs font-bold text-zinc-500 hover:text-white hover:bg-white/5 transition-all uppercase tracking-wider"
                            >
                                + Add Specification
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-xs text-gray-400 font-bold uppercase tracking-widest pl-1">Highlights</label>
                            <button
                                onClick={() => {
                                    const newHighlights = [...(currentUI.highlights || []), ""];
                                    setCurrentUI({ ...currentUI, highlights: newHighlights });
                                }}
                                className="text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded-lg transition-colors uppercase font-bold tracking-wider"
                            >
                                + Add Item
                            </button>
                        </div>
                        <div className="space-y-2">
                            {(currentUI.highlights && Array.isArray(currentUI.highlights) ? currentUI.highlights : []).map((highlight, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input
                                        placeholder={`Highlight #${idx + 1}`}
                                        className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none"
                                        value={highlight}
                                        onChange={(e) => {
                                            const newHighlights = [...(currentUI.highlights || [])];
                                            newHighlights[idx] = e.target.value;
                                            setCurrentUI({ ...currentUI, highlights: newHighlights });
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            const newHighlights = (currentUI.highlights || []).filter((_, i) => i !== idx);
                                            setCurrentUI({ ...currentUI, highlights: newHighlights });
                                        }}
                                        className="px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/10 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                            {(!currentUI.highlights || currentUI.highlights.length === 0) && (
                                <div className="text-center py-4 border border-dashed border-white/10 rounded-xl text-gray-600 text-xs">
                                    No highlights added yet. Click "+ Add Item" to start.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-8">
                    <button onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }} className="px-6 py-2 text-gray-400 hover:text-white">Cancel</button>
                    <button onClick={handleSave} className="px-8 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20">
                        {isAddOpen ? 'Deploy System' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardModals;

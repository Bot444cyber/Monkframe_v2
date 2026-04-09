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
                <div className="space-y-4">

                    {/* Title */}
                    <input
                        placeholder="Title"
                        className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus:border-blue-600 outline-none"
                        value={currentUI.title || ''}
                        onChange={e => setCurrentUI({ ...currentUI, title: e.target.value })}
                    />

                    {/* Description */}
                    <textarea
                        placeholder="Description"
                        className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus:border-blue-600 outline-none h-24 resize-none"
                        value={currentUI.overview || ''}
                        onChange={e => setCurrentUI({ ...currentUI, overview: e.target.value })}
                    />

                    {/* Category */}
                    <input
                        placeholder="Category"
                        className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus:border-blue-600 outline-none"
                        value={currentUI.category || ''}
                        onChange={e => setCurrentUI({ ...currentUI, category: e.target.value })}
                    />

                    {/* Assets — file upload (Add mode only) */}
                    {isAddOpen && (
                        <div className="space-y-2">
                            <label className="text-xs text-muted-foreground font-bold uppercase tracking-widest pl-1">Assets</label>
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
                                    className={`flex items-center gap-4 w-full p-4 rounded-xl border cursor-pointer transition-all ${files.uiFile ? 'bg-blue-600/10 border-blue-600/50' : 'bg-secondary border-border hover:bg-secondary/80'
                                        }`}
                                >
                                    <div className={`p-3 rounded-lg ${files.uiFile ? 'bg-blue-600/20 text-blue-600' : 'bg-secondary text-muted-foreground'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {files.uiFile ? (
                                            <>
                                                <p className="text-sm font-bold text-foreground truncate max-w-[180px]">{files.uiFile.name}</p>
                                                <p className="text-[10px] text-blue-600 font-medium">{(files.uiFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-sm font-medium text-muted-foreground">Upload Source File</p>
                                                <p className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-wider">ZIP, RAR, 7Z, PDF</p>
                                            </>
                                        )}
                                    </div>
                                    <div className="px-4 py-2 bg-secondary rounded-lg text-xs font-bold text-foreground uppercase tracking-wider">
                                        {files.uiFile ? 'Change' : 'Browse'}
                                    </div>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Additional Information */}
                    <input
                        placeholder="Additional Information"
                        className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus:border-blue-600 outline-none"
                        value={currentUI.author || ''}
                        onChange={e => setCurrentUI({ ...currentUI, author: e.target.value })}
                    />

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

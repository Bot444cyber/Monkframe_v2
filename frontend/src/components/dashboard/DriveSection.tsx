"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { googleDriveService } from '@/services/googleDrive.service';
import toast from 'react-hot-toast';
import DashboardTableSkeleton from './DashboardTableSkeleton';

export default function DriveSection() {
    const [files, setFiles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editingFileId, setEditingFileId] = useState<string | null>(null);
    const [newName, setNewName] = useState('');
    const [storageUsage, setStorageUsage] = useState<{ totalSizeBytes: number; totalSizeHuman: string } | null>(null);

    // Pagination
    const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined);
    const [tokenHistory, setTokenHistory] = useState<(string | undefined)[]>([]);
    const [pageSize] = useState(20);

    // Multi-select
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const fetchData = useCallback(async (token?: string, pushHistory: boolean = true) => {
        setIsLoading(true);
        try {
            const [filesData, usageData] = await Promise.all([
                googleDriveService.listFiles(pageSize, token),
                googleDriveService.getStorageUsage()
            ]);

            if (filesData.status) {
                setFiles(filesData.data || []);
                setNextPageToken(filesData.nextPageToken);
                if (pushHistory) setTokenHistory(prev => [...prev, token]);
            } else {
                toast.error(filesData.message || "Failed to fetch files");
            }

            if (usageData.status) {
                setStorageUsage(usageData.data);
            }
        } catch (error) {
            console.error("Fetch data error", error);
            toast.error("Failed to connect to Google Drive API");
        } finally {
            setIsLoading(false);
        }
    }, [pageSize]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleNextPage = () => {
        if (nextPageToken) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            fetchData(nextPageToken);
        }
    };

    const handlePrevPage = () => {
        if (tokenHistory.length > 1) {
            const newHistory = [...tokenHistory];
            newHistory.pop(); // Remove current token
            const prevToken = newHistory[newHistory.length - 1];
            setTokenHistory(newHistory);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            fetchData(prevToken, false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const loadingToast = toast.loading(`Uploading ${file.name}...`);
        try {
            const data = await googleDriveService.uploadFile(file);
            if (data.status) {
                toast.success("File uploaded successfully", { id: loadingToast });
                // Refresh data to show new file and update usage
                const currentToken = tokenHistory[tokenHistory.length - 1];
                fetchData(currentToken, false);
            } else {
                toast.error(data.message || "Upload failed", { id: loadingToast });
            }
        } catch (error) {
            console.error("Upload error", error);
            toast.error("An error occurred during upload", { id: loadingToast });
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    const handleDelete = async (fileId: string, fileName: string) => {
        if (!confirm(`Are you sure you want to delete "${fileName}"?`)) return;

        const loadingToast = toast.loading(`Deleting ${fileName}...`);
        try {
            const data = await googleDriveService.deleteFile(fileId);
            if (data.status) {
                toast.success("File deleted successfully", { id: loadingToast });
                setFiles(files.filter(f => f.id !== fileId));
                fetchUsage(); // Update usage stats
            } else {
                toast.error(data.message || "Delete failed", { id: loadingToast });
            }
        } catch (error) {
            console.error("Delete error", error);
            toast.error("An error occurred", { id: loadingToast });
        }
    };

    const handleBulkDelete = async () => {
        const count = selectedIds.size;
        if (!confirm(`Are you sure you want to delete ${count} selected files?`)) return;

        setIsDeleting(true);
        const loadingToast = toast.loading(`Deleting ${count} files...`);
        try {
            const data = await googleDriveService.bulkDelete(Array.from(selectedIds));
            if (data.status) {
                toast.success(data.message, { id: loadingToast });
                setSelectedIds(new Set());
                const currentToken = tokenHistory[tokenHistory.length - 1];
                fetchData(currentToken, false);
            } else {
                toast.error(data.message || "Bulk delete failed", { id: loadingToast });
            }
        } catch (error) {
            console.error("Bulk delete error", error);
            toast.error("An error occurred during bulk deletion", { id: loadingToast });
        } finally {
            setIsDeleting(false);
        }
    };

    const fetchUsage = async () => {
        try {
            const data = await googleDriveService.getStorageUsage();
            if (data.status) setStorageUsage(data.data);
        } catch (e) { console.error(e); }
    };

    const handleRename = async (fileId: string) => {
        if (!newName.trim()) return;

        const loadingToast = toast.loading(`Renaming file...`);
        try {
            const data = await googleDriveService.renameFile(fileId, newName);
            if (data.status) {
                toast.success("File renamed successfully", { id: loadingToast });
                setFiles(files.map(f => f.id === fileId ? { ...f, name: data.data.name } : f));
                setEditingFileId(null);
                setNewName('');
            } else {
                toast.error(data.message || "Rename failed", { id: loadingToast });
            }
        } catch (error) {
            console.error("Rename error", error);
            toast.error("An error occurred", { id: loadingToast });
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === files.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(files.map(f => f.id)));
        }
    };

    const toggleSelect = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const formatSize = (bytes: string) => {
        if (!bytes) return '—';
        const b = parseInt(bytes);
        if (b === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(b) / Math.log(k));
        return parseFloat((b / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-foreground tracking-tight">Drive Storage</h2>
                    <p className="text-muted-foreground mt-1">Real-time management for your cloud assets</p>
                </div>

                <div className="flex items-center gap-3">
                    {selectedIds.size > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            disabled={isDeleting}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-all border border-rose-500/20 active:scale-95 disabled:opacity-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                            Delete {selectedIds.size} Selected
                        </button>
                    )}

                    <label className={`relative flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-black text-xs uppercase tracking-[0.15em] cursor-pointer hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-600/30 active:scale-95 ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        {isUploading ? 'Deploying...' : 'Upload Asset'}
                        <input type="file" className="hidden" onChange={handleUpload} disabled={isUploading} />
                    </label>
                </div>
            </div>

            {/* Storage Usage Widget */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 md:col-span-2 bg-card/50 border border-border/50 rounded-3xl p-6 backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-blue-600/10 transition-all duration-700"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-foreground">Cloud Consumption</h3>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Real-time status</p>
                            </div>
                        </div>
                        <span className="text-xl font-black text-foreground">{storageUsage?.totalSizeHuman || '0 B'}</span>
                    </div>

                    <div className="w-full h-2 bg-secondary/50 rounded-full overflow-hidden relative mb-2">
                        <div
                            className="h-full bg-linear-to-r from-blue-600/80 to-blue-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                            style={{ width: storageUsage ? '100%' : '0%' }} // Note: Google doesn't give a 'total' limit for a folder easily, so we just show growth
                        ></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                        <span>Total folder volume</span>
                        <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                            <span>Linked & Standalone assets</span>
                        </div>
                    </div>
                </div>

                <div className="bg-card/50 border border-border/50 rounded-3xl p-6 backdrop-blur-sm flex flex-col justify-center items-center text-center">
                    <span className="text-3xl font-black text-blue-600 leading-none mb-1">{files.length}</span>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Files on this page</span>
                    <div className="mt-4 flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-card bg-secondary/80 flex items-center justify-center">
                                <span className="w-3 h-3 bg-blue-600/30 rounded-full"></span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Table Container */}
            <div className="bg-card border border-border/50 rounded-[2rem] overflow-hidden shadow-2xl relative">
                {isLoading ? (
                    <div className="p-6">
                        <DashboardTableSkeleton columns={5} rows={4} />
                    </div>
                ) : (
                    <>

                        <div className="overflow-x-auto min-h-[400px]">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border/50 bg-secondary/20">
                                        <th className="px-6 py-5 w-12 text-center">
                                            <div className="flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    checked={files.length > 0 && selectedIds.size === files.length}
                                                    onChange={toggleSelectAll}
                                                    className="w-4 h-4 rounded border-border/50 bg-background text-blue-600 focus:ring-blue-600/50 cursor-pointer"
                                                />
                                            </div>
                                        </th>
                                        <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Asset Name</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Size</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Modified</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/20">
                                    {files.length === 0 && !isLoading ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-32 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-20 h-20 rounded-[2rem] bg-secondary/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                                        <svg className="w-10 h-10 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-lg font-bold text-foreground">Drive Folder Empty</h3>
                                                    <p className="text-sm text-muted-foreground mt-1 max-w-[250px]">Upload your first asset to see it appear here in real-time.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        files.map((file) => (
                                            <tr
                                                key={file.id}
                                                className={`group/row hover:bg-blue-600/[0.02] transition-colors duration-300 ${selectedIds.has(file.id) ? 'bg-blue-600/[0.03]' : ''}`}
                                            >
                                                <td className="px-6 py-4 w-12 text-center pointer-events-auto">
                                                    <div className="flex items-center justify-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedIds.has(file.id)}
                                                            onChange={() => toggleSelect(file.id)}
                                                            className="w-4 h-4 rounded border-border/50 bg-background text-blue-600 focus:ring-blue-600/50 cursor-pointer"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center group-hover/row:scale-110 transition-transform">
                                                            {file.iconLink ? (
                                                                <img src={file.iconLink} alt="" className="w-5 h-5 opacity-80" />
                                                            ) : (
                                                                <svg className="w-5 h-5 text-blue-600/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                                </svg>
                                                            )}
                                                        </div>

                                                        {editingFileId === file.id ? (
                                                            <div className="flex items-center gap-2 flex-1 max-w-sm">
                                                                <input
                                                                    type="text"
                                                                    value={newName}
                                                                    onChange={(e) => setNewName(e.target.value)}
                                                                    className="bg-background border border-blue-600/30 rounded-lg px-3 py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/20 w-full shadow-inner"
                                                                    autoFocus
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') handleRename(file.id);
                                                                        if (e.key === 'Escape') setEditingFileId(null);
                                                                    }}
                                                                />
                                                                <button
                                                                    onClick={() => handleRename(file.id)}
                                                                    className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-black text-foreground group-hover/row:text-blue-600 transition-colors truncate max-w-[200px] md:max-w-xs">
                                                                    {file.name}
                                                                </span>
                                                                <span className="text-[10px] text-muted-foreground font-bold tracking-tight opacity-0 group-hover/row:opacity-100 transition-opacity">
                                                                    Mime: {file.mimeType?.split('/').pop()?.toUpperCase() || 'UNKNOWN'}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2.5 py-1 rounded-lg bg-secondary/50 text-[11px] font-black text-foreground/80 border border-border/10">
                                                        {formatSize(file.size)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-foreground/80">
                                                            {new Date(file.modifiedTime).toLocaleDateString()}
                                                        </span>
                                                        <span className="text-[10px] font-medium text-muted-foreground uppercase opacity-0 group-hover/row:opacity-100 transition-opacity">
                                                            {new Date(file.modifiedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover/row:opacity-100 transition-all scale-95 group-hover/row:scale-100">
                                                        <a
                                                            href={file.webViewLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            title="View Original"
                                                            className="p-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-600/10 rounded-xl transition-all"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                        </a>
                                                        <button
                                                            onClick={() => { setEditingFileId(file.id); setNewName(file.name); }}
                                                            title="Rename Asset"
                                                            className="p-2 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-600/10 rounded-xl transition-all"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(file.id, file.name)}
                                                            title="Delete Permanently"
                                                            className="p-2 text-muted-foreground hover:text-rose-600 hover:bg-rose-600/10 rounded-xl transition-all"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        <div className="px-8 py-5 border-t border-border/50 bg-secondary/10 flex items-center justify-between">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">
                                Page {tokenHistory.length} of {nextPageToken ? 'Many' : tokenHistory.length}
                            </p>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={tokenHistory.length <= 1 || isLoading}
                                    className="p-2.5 rounded-xl bg-card border border-border shadow-sm text-foreground hover:bg-secondary disabled:opacity-30 disabled:pointer-events-none transition-all"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                </button>
                                <button
                                    onClick={handleNextPage}
                                    disabled={!nextPageToken || isLoading}
                                    className="p-2.5 rounded-xl bg-card border border-border shadow-sm text-foreground hover:bg-secondary disabled:opacity-30 disabled:pointer-events-none transition-all"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

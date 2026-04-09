"use client";
import React, { useState, useEffect } from 'react';
import { googleDriveService } from '@/services/googleDrive.service';
import toast from 'react-hot-toast';

export default function DriveSection() {
    const [files, setFiles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [editingFileId, setEditingFileId] = useState<string | null>(null);
    const [newName, setNewName] = useState('');

    const fetchFiles = async () => {
        setIsLoading(true);
        try {
            const data = await googleDriveService.listFiles();
            if (data.status) {
                setFiles(data.data || []);
            } else {
                toast.error(data.message || "Failed to fetch files");
            }
        } catch (error) {
            console.error("Fetch files error", error);
            toast.error("Failed to fetch files from Google Drive");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const loadingToast = toast.loading(`Uploading ${file.name}...`);
        try {
            const data = await googleDriveService.uploadFile(file);
            if (data.status) {
                toast.success("File uploaded successfully", { id: loadingToast });
                fetchFiles();
            } else {
                toast.error(data.message || "Upload failed", { id: loadingToast });
            }
        } catch (error) {
            console.error("Upload error", error);
            toast.error("An error occurred during upload", { id: loadingToast });
        } finally {
            setIsUploading(false);
            // Reset input
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
            } else {
                toast.error(data.message || "Delete failed", { id: loadingToast });
            }
        } catch (error) {
            console.error("Delete error", error);
            toast.error("An error occurred", { id: loadingToast });
        }
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

    const formatSize = (bytes: string) => {
        if (!bytes) return '—';
        const b = parseInt(bytes);
        if (b === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(b) / Math.log(k));
        return parseFloat((b / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (isLoading && files.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-muted-foreground font-medium">Loading Drive Assets...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-foreground tracking-tight">Drive Storage</h2>
                    <p className="text-sm text-muted-foreground mt-1">Manage files in your linked Google Drive folder</p>
                </div>

                <label className={`relative flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm uppercase tracking-widest cursor-pointer hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-600/20 active:scale-95 ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    {isUploading ? 'Uploading...' : 'Upload File'}
                    <input type="file" className="hidden" onChange={handleUpload} disabled={isUploading} />
                </label>
            </div>

            <div className="relative group/table bg-card border border-border/50 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border/50 bg-secondary/30">
                                <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">File Name</th>
                                <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Size</th>
                                <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Last Modified</th>
                                <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {files.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
                                                <svg className="w-8 h-8 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <p className="text-muted-foreground font-medium">No files found in the specified folder.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                files.map((file) => (
                                    <tr key={file.id} className="group/row hover:bg-secondary/20 transition-all duration-300">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {file.iconLink ? (
                                                    <img src={file.iconLink} alt="" className="w-5 h-5 opacity-70 group-hover/row:opacity-100 transition-opacity" />
                                                ) : (
                                                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                    </svg>
                                                )}

                                                {editingFileId === file.id ? (
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <input
                                                            type="text"
                                                            value={newName}
                                                            onChange={(e) => setNewName(e.target.value)}
                                                            className="bg-background border border-border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full"
                                                            autoFocus
                                                        />
                                                        <button
                                                            onClick={() => handleRename(file.id)}
                                                            className="p-1 text-emerald-500 hover:bg-emerald-500/10 rounded"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingFileId(null)}
                                                            className="p-1 text-rose-500 hover:bg-rose-500/10 rounded"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm font-bold text-foreground group-hover/row:translate-x-1 transition-transform inline-block">
                                                        {file.name}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                                                {formatSize(file.size)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                {new Date(file.modifiedTime).toLocaleDateString()} {new Date(file.modifiedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity translate-x-4 group-hover/row:translate-x-0 transition-transform">
                                                <a
                                                    href={file.webViewLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-600/10 rounded-xl transition-all"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                    </svg>
                                                </a>
                                                <button
                                                    onClick={() => { setEditingFileId(file.id); setNewName(file.name); }}
                                                    className="p-2 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-600/10 rounded-xl transition-all"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(file.id, file.name)}
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
            </div>
        </div>
    );
}

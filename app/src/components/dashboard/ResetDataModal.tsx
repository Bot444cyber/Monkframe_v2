
import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

interface ResetDataModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ResetDataModal: React.FC<ResetDataModalProps> = ({ isOpen, onClose }) => {
    const [confirmText, setConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
    const logsEndRef = useRef<HTMLDivElement>(null);

    const [targets, setTargets] = useState({
        uis: false,
        users: false,
        payments: false,
        social: false,
        notifications: false
    });

    // Auto-scroll terminal
    useEffect(() => {
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [terminalLogs]);

    const isAllSelected = Object.values(targets).every(v => v);

    const toggleAll = () => {
        const newValue = !isAllSelected;
        setTargets({
            uis: newValue,
            users: newValue,
            payments: newValue,
            social: newValue,
            notifications: newValue
        });
    };

    const toggleTarget = (key: keyof typeof targets) => {
        setTargets(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (!isOpen) return null;

    const addLog = (msg: string) => {
        setTerminalLogs(prev => [...prev, `> ${msg}`]);
    };

    const handleReset = async () => {
        if (confirmText !== 'DELETE') return;
        if (!Object.values(targets).some(v => v)) {
            toast.error("Please select at least one data category to reset.");
            return;
        }

        setIsDeleting(true);
        setTerminalLogs(['INITIALIZING RESET...', 'CONNECTING TO DATABASE...']);

        // Simulation of "work" before the actual API call
        await new Promise(r => setTimeout(r, 800));
        addLog('VERIFYING PERMISSIONS... [OK]');
        await new Promise(r => setTimeout(r, 600));

        if (targets.uis) {
            addLog('LOCATING LINKED DRIVE FILES...');
            await new Promise(r => setTimeout(r, 500));
        }

        addLog('STARTING DELETION PROCESS...');

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000';
            const token = localStorage.getItem('auth_token');
            const headers: any = {
                'Content-Type': 'application/json'
            };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            // Actual call
            const res = await fetch(`${apiUrl}/api/admin/reset`, {
                method: 'DELETE',
                headers,
                body: JSON.stringify({ options: { ...targets, drive: targets.uis } })
            });
            const data = await res.json();

            if (data.status) {
                addLog('DELETION COMPLETE.');
                addLog('SYSTEM CLEAN.');
                addLog('REFRESHING DASHBOARD...');

                setTimeout(() => {
                    toast.success("Reset Successful");
                    onClose();
                    window.location.reload();
                }, 2000);
            } else {
                addLog(`ERROR: ${data.message || 'Operation Failed'}`);
                addLog('STOPPING...');
                toast.error(data.message || "Reset failed");
                setTimeout(() => setIsDeleting(false), 2000);
            }
        } catch (error) {
            console.error("Reset error", error);
            addLog('FATAL: NETWORK ERROR.');
            toast.error("An error occurred");
            setTimeout(() => setIsDeleting(false), 2000);
        }
    };

    const categories = [
        { id: 'uis', label: 'Products & Inventory', desc: 'All products, files, and images.', icon: '📦' },
        { id: 'users', label: 'Users & Accounts', desc: 'Registered user profiles (exc. Admin).', icon: '👥' },
        { id: 'payments', label: 'Transactions', desc: 'Payments and order history.', icon: '💳' },
        { id: 'social', label: 'Community Data', desc: 'Comments, likes, and wishlists.', icon: '💬' },
        { id: 'notifications', label: 'Activity Logs', desc: 'System alerts and notifications.', icon: '🔔' },
    ];

    // TERMINAL VIEW
    if (isDeleting) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 font-mono">
                <div className="w-full max-w-3xl p-8 border border-rose-900/30 bg-black rounded-lg shadow-[0_0_50px_rgba(225,29,72,0.1)] relative overflow-hidden">
                    {/* Scanline */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 pointer-events-none bg-[length:100%_2px,3px_100%] pointer-events-none" />

                    <div className="flex justify-between items-center border-b border-rose-900/50 pb-4 mb-6">
                        <span className="text-rose-500 font-bold tracking-widest animate-pulse">SYSTEM RESET IN PROGRESS</span>
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
                        </div>
                    </div>

                    <div className="h-64 overflow-y-auto space-y-2 font-bold text-sm custom-scrollbar relative z-10">
                        {terminalLogs.map((log, i) => (
                            <div key={i} className={`${log.includes('ERROR') || log.includes('FATAL') ? 'text-red-500' : 'text-rose-400/80'}`}>
                                {log}
                            </div>
                        ))}
                        <div ref={logsEndRef} />
                        <div className="text-rose-500 animate-pulse">_</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <div className="bg-[#050505] border border-zinc-800 rounded-lg w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in relative flex flex-col max-h-[90vh] ring-1 ring-white/5">

                {/* Hazard Header */}
                <div className="relative h-2 overflow-hidden w-full">
                    <div className="absolute inset-0 w-[200%] h-full animate-[slide_3s_linear_infinite] bg-[repeating-linear-gradient(45deg,#000,#000_10px,#b91c1c_10px,#b91c1c_20px)] opacity-50"></div>
                </div>

                {/* Header */}
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/20">
                    <div>
                        <h3 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
                            <span className="text-rose-500 text-3xl">☢</span> FACTORY RESET
                        </h3>
                        <p className="text-xs text-rose-500/80 mt-1 font-mono uppercase tracking-widest border border-rose-900/30 px-2 py-0.5 inline-block rounded bg-rose-950/20">Admin Authorization Required</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black">

                    {/* Master Toggle */}
                    <div className="flex items-center justify-between mb-8 p-5 rounded border border-rose-900/20 bg-rose-950/5 group hover:border-rose-900/40 transition-colors">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-rose-100 font-mono tracking-wide">SELECT ALL DATA</span>
                            <span className="text-xs text-rose-500/60 mt-1">Selects all categories for deletion.</span>
                        </div>
                        <button
                            onClick={toggleAll}
                            className={`w-6 h-6 border-2 flex items-center justify-center transition-all ${isAllSelected ? 'border-rose-500 bg-rose-500' : 'border-zinc-700 hover:border-rose-500/50'}`}
                        >
                            {isAllSelected && <svg className="w-4 h-4 text-black font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                        </button>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {categories.map((cat) => (
                            <div
                                key={cat.id}
                                onClick={() => toggleTarget(cat.id as keyof typeof targets)}
                                className={`relative group p-4 border transition-all duration-200 cursor-pointer overflow-hidden ${targets[cat.id as keyof typeof targets]
                                    ? 'bg-rose-950/10 border-rose-500/50 shadow-[0_0_15px_rgba(225,29,72,0.1)]'
                                    : 'bg-zinc-900/20 border-white/5 hover:border-white/10 hover:bg-zinc-900/40'
                                    }`}
                            >
                                <div className="relative z-10 flex items-start gap-4">
                                    <div className={`w-10 h-10 flex items-center justify-center text-xl transition-colors ${targets[cat.id as keyof typeof targets] ? 'text-rose-500' : 'text-zinc-600 grayscale'}`}>
                                        {cat.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`text-xs font-bold font-mono tracking-wider mb-1 ${targets[cat.id as keyof typeof targets] ? 'text-rose-400' : 'text-zinc-400'}`}>
                                            {cat.label}
                                        </h4>
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-wide">
                                            {cat.desc}
                                        </p>

                                        {/* Linked Cloud Storage Badge - Only for UIS */}
                                        {cat.id === 'uis' && targets.uis && (
                                            <div className="flex items-center gap-2 mt-2 animate-pulse">
                                                <div className="w-px h-3 bg-zinc-700"></div>
                                                <span className="text-[10px] font-mono text-cyan-500/80 flex items-center gap-1 border border-cyan-900/40 bg-cyan-950/20 px-1.5 rounded">
                                                    <span className="text-cyan-400">☁️</span> Google Drive Files
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {/* Indicator */}
                                    <div className={`w-3 h-3 border transition-colors ${targets[cat.id as keyof typeof targets] ? 'bg-rose-500 border-rose-500' : 'border-zinc-700'}`} />
                                </div>

                                {/* Active corner accent */}
                                {targets[cat.id as keyof typeof targets] && (
                                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-rose-500 opacity-50" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Danger Zone Confirmation */}
                    <div className="border-t border-white/5 pt-8">
                        <label className="block text-xs font-bold text-zinc-500 font-mono mb-3 flex items-center gap-2">
                            CONFIRMATION CODE: <span className="text-white bg-zinc-800 px-1 py-0.5 rounded">DELETE</span>
                        </label>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            className="w-full bg-black border border-white/10 px-6 py-4 text-white placeholder-zinc-800 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all font-mono text-lg tracking-widest text-center"
                            placeholder="Type DELETE to Unlock"
                            autoComplete="off"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-zinc-900/30 backdrop-blur-sm flex justify-between items-center">
                    <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider">
                        Secure System / v4.2.0
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 text-xs font-bold text-zinc-500 hover:text-white transition-colors font-mono tracking-wider"
                        >
                            CANCEL
                        </button>
                        <button
                            onClick={handleReset}
                            disabled={confirmText !== 'DELETE' || !Object.values(targets).some(v => v)}
                            className={`px-8 py-3 text-xs font-bold transition-all shadow-lg flex items-center gap-2 font-mono tracking-widest relative overflow-hidden group
                                ${confirmText === 'DELETE' && Object.values(targets).some(v => v)
                                    ? 'bg-rose-600 text-white hover:bg-rose-500 shadow-rose-900/30'
                                    : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}
                            `}
                        >
                            {confirmText === 'DELETE' && Object.values(targets).some(v => v) && (
                                <div className="absolute inset-0 w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)] opacity-20 pointer-events-none" />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <span className="text-lg">☢</span> DELETE DATA
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetDataModal;

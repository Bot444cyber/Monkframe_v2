"use client";

import { useState, useCallback } from "react";
import DeviceFrame, { DeviceDefinition } from "./DeviceFrames";

// Only keeping the custom podium config as requested
const DEVICE_CONFIGS: DeviceDefinition[] = [
    {
        id: "iphone-podium",
        name: "iPhone 14 (Podium 3D)",
        width: 1080,
        height: 1080,
        frameImage: "/mockups/iphone-podium.jpg",
        screenStyle: {
            top: "14.6%",
            left: "35.8%",
            width: "29.2%",
            height: "62.2%",
            borderRadius: "35px",
            transform: "rotate(-12.5deg) skewX(1deg) skewY(1deg)",
            zIndex: 20
        }
    }
];

export default function MockupGenerator() {
    const [selectedDevice, setSelectedDevice] = useState<DeviceDefinition>(DEVICE_CONFIGS[0]);
    const [image, setImage] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Controls Panel */}
            <div className="lg:col-span-4 space-y-8">
                {/* Upload Zone */}
                <div
                    className={`relative rounded-2xl border-2 border-dashed p-8 transition-all ${isDragging
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-white/10 hover:border-white/20 bg-white/5"
                        }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Upload Design</h3>
                        <p className="text-zinc-400 text-sm">Drag & drop or stick to browse</p>
                    </div>
                </div>

                {/* Device Selector */}
                <div className="space-y-4">
                    <h3 className="text-white font-medium">Select Device Template</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {DEVICE_CONFIGS.map((device) => (
                            <button
                                key={device.id}
                                onClick={() => setSelectedDevice(device)}
                                className={`p-4 rounded-xl border transition-all text-sm font-medium ${selectedDevice.id === device.id
                                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25"
                                    : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                {device.name}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-zinc-500">
                        * These use high-quality device frame overlays. Matches screen bounds automatically.
                    </p>
                </div>

                {/* Tips */}
                <div className="p-6 rounded-2xl bg-zinc-900 border border-white/5">
                    <h4 className="text-white font-medium mb-2">Pro Tip</h4>
                    <p className="text-zinc-500 text-sm">
                        Ensure your uploaded image matches the aspect ratio of the device for the best fit.
                    </p>
                </div>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-8 flex items-center justify-center min-h-[400px] lg:min-h-[600px] rounded-3xl bg-black/40 border border-white/5 p-8 relative overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
                {/* Pass the full config object */}
                <DeviceFrame definition={selectedDevice} userImage={image} />
            </div>
        </div>
    );
}




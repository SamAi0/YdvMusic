import React, { useRef, useState } from 'react';
import { Image, Check, X, Palette } from 'lucide-react';
import { useBackground, BG_PRESETS } from '../contexts/BackgroundContext';
import toast from 'react-hot-toast';

interface BackgroundSelectorProps {
    isOpen: boolean;
    onClose: () => void;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ isOpen, onClose }) => {
    const { currentBg, customImageUrl, setPreset, setCustomImage } = useBackground();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    if (!isOpen) return null;

    const handleImageFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Image must be under 10 MB');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const url = e.target?.result as string;
            setCustomImage(url);
            toast.success('Background updated! 🎨');
        };
        reader.readAsDataURL(file);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleImageFile(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleImageFile(file);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="fixed right-0 top-0 bottom-0 w-80 glass-dark border-l border-white/10 z-50 flex flex-col animate-slide-in-right">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                    <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                            <Palette className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-sm">Background</h2>
                            <p className="text-gray-500 text-xs">Choose your vibe</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
                    {/* Gradient Presets */}
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Themes</p>
                        <div className="grid grid-cols-4 gap-2">
                            {BG_PRESETS.map((preset) => {
                                const isActive = !customImageUrl && currentBg.id === preset.id;
                                return (
                                    <button
                                        key={preset.id}
                                        onClick={() => { setPreset(preset.id); toast.success(`Theme: ${preset.name}`); }}
                                        className="group relative flex flex-col items-center"
                                        title={preset.name}
                                    >
                                        <div
                                            className={`w-full aspect-square rounded-xl border-2 transition-all duration-200 ${isActive ? 'border-green-400 scale-95 shadow-lg shadow-green-500/30' : 'border-white/10 hover:border-white/30 hover:scale-95'
                                                }`}
                                            style={{ background: preset.preview }}
                                        >
                                            {isActive && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Check className="w-4 h-4 text-green-400" />
                                                </div>
                                            )}
                                        </div>
                                        <span className={`text-xs mt-1.5 transition-colors ${isActive ? 'text-green-400' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                            {preset.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Custom Image Upload */}
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Custom Image</p>

                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-300 ${isDragging
                                ? 'border-purple-400 bg-purple-500/10 scale-[1.02]'
                                : customImageUrl
                                    ? 'border-green-500/50 bg-green-500/5 hover:border-green-400/70'
                                    : 'border-gray-700 hover:border-gray-500 bg-white/3'
                                }`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileInput}
                            />
                            {customImageUrl ? (
                                <div className="space-y-2">
                                    <div className="w-full h-28 rounded-lg overflow-hidden mb-2">
                                        <img src={customImageUrl} alt="Custom bg" className="w-full h-full object-cover" />
                                    </div>
                                    <p className="text-green-400 text-xs font-medium">Custom background active</p>
                                    <p className="text-gray-600 text-xs">Click to change</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto">
                                        <Image className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <p className="text-gray-400 text-sm font-medium">Drop an image here</p>
                                    <p className="text-gray-600 text-xs">or click to browse · JPG, PNG, WEBP</p>
                                </div>
                            )}
                            {isDragging && (
                                <div className="absolute inset-0 rounded-xl border-2 border-purple-400 animate-ping opacity-40 pointer-events-none" />
                            )}
                        </div>

                        {customImageUrl && (
                            <button
                                onClick={() => { setCustomImage(null); setPreset('default'); toast.success('Background reset'); }}
                                className="mt-2 w-full flex items-center justify-center space-x-2 py-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs font-medium transition-colors"
                            >
                                <X className="w-3 h-3" />
                                <span>Remove Custom Background</span>
                            </button>
                        )}
                    </div>

                    {/* Tip */}
                    <div className="bg-white/3 border border-white/5 rounded-xl p-3">
                        <p className="text-gray-500 text-xs leading-relaxed">
                            💡 <strong className="text-gray-400">Tip:</strong> Dark photos with blurred subjects work best. Try a night city skyline or an abstract texture.
                        </p>
                    </div>
                </div>

                {/* Overlay opacity for custom images */}
                {customImageUrl && (
                    <div className="px-5 pb-5 border-t border-white/10 pt-4">
                        <p className="text-xs text-gray-500 mb-2">A dark overlay is applied automatically to keep text readable.</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default BackgroundSelector;

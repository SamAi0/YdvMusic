import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type BgPreset = {
    id: string;
    name: string;
    style: React.CSSProperties;
    preview: string; // CSS background shorthand for the thumbnail
};

export const BG_PRESETS: BgPreset[] = [
    {
        id: 'default',
        name: 'Midnight',
        style: { background: '#000000' },
        preview: '#000000',
    },
    {
        id: 'forest',
        name: 'Forest',
        style: { background: 'linear-gradient(135deg, #0d2b1a 0%, #071a0f 50%, #000 100%)' },
        preview: 'linear-gradient(135deg, #0d2b1a, #000)',
    },
    {
        id: 'ocean',
        name: 'Ocean',
        style: { background: 'linear-gradient(135deg, #0a1628 0%, #0e2244 40%, #000 100%)' },
        preview: 'linear-gradient(135deg, #0a1628, #0e2244)',
    },
    {
        id: 'sunset',
        name: 'Sunset',
        style: { background: 'linear-gradient(135deg, #1a0a1a 0%, #2d0b2d 40%, #1a0505 100%)' },
        preview: 'linear-gradient(135deg, #2d0b2d, #1a0505)',
    },
    {
        id: 'aurora',
        name: 'Aurora',
        style: { background: 'linear-gradient(135deg, #020d14 0%, #0a1a2a 30%, #0d1f1a 60%, #020d14 100%)' },
        preview: 'linear-gradient(135deg, #0a1a2a, #0d1f1a)',
    },
    {
        id: 'galaxy',
        name: 'Galaxy',
        style: { background: 'linear-gradient(135deg, #0a0010 0%, #1a0030 50%, #000010 100%)' },
        preview: 'linear-gradient(135deg, #1a0030, #000010)',
    },
    {
        id: 'amber',
        name: 'Amber',
        style: { background: 'linear-gradient(135deg, #1a0f00 0%, #2a1800 50%, #0d0800 100%)' },
        preview: 'linear-gradient(135deg, #2a1800, #0d0800)',
    },
    {
        id: 'rose',
        name: 'Rose',
        style: { background: 'linear-gradient(135deg, #1a0010 0%, #2d0820 50%, #0d0008 100%)' },
        preview: 'linear-gradient(135deg, #2d0820, #0d0008)',
    },
];

interface BackgroundContextType {
    currentBg: BgPreset;
    customImageUrl: string | null;
    setPreset: (id: string) => void;
    setCustomImage: (url: string | null) => void;
    getBgStyle: () => React.CSSProperties;
}

const BackgroundContext = createContext<BackgroundContextType>({
    currentBg: BG_PRESETS[0],
    customImageUrl: null,
    setPreset: () => { },
    setCustomImage: () => { },
    getBgStyle: () => ({}),
});

export const useBackground = () => useContext(BackgroundContext);

export const BackgroundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentBg, setCurrentBg] = useState<BgPreset>(BG_PRESETS[0]);
    const [customImageUrl, setCustomImageUrl] = useState<string | null>(null);

    // Load from localStorage
    useEffect(() => {
        const savedPresetId = localStorage.getItem('bg_preset');
        const savedImage = localStorage.getItem('bg_custom_image');
        if (savedPresetId) {
            const found = BG_PRESETS.find(p => p.id === savedPresetId);
            if (found) setCurrentBg(found);
        }
        if (savedImage) setCustomImageUrl(savedImage);
    }, []);

    const setPreset = (id: string) => {
        const found = BG_PRESETS.find(p => p.id === id);
        if (found) {
            setCurrentBg(found);
            setCustomImageUrl(null);
            localStorage.setItem('bg_preset', id);
            localStorage.removeItem('bg_custom_image');
        }
    };

    const setCustomImage = (url: string | null) => {
        setCustomImageUrl(url);
        if (url) {
            localStorage.setItem('bg_custom_image', url);
            localStorage.removeItem('bg_preset');
        } else {
            localStorage.removeItem('bg_custom_image');
        }
    };

    const getBgStyle = (): React.CSSProperties => {
        if (customImageUrl) {
            return {
                backgroundImage: `url(${customImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            };
        }
        return currentBg.style;
    };

    return (
        <BackgroundContext.Provider value={{ currentBg, customImageUrl, setPreset, setCustomImage, getBgStyle }}>
            {children}
        </BackgroundContext.Provider>
    );
};

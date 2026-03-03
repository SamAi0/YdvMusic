import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface KidsModeContextType {
    isKidsMode: boolean;
    isExitRequested: boolean;
    enterKidsMode: () => void;
    requestExitKidsMode: () => void;
    confirmExitKidsMode: () => void;
    cancelExitKidsMode: () => void;
}

const KidsModeContext = createContext<KidsModeContextType | undefined>(undefined);

export const KidsModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isKidsMode, setIsKidsMode] = useState(() => {
        const saved = localStorage.getItem('PlayMusic-kidsMode');
        return saved === 'true';
    });

    const [isExitRequested, setIsExitRequested] = useState(false);

    useEffect(() => {
        localStorage.setItem('PlayMusic-kidsMode', String(isKidsMode));

        // Optional: Add global class for styling overrides
        if (isKidsMode) {
            document.documentElement.classList.add('kids-mode-active');
        } else {
            document.documentElement.classList.remove('kids-mode-active');
        }
    }, [isKidsMode]);

    const enterKidsMode = () => setIsKidsMode(true);
    const requestExitKidsMode = () => setIsExitRequested(true);
    const confirmExitKidsMode = () => {
        setIsKidsMode(false);
        setIsExitRequested(false);
    };
    const cancelExitKidsMode = () => setIsExitRequested(false);

    return (
        <KidsModeContext.Provider value={{
            isKidsMode,
            isExitRequested,
            enterKidsMode,
            requestExitKidsMode,
            confirmExitKidsMode,
            cancelExitKidsMode
        }}>
            {children}
        </KidsModeContext.Provider>
    );
};

export const useKidsMode = () => {
    const context = useContext(KidsModeContext);
    if (!context) throw new Error('useKidsMode must be used within a KidsModeProvider');
    return context;
};

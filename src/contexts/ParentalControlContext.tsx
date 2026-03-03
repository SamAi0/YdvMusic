import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ParentalControlContextType {
    pin: string;
    setPin: (newPin: string) => void;
    verifyPin: (input: string) => boolean;
    contentFilterActive: boolean;
    toggleContentFilter: () => void;
}

const ParentalControlContext = createContext<ParentalControlContextType | undefined>(undefined);

export const ParentalControlProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [pin, setPinState] = useState(() => {
        return localStorage.getItem('PlayMusic-parentPin') || '1234';
    });

    const [contentFilterActive, setContentFilterActive] = useState(() => {
        return localStorage.getItem('PlayMusic-contentFilter') === 'true';
    });

    const setPin = (newPin: string) => {
        setPinState(newPin);
        localStorage.setItem('PlayMusic-parentPin', newPin);
    };

    const verifyPin = (input: string) => input === pin;

    const toggleContentFilter = () => {
        const newVal = !contentFilterActive;
        setContentFilterActive(newVal);
        localStorage.setItem('PlayMusic-contentFilter', String(newVal));
    };

    return (
        <ParentalControlContext.Provider value={{
            pin,
            setPin,
            verifyPin,
            contentFilterActive,
            toggleContentFilter
        }}>
            {children}
        </ParentalControlContext.Provider>
    );
};

export const useParentalControls = () => {
    const context = useContext(ParentalControlContext);
    if (!context) throw new Error('useParentalControls must be used within ParentalControlProvider');
    return context;
};

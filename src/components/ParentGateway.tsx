import React, { useState } from 'react';
import { useKidsMode } from '../contexts/KidsModeContext';
import { useParentalControls } from '../contexts/ParentalControlContext';
import { Shield, X } from 'lucide-react';

const ParentGateway: React.FC = () => {
    const { isExitRequested, confirmExitKidsMode, cancelExitKidsMode } = useKidsMode();
    const { verifyPin } = useParentalControls();
    const [inputPin, setInputPin] = useState('');
    const [error, setError] = useState(false);

    if (!isExitRequested) return null;

    const handleKeypadClick = (numStr: string) => {
        if (error) setError(false);
        if (inputPin.length < 4) {
            const newPin = inputPin + numStr;
            setInputPin(newPin);
            if (newPin.length === 4) {
                // Auto submit when 4 digits are entered
                if (verifyPin(newPin)) {
                    setError(false);
                    setInputPin('');
                    confirmExitKidsMode();
                } else {
                    setError(true);
                    setTimeout(() => setInputPin(''), 500); // Clear after tiny delay to show error state
                }
            }
        }
    };

    const handleDeleteClick = () => {
        if (error) setError(false);
        setInputPin(prev => prev.slice(0, -1));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white text-black p-8 rounded-3xl max-w-sm w-full mx-4 shadow-2xl relative">
                <button
                    onClick={cancelExitKidsMode}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Parent Gateway</h2>
                    <p className="text-gray-600 text-sm">Enter your PIN to exit Kids Mode.</p>
                    <p className="text-xs text-gray-400 mt-1">(Default PIN: 1234)</p>
                </div>

                <div className="space-y-6">
                    <div className="flex justify-center gap-3 mb-6">
                        {[0, 1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`w-12 h-12 rounded-xl flex items-center justify-center text-3xl transition-all ${error ? 'border-2 border-red-500 bg-red-50 text-red-500 animate-shake' :
                                        i < inputPin.length ? 'bg-blue-600 text-white shadow-inner scale-105' : 'bg-gray-100 border-2 border-gray-200'
                                    }`}
                            >
                                {i < inputPin.length ? '•' : ''}
                            </div>
                        ))}
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center -mt-4 mb-2 animate-bounce">
                            Incorrect PIN. Please try again.
                        </p>
                    )}

                    <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <button
                                key={num}
                                onClick={() => handleKeypadClick(num.toString())}
                                className="bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-800 font-bold text-2xl py-4 rounded-2xl transition-colors shadow-sm"
                            >
                                {num}
                            </button>
                        ))}
                        <button
                            onClick={() => { setInputPin(''); setError(false); }}
                            className="bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-500 font-bold text-lg py-4 rounded-2xl transition-colors shadow-sm flex items-center justify-center"
                        >
                            CLEAR
                        </button>
                        <button
                            onClick={() => handleKeypadClick('0')}
                            className="bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-800 font-bold text-2xl py-4 rounded-2xl transition-colors shadow-sm"
                        >
                            0
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            className="bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-600 font-bold text-xl py-4 rounded-2xl transition-colors shadow-sm flex items-center justify-center"
                        >
                            ⌫
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentGateway;

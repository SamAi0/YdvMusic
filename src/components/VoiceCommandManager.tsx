import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useKidsMode } from '../contexts/KidsModeContext';
import { useQueue } from '../contexts/QueueContext';
import toast from 'react-hot-toast';

// Extending Window for TypeScript compatibility with SpeechRecognition
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

const VoiceCommandManager: React.FC = () => {
    const { isKidsMode } = useKidsMode();
    const { next, previous } = useQueue();
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('Speech Recognition API not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false; // Listen for single commands
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            console.log('🗣️ Voice Command Heard:', transcript);

            if (transcript.includes('play')) {
                toast.success('Voice Command: Play 🎵');
                // If we had a global play/pause dispatcher we would call it here.
                // For demonstration, simulating play command via DOM or queue
                const audioEl = document.querySelector('audio');
                if (audioEl) audioEl.play().catch(() => { });
            } else if (transcript.includes('pause') || transcript.includes('stop')) {
                toast.success('Voice Command: Pause ⏸️');
                const audioEl = document.querySelector('audio');
                if (audioEl) audioEl.pause();
            } else if (transcript.includes('next')) {
                toast.success('Voice Command: Next Track ⏭️');
                next();
            } else if (transcript.includes('previous') || transcript.includes('back')) {
                toast.success('Voice Command: Previous Track ⏮️');
                previous();
            } else {
                toast('Command not recognized', { icon: '🤔' });
            }
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, [next, previous]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            toast.error('Voice commands not supported on this device.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            try {
                recognitionRef.current.start();
                setIsListening(true);
                toast('Listening... 🎤', { duration: 2000 });
            } catch (err) {
                console.error('Failed to start listening', err);
            }
        }
    };

    // Only show the prominent voice assistant button in Kids Mode
    if (!isKidsMode) return null;

    return (
        <button
            onClick={toggleListening}
            className={`fixed bottom-28 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center border-4 ${isListening
                    ? 'bg-red-500 border-white text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.6)]'
                    : 'bg-white border-blue-400 text-blue-500 shadow-[0_10px_20px_rgba(0,0,0,0.1)]'
                }`}
            title="Voice Commands"
        >
            {isListening ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8 opacity-70" />}
        </button>
    );
};

export default VoiceCommandManager;

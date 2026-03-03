import React, { useState, useEffect } from 'react';
import { Gamepad2, ArrowLeft, RefreshCw, Music } from 'lucide-react';
import { useAPI } from '../hooks/useAPI';

interface KidsGamesProps {
    setCurrentView: (view: string) => void;
}

const KidsGames: React.FC<KidsGamesProps> = ({ setCurrentView }) => {
    const [activeTab, setActiveTab] = useState<'menu' | 'memory' | 'beats'>('menu');
    const { songs } = useAPI();

    return (
        <div className="flex-1 bg-gradient-to-br from-blue-50 to-purple-50 p-6 md:p-8 overflow-y-auto">
            <div className="flex items-center space-x-4 mb-8">
                <button
                    onClick={() => activeTab === 'menu' ? setCurrentView('kids-home') : setActiveTab('menu')}
                    className="bg-white text-gray-700 p-3 rounded-2xl shadow-md hover:bg-gray-50 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500 flex items-center gap-3">
                    <Gamepad2 className="w-10 h-10 text-green-500" />
                    {activeTab === 'menu' ? 'Game Center' : activeTab === 'memory' ? 'Music Memory' : 'Beat Maker'}
                </h1>
            </div>

            {activeTab === 'menu' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
                    <button
                        onClick={() => setActiveTab('memory')}
                        className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 border-4 border-indigo-100 transition-all text-left relative overflow-hidden"
                    >
                        <div className="bg-indigo-100 text-indigo-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <RefreshCw className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-800 mb-2">Music Match</h2>
                        <p className="text-gray-500 font-semibold text-lg">Match the cover to the song!</p>
                        <RefreshCw className="absolute -bottom-6 -right-6 w-40 h-40 text-indigo-50 transform -rotate-12" />
                    </button>

                    <button
                        onClick={() => setActiveTab('beats')}
                        className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 border-4 border-pink-100 transition-all text-left relative overflow-hidden"
                    >
                        <div className="bg-pink-100 text-pink-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Music className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-800 mb-2">Beat Maker</h2>
                        <p className="text-gray-500 font-semibold text-lg">Create your own drum beats!</p>
                        <Music className="absolute -bottom-6 -right-6 w-40 h-40 text-pink-50 transform -rotate-12" />
                    </button>
                </div>
            )}

            {activeTab === 'memory' && <MemoryGame songs={songs} />}
            {activeTab === 'beats' && <BeatMaker />}
        </div>
    );
};

// ── Memory Game ──────────────────────────────────────────────────────────────
const MemoryGame: React.FC<{ songs: any[] }> = ({ songs }) => {
    const [cards, setCards] = useState<any[]>([]);
    const [flipped, setFlipped] = useState<number[]>([]);
    const [matched, setMatched] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);

    useEffect(() => {
        initGame();
    }, [songs]);

    useEffect(() => {
        if (matched.length === cards.length && cards.length > 0) {
            if (typeof (window as any).confetti === 'function') {
                (window as any).confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        }
    }, [matched.length, cards.length]);

    const initGame = () => {
        if (!songs.length) return;
        const pool = [...songs].sort(() => 0.5 - Math.random()).slice(0, 6);
        const combined = [...pool, ...pool].sort(() => 0.5 - Math.random());
        setCards(combined.map((s, idx) => ({ id: idx, songId: s.id, cover: s.album?.cover_url, title: s.title })));
        setFlipped([]);
        setMatched([]);
        setMoves(0);
    };

    const handleClick = (idx: number) => {
        if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx)) return;
        const newFlipped = [...flipped, idx];
        setFlipped(newFlipped);
        if (newFlipped.length === 2) {
            setMoves(m => m + 1);
            const [first, second] = newFlipped;
            if (cards[first].songId === cards[second].songId) {
                setMatched([...matched, first, second]);
                setFlipped([]);
            } else {
                setTimeout(() => setFlipped([]), 1000);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col items-center">
            <div className="flex w-full justify-between items-center mb-8 bg-white px-8 py-4 rounded-full shadow-md border-2 border-indigo-100">
                <span className="text-xl font-bold text-gray-700">Moves: {moves}</span>
                <button onClick={initGame} className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition-colors">
                    Restart Game
                </button>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 w-full">
                {cards.map((c, i) => {
                    const isFlipped = flipped.includes(i) || matched.includes(i);
                    return (
                        <div
                            key={i}
                            onClick={() => handleClick(i)}
                            className="aspect-square relative cursor-pointer"
                            style={{ perspective: '1000px' }}
                        >
                            <div
                                className={`w-full h-full transition-transform duration-500 relative ring-4 ring-white shadow-xl rounded-2xl ${isFlipped ? 'rotate-y-180' : ''}`}
                                style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : '' }}
                            >
                                {/* Front (Hidden) */}
                                <div className="absolute inset-0 bg-indigo-200 rounded-2xl flex items-center justify-center text-indigo-500" style={{ backfaceVisibility: 'hidden' }}>
                                    <Music className="w-12 h-12" />
                                </div>
                                {/* Back (Revealed) */}
                                <div className="absolute inset-0 bg-white rounded-2xl overflow-hidden" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                                    <img src={c.cover || 'https://images.pexels.com/photos/167635/pexels-photo-167635.jpeg'} alt="cover" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            {matched.length === cards.length && cards.length > 0 && (
                <div className="mt-8 text-4xl font-black text-green-500 animate-bounce">
                    You Won in {moves} moves! 🎉
                </div>
            )}
        </div>
    );
};

// ── Beat Maker ───────────────────────────────────────────────────────────────
const BeatMaker: React.FC = () => {
    const playSound = (type: 'kick' | 'snare' | 'hihat' | 'cymbal' | 'clap' | 'tom') => {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;
        if (type === 'kick') {
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.5);
            gain.gain.setValueAtTime(1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            osc.start(now);
            osc.stop(now + 0.5);
        } else if (type === 'snare') {
            // White noise for snare
            const bufferSize = ctx.sampleRate * 0.2;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const noiseFilter = ctx.createBiquadFilter();
            noiseFilter.type = 'highpass';
            noiseFilter.frequency.value = 1000;
            noise.connect(noiseFilter);
            noiseFilter.connect(gain);
            gain.gain.setValueAtTime(1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            noise.start(now);
        } else {
            // Generic high beep for hihat/cymbals
            osc.type = 'square';
            osc.frequency.setValueAtTime(type === 'hihat' ? 800 : 1200, now);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        }
    };

    const pads = [
        { name: 'Kick', color: 'bg-red-500', type: 'kick' },
        { name: 'Snare', color: 'bg-orange-500', type: 'snare' },
        { name: 'Hi-Hat', color: 'bg-yellow-400', type: 'hihat' },
        { name: 'Clap', color: 'bg-green-500', type: 'clap' },
        { name: 'Tom', color: 'bg-blue-500', type: 'tom' },
        { name: 'Cymbal', color: 'bg-purple-500', type: 'cymbal' }
    ];

    return (
        <div className="max-w-3xl mx-auto flex flex-col items-center">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full mt-8">
                {pads.map((pad, i) => (
                    <button
                        key={i}
                        onMouseDown={() => playSound(pad.type as any)}
                        className={`${pad.color} text-white font-black text-2xl h-40 rounded-[2rem] shadow-[0_10px_0_rgba(0,0,0,0.2)] active:shadow-[0_0px_0_rgba(0,0,0,0.2)] active:translate-y-2 transition-all border-4 border-white`}
                    >
                        {pad.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default KidsGames;

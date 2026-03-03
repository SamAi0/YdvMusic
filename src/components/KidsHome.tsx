import React from 'react';
import { Gamepad2, Play, BookOpen, GraduationCap, Music } from 'lucide-react';
import { useAPI } from '../hooks/useAPI';
import toast from 'react-hot-toast';

interface KidsHomeProps {
    setCurrentView: (view: string) => void;
}

const KidsHome: React.FC<KidsHomeProps> = ({ setCurrentView }) => {
    const { songs } = useAPI();

    const handlePlayRandom = () => {
        if (songs.length === 0) {
            toast.error('No songs available!');
            return;
        }
        // Logic to actually play a song would go here, maybe handled via context or passing down prop.
        // For now, we will just toast.
        toast.success('Playing a fun song! 🎵');
    };

    const widgets = [
        {
            title: 'Play Games',
            icon: Gamepad2,
            color: 'bg-green-400 text-white',
            shadow: 'shadow-green-500/50',
            view: 'kids-games',
            desc: 'Match cards and make your own beats!'
        },
        {
            title: 'Magic Stories',
            icon: BookOpen,
            color: 'bg-purple-400 text-white',
            shadow: 'shadow-purple-500/50',
            view: 'kids-stories',
            desc: 'Read and listen to magical adventures!'
        },
        {
            title: 'Learn & Grow',
            icon: GraduationCap,
            color: 'bg-yellow-400 text-white',
            shadow: 'shadow-yellow-500/50',
            view: 'kids-learn',
            desc: 'Sing the alphabet and learn math!'
        }
    ];

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 animate-fade-in-up relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
            {/* Animated Background Decorations */}
            <div className="absolute top-10 left-10 text-6xl opacity-30 animate-bounce" style={{ animationDuration: '3s' }}>☁️</div>
            <div className="absolute top-20 right-20 text-5xl opacity-30 animate-pulse" style={{ animationDuration: '4s' }}>⭐</div>
            <div className="absolute bottom-40 left-1/4 text-5xl opacity-20 animate-bounce" style={{ animationDuration: '5s' }}>🎈</div>
            <div className="absolute bottom-20 right-1/4 text-6xl opacity-20 animate-pulse" style={{ animationDuration: '3.5s' }}>🌈</div>

            <div className="text-center mb-10 relative z-10">
                {/* Cute Mascot */}
                <div className="mx-auto w-32 h-32 mb-6 bg-yellow-300 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(253,224,71,0.6)] animate-bounce" style={{ animationDuration: '2s' }}>
                    <span className="text-6xl">🦁</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 drop-shadow-sm mb-4">
                    Welcome to Kids Mode!
                </h1>
                <p className="text-xl font-bold text-gray-500 bg-white/50 backdrop-blur-sm inline-block px-6 py-2 rounded-full border-2 border-dashed border-gray-300">
                    What would you like to do today?
                </p>
            </div>

            {/* Big Play Button */}
            <div className="flex justify-center mb-10">
                <button
                    onClick={handlePlayRandom}
                    className="group relative w-full max-w-sm bg-gradient-to-br from-pink-400 to-rose-500 rounded-3xl p-6 shadow-[0_15px_30px_rgba(244,63,94,0.3)] hover:shadow-[0_25px_50px_rgba(244,63,94,0.4)] transition-all hover:-translate-y-2 border-4 border-white"
                >
                    <div className="flex items-center justify-center space-x-4">
                        <div className="bg-white text-rose-500 rounded-full p-4 group-hover:scale-110 transition-transform">
                            <Play className="w-10 h-10 ml-1" />
                        </div>
                        <div className="text-left text-white">
                            <h2 className="text-2xl font-black">Play Music!</h2>
                            <p className="text-white/80 font-semibold">Random fun songs</p>
                        </div>
                    </div>
                    <Music className="absolute top-4 right-4 text-white/20 w-16 h-16 transform rotate-12" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {widgets.map((widget, i) => {
                    const Icon = widget.icon;
                    return (
                        <button
                            key={widget.title}
                            onClick={() => setCurrentView(widget.view)}
                            className={`${widget.color} rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border-4 border-white text-left overflow-hidden relative group`}
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className="relative z-10">
                                <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Icon className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-black mb-2">{widget.title}</h3>
                                <p className="font-semibold opacity-90 text-sm">{widget.desc}</p>
                            </div>

                            {/* Decorative background icon */}
                            <Icon className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 transform -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                        </button>
                    )
                })}
            </div>
        </div>
    );
};

export default KidsHome;

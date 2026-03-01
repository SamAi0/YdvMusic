import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Film, Minimize } from 'lucide-react';
import { getMovieById } from '../data/movieData';

interface VideoPlayerProps {
    movieId: string;
    onBack: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ movieId, onBack }) => {
    const movie = getMovieById(movieId);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(80);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const animFrameRef = useRef<number>(0);
    const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Cinematic canvas animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let frame = 0;

        const draw = () => {
            const w = canvas.width;
            const h = canvas.height;

            if (!isPlaying) {
                // Paused – static dark gradient
                const grad = ctx.createLinearGradient(0, 0, w, h);
                grad.addColorStop(0, '#0a0a0f');
                grad.addColorStop(1, '#111118');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, w, h);

                // Centered pause indicator
                ctx.fillStyle = 'rgba(255,255,255,0.08)';
                ctx.beginPath();
                ctx.arc(w / 2, h / 2, 50, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.fillRect(w / 2 - 14, h / 2 - 18, 10, 36);
                ctx.fillRect(w / 2 + 4, h / 2 - 18, 10, 36);

                animFrameRef.current = requestAnimationFrame(draw);
                return;
            }

            // Playing – cinematic film effect
            frame++;

            // Dark base
            const bg = ctx.createLinearGradient(0, 0, w, h);
            bg.addColorStop(0, '#050508');
            bg.addColorStop(0.5, '#0c0c15');
            bg.addColorStop(1, '#080810');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            // Film grain & scanlines
            for (let y = 0; y < h; y += 2) {
                ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.015})`;
                ctx.fillRect(0, y, w, 1);
            }

            // Light leak in corner
            const leak = ctx.createRadialGradient(w * 0.2, h * 0.2, 0, w * 0.2, h * 0.2, w * 0.4);
            leak.addColorStop(0, `rgba(180,120,255,${0.04 + 0.02 * Math.sin(frame * 0.05)})`);
            leak.addColorStop(1, 'transparent');
            ctx.fillStyle = leak;
            ctx.fillRect(0, 0, w, h);

            // Subtitle bar
            if (frame % 200 < 120) {
                ctx.fillStyle = 'rgba(0,0,0,0.7)';
                ctx.fillRect(w * 0.15, h * 0.82, w * 0.7, 36);
                ctx.fillStyle = 'rgba(255,255,255,0.9)';
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                const subtitles = [
                    'Jhukegaa nahi...',
                    'Main aaaunga...',
                    'Tumhe mujhe rokna hoga.',
                    'Yeh sirf shuruat hai.'
                ];
                ctx.fillText(subtitles[Math.floor(frame / 200) % subtitles.length], w / 2, h * 0.82 + 24);
            }

            // Vignette
            const vig = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h);
            vig.addColorStop(0, 'transparent');
            vig.addColorStop(1, 'rgba(0,0,0,0.7)');
            ctx.fillStyle = vig;
            ctx.fillRect(0, 0, w, h);

            animFrameRef.current = requestAnimationFrame(draw);
        };

        animFrameRef.current = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(animFrameRef.current);
    }, [isPlaying]);

    // Progress advancement
    useEffect(() => {
        if (isPlaying) {
            progressTimerRef.current = setInterval(() => {
                setProgress(p => {
                    if (p >= 100) {
                        setIsPlaying(false);
                        return 100;
                    }
                    return p + 100 / (60 * 5); // 5 minute demo
                });
            }, 1000);
        } else {
            if (progressTimerRef.current) clearInterval(progressTimerRef.current);
        }
        return () => {
            if (progressTimerRef.current) clearInterval(progressTimerRef.current);
        };
    }, [isPlaying]);

    const handleMouseMove = () => {
        setShowControls(true);
        if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
        if (isPlaying) {
            hideControlsTimer.current = setTimeout(() => setShowControls(false), 3000);
        }
    };

    const toggleFullscreen = () => {
        setIsFullscreen(f => !f);
    };

    const formatTime = (percent: number) => {
        const totalSeconds = Math.floor((percent / 100) * 165 * 60); // 2h 45m
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    if (!movie) return null;

    return (
        <div
            className={`${isFullscreen ? 'fixed inset-0 z-50' : 'flex-1'} bg-black flex flex-col relative group`}
            onMouseMove={handleMouseMove}
        >
            {/* Top bar */}
            <div className={`absolute top-0 left-0 right-0 z-20 p-4 flex items-center bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                <button
                    onClick={onBack}
                    className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                    <span className="font-medium">{movie.title}</span>
                </button>
                <div className="ml-auto flex items-center space-x-2 text-gray-400 text-sm">
                    <Film className="w-4 h-4" />
                    <span>HD • {movie.duration}</span>
                </div>
            </div>

            {/* Canvas */}
            <canvas
                ref={canvasRef}
                className="flex-1 w-full cursor-none"
                width={1920}
                height={1080}
                style={{ height: isFullscreen ? '100vh' : 'calc(100vh - 220px)', cursor: showControls ? 'default' : 'none' }}
                onClick={() => setIsPlaying(p => !p)}
            />

            {/* Controls */}
            <div className={`absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                {/* Progress */}
                <div className="mb-3 flex items-center space-x-3">
                    <span className="text-white text-xs font-mono">{formatTime(progress)}</span>
                    <div
                        className="flex-1 h-1 bg-white/20 rounded-full cursor-pointer relative"
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const pct = ((e.clientX - rect.left) / rect.width) * 100;
                            setProgress(Math.max(0, Math.min(100, pct)));
                        }}
                    >
                        <div
                            className="h-1 bg-white rounded-full relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
                        </div>
                    </div>
                    <span className="text-white text-xs font-mono">{movie.duration}</span>
                </div>

                {/* Buttons */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setIsPlaying(p => !p)}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                    >
                        {isPlaying ? <Pause className="w-5 h-5 text-black" /> : <Play className="w-5 h-5 text-black ml-0.5" />}
                    </button>

                    <button onClick={() => setIsMuted(m => !m)} className="text-white/80 hover:text-white">
                        {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>

                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={isMuted ? 0 : volume}
                        onChange={(e) => { setVolume(+e.target.value); setIsMuted(false); }}
                        className="w-20 accent-white cursor-pointer"
                    />

                    <div className="ml-auto flex items-center space-x-3 text-white/80 text-sm">
                        <span className="hidden sm:block">{movie.title} ({movie.year})</span>
                        <button onClick={toggleFullscreen} className="hover:text-white transition-colors">
                            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Big centered play icon when paused */}
            {!isPlaying && (
                <div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    onClick={() => setIsPlaying(true)}
                >
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all">
                        <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;

import React, { useState, useRef, useEffect } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat,
  Volume2, VolumeX, Heart, HeartOff, List, ChevronUp, Music2,
  Moon, Timer, X
} from 'lucide-react';
import { Song } from '../hooks/useAPI';
import { useAPI } from '../hooks/useAPI';
import { useAuth } from '../contexts/AuthContext';
import { useQueue } from '../contexts/QueueContext';
import { useKidsMode } from '../contexts/KidsModeContext';
import Queue from './Queue';
import toast from 'react-hot-toast';

interface PlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  onSongSelect: (song: Song) => void;
}

const Player: React.FC<PlayerProps> = ({ currentSong, isPlaying, setIsPlaying, onSongSelect }) => {
  const { user } = useAuth();
  const { likedSongs, toggleLikeSong } = useAPI();
  const { queue, currentIndex, shuffle, repeat, smartShuffle, next, previous, setShuffle, setRepeat, setSmartShuffle } = useQueue();
  const { isKidsMode, requestExitKidsMode } = useKidsMode();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [showFullPlayer, setShowFullPlayer] = useState(false);
  const [showTimerMenu, setShowTimerMenu] = useState(false);
  const [sleepTimer, setSleepTimer] = useState<number | null>(null); // in minutes
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null); // in seconds

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const isPremium = user?.isAdmin || false;

  const handlePlayPause = () => {
    if (!currentSong) return;
    if (isPlaying) {
      setIsPlaying(false);
      audioRef.current?.pause();
    } else {
      setIsPlaying(true);
      audioRef.current?.play().catch(console.error);
    }
  };

  const handleNext = () => {
    if (queue.length === 0) { toast('No songs in queue'); return; }
    if (repeat === 'one') {
      if (audioRef.current) { audioRef.current.currentTime = 0; if (isPlaying) audioRef.current.play().catch(console.error); }
      return;
    }
    if (!shuffle && currentIndex === queue.length - 1 && repeat === 'off') {
      setIsPlaying(false); return;
    }
    next();
  };

  const handlePrevious = () => {
    if (queue.length === 0) { toast('No songs in queue'); return; }
    if (currentTime > 3) {
      if (audioRef.current) { audioRef.current.currentTime = 0; setCurrentTime(0); }
      return;
    }
    previous();
  };

  const handleShuffleToggle = () => {
    if (isPremium && shuffle) {
      setSmartShuffle(!smartShuffle);
      toast.success(smartShuffle ? 'Smart Shuffle off' : 'Smart Shuffle on');
    } else {
      setShuffle(!shuffle);
      toast.success(shuffle ? 'Shuffle off' : 'Shuffle on');
    }
  };

  const handleRepeatClick = () => {
    const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one'];
    const next = modes[(modes.indexOf(repeat) + 1) % modes.length];
    setRepeat(next);
    const labels = { off: 'Repeat off', all: 'Repeat all', one: 'Repeat one' };
    toast.success(labels[next]);
  };

  const handleVolumeToggle = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.volume = volume / 100;
    } else {
      setIsMuted(true);
      if (audioRef.current) audioRef.current.volume = 0;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    setIsMuted(v === 0);
    if (audioRef.current) audioRef.current.volume = v / 100;
  };

  // Progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = pct * duration;
    setCurrentTime(pct * duration);
  };

  const formatTime = (t: number) => {
    if (isNaN(t) || !isFinite(t)) return '0:00';
    return `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, '0')}`;
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isLiked = currentSong ? likedSongs.includes(currentSong.id) : false;

  // Sync audio volume with state
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  // Play/pause on isPlaying change
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.play().catch(console.error);
      else audioRef.current.pause();
    }
  }, [isPlaying]);

  // Queue change: update to new song
  useEffect(() => {
    if (queue.length > 0 && queue[currentIndex] && queue[currentIndex] !== currentSong) {
      onSongSelect(queue[currentIndex]);
    }
  }, [queue, currentIndex]);

  // Song change: load & play
  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.currentTime = 0;
      if (isPlaying) audioRef.current.play().catch(console.error);
    }
  }, [currentSong]);

  // Sleep Timer logic
  useEffect(() => {
    if (sleepTimerRemaining === null || !isPlaying) return;

    if (sleepTimerRemaining <= 0) {
      setIsPlaying(false);
      setSleepTimer(null);
      setSleepTimerRemaining(null);
      if (audioRef.current) audioRef.current.pause();
      toast('?? Sleep timer completed. Music paused.', { icon: '??' });
      return;
    }

    const interval = setInterval(() => {
      setSleepTimerRemaining(prev => prev !== null ? prev - 1 : null);
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepTimerRemaining, isPlaying]);

  const handleSetTimer = (minutes: number) => {
    if (minutes === 0) {
      setSleepTimer(null);
      setSleepTimerRemaining(null);
      toast('Sleep timer cancelled');
    } else {
      setSleepTimer(minutes);
      setSleepTimerRemaining(minutes * 60);
      toast.success(`Sleep timer set for ${minutes} minutes ??`);
    }
    setShowTimerMenu(false);
  };

  const formatTimerRemaining = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') { e.preventDefault(); handlePlayPause(); }
      if (e.code === 'ArrowRight') { e.preventDefault(); handleNext(); }
      if (e.code === 'ArrowLeft') { e.preventDefault(); handlePrevious(); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const shuffleColor = smartShuffle && isPremium ? 'text-purple-400' : shuffle ? 'text-green-400' : 'text-gray-500 hover:text-white';
  const repeatColor = repeat === 'all' ? 'text-green-400' : repeat === 'one' ? 'text-blue-400' : 'text-gray-500 hover:text-white';

  if (!currentSong) {
    return (
      <div className="h-20 bg-black/80 border-t border-white/5 flex items-center justify-center glass-dark">
        <div className="flex items-center space-x-8 text-gray-600">
          <SkipBack className="w-5 h-5" />
          <div className="w-10 h-10 rounded-full border-2 border-gray-700 flex items-center justify-center">
            <Play className="w-4 h-4 ml-0.5" />
          </div>
          <SkipForward className="w-5 h-5" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Full player overlay */}
      {showFullPlayer && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center animate-fade-in"
          style={{
            background: isKidsMode
              ? `linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)`
              : `linear-gradient(135deg, #0a0a0a 0%, #111827 50%, #0a1a0a 100%)`,
          }}
        >
          <button
            onClick={() => setShowFullPlayer(false)}
            className={`absolute top-6 left-6 transition-colors p-2 rounded-xl ${isKidsMode ? 'text-blue-500 bg-white hover:bg-blue-50 shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
          >
            <ChevronUp className="w-6 h-6" />
          </button>

          {isKidsMode && (
            <button
              onClick={() => { setShowFullPlayer(false); requestExitKidsMode(); }}
              className="absolute top-6 right-6 bg-red-500 text-white font-bold px-4 py-2 rounded-xl shadow-md hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              Exit Kids Mode
            </button>
          )}

          <div className="flex flex-col items-center w-full max-w-sm px-8 relative z-10">
            {/* Album Art */}
            <div className="relative mb-8 animate-scale-in">
              <div
                className={`${isKidsMode ? 'w-72 h-72 rounded-full border-8 border-white p-2' : 'w-64 h-64 rounded-2xl'} shadow-2xl overflow-hidden ring-1 ring-white/10`}
                style={{
                  boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
                  animation: isKidsMode && isPlaying ? 'spin 15s linear infinite' : 'none'
                }}
              >
                <img
                  src={currentSong.album?.cover_url || 'https://images.pexels.com/photos/167635/pexels-photo-167635.jpeg?auto=compress&cs=tinysrgb&w=600'}
                  alt={currentSong.title}
                  className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? 'scale-105' : 'scale-100'} ${isKidsMode ? 'rounded-full' : ''}`}
                />
              </div>
              {isPlaying && !isKidsMode && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-end space-x-0.5 h-5">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="wave-bar" style={{ height: `${10 + (i % 3) * 5}px` }} />
                  ))}
                </div>
              )}
              {isPlaying && isKidsMode && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-4 h-4 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>

            {/* Song info */}
            <div className="text-center mb-6 w-full">
              <h2 className={`font-bold mb-1 truncate ${isKidsMode ? 'text-3xl text-gray-900' : 'text-2xl text-white'}`}>{currentSong.title}</h2>
              <p className={isKidsMode ? "text-blue-600 font-semibold text-lg" : "text-gray-400"}>{currentSong.artist?.name}</p>
            </div>

            {/* Like */}
            {user && (
              <div className="mb-4">
                <button
                  onClick={() => toggleLikeSong(currentSong.id)}
                  className="transition-all hover:scale-110"
                >
                  {isLiked
                    ? <Heart className="w-6 h-6 fill-current text-green-400" />
                    : <HeartOff className="w-6 h-6 text-gray-500 hover:text-white" />}
                </button>
              </div>
            )}

            {/* Progress */}
            <div className="w-full mb-8">
              <div
                className={`w-full ${isKidsMode ? 'h-4 bg-blue-100' : 'h-1.5 bg-white/10'} rounded-full cursor-pointer group`}
                onClick={handleProgressClick}
              >
                <div
                  className={`h-full ${isKidsMode ? 'bg-gradient-to-r from-pink-400 to-purple-500 shadow-sm' : 'bg-green-400'} rounded-full relative transition-all`}
                  style={{ width: `${progressPct}%` }}
                >
                  <div className={`absolute right-0 top-1/2 -translate-y-1/2 ${isKidsMode ? 'w-6 h-6 bg-white border-4 border-pink-400' : 'w-3 h-3 bg-white opacity-0 group-hover:opacity-100'} rounded-full shadow transition-opacity`} />
                </div>
              </div>
              <div className={`flex justify-between text-xs mt-2 ${isKidsMode ? 'text-blue-600 font-bold' : 'text-gray-500 mt-1.5'}`}>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className={`flex items-center mb-6 w-full justify-center ${isKidsMode ? 'space-x-8' : 'space-x-6'}`}>
              {!isKidsMode && (
                <>
                  <button onClick={handleShuffleToggle} className={`transition-colors ${shuffleColor}`}>
                    <Shuffle className="w-5 h-5" />
                  </button>
                  {/* Timer Full Player logic */}
                  <div className="relative">
                    <button
                      onClick={() => setShowTimerMenu(!showTimerMenu)}
                      className={`transition-colors relative p-2 ${sleepTimer !== null ? 'text-indigo-400' : 'text-gray-500 hover:text-white'}`}
                      title="Sleep Timer"
                    >
                      <Moon className="w-5 h-5" />
                      {sleepTimer !== null && sleepTimerRemaining !== null && (
                        <span className="absolute -top-3 -right-3 bg-indigo-500/20 text-indigo-300 text-[10px] px-1 rounded font-bold whitespace-nowrap">
                          {formatTimerRemaining(sleepTimerRemaining)}
                        </span>
                      )}
                    </button>
                    {showTimerMenu && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowTimerMenu(false)} />
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#1a1a1a] rounded-xl shadow-2xl z-50 py-2 w-48 border border-white/10 animate-fade-in">
                          <div className="px-3 pb-2 mb-2 border-b border-white/5 text-white text-sm font-bold flex items-center gap-2">
                            <Timer className="w-4 h-4 text-indigo-400" /> Sleep Timer
                          </div>
                          <button onClick={() => handleSetTimer(0)} className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10">Off</button>
                          <button onClick={() => handleSetTimer(1)} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10">1 Minute (Demo)</button>
                          <button onClick={() => handleSetTimer(15)} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10">15 Minutes</button>
                          <button onClick={() => handleSetTimer(30)} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10">30 Minutes</button>
                          <button onClick={() => handleSetTimer(60)} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10">1 Hour</button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}

              <button
                onClick={handlePrevious}
                className={`transition-colors ${isKidsMode ? 'w-16 h-16 bg-white text-blue-500 rounded-full flex justify-center items-center shadow-lg hover:scale-110' : 'text-gray-300 hover:text-white'}`}
              >
                <SkipBack className={isKidsMode ? "w-8 h-8" : "w-6 h-6"} />
              </button>

              <button
                onClick={handlePlayPause}
                className={`flex items-center justify-center transition-all ${isKidsMode ? 'w-24 h-24 bg-green-400 text-white rounded-full hover:bg-green-500 shadow-xl hover:scale-110' : 'w-14 h-14 bg-white text-black rounded-full hover:scale-105 shadow-xl glow-green'}`}
              >
                {isPlaying ? <Pause className={isKidsMode ? "w-10 h-10" : "w-6 h-6"} /> : <Play className={isKidsMode ? "w-10 h-10 ml-2" : "w-6 h-6 ml-0.5"} />}
              </button>

              <button
                onClick={handleNext}
                className={`transition-colors ${isKidsMode ? 'w-16 h-16 bg-white text-blue-500 rounded-full flex justify-center items-center shadow-lg hover:scale-110' : 'text-gray-300 hover:text-white'}`}
              >
                <SkipForward className={isKidsMode ? "w-8 h-8" : "w-6 h-6"} />
              </button>

              {!isKidsMode && (
                <button onClick={handleRepeatClick} className={`transition-colors relative ${repeatColor}`}>
                  <Repeat className="w-5 h-5" />
                  {repeat === 'one' && <span className="absolute -top-1.5 -right-1.5 text-[9px] font-bold text-blue-400">1</span>}
                </button>
              )}
            </div>

            {/* Volume */}
            {!isKidsMode && (
              <div className="flex items-center w-full space-x-3">
                <button onClick={handleVolumeToggle} className="text-gray-500 hover:text-white transition-colors flex-shrink-0">
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0} max={100} value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="flex-1 h-1 accent-green-400"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mini Player Bar */}
      <div className={`relative px-4 py-2 z-30 transition-colors ${isKidsMode ? 'bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-3xl border-t-4 border-blue-500 pb-5' : 'glass-dark border-t border-white/5'}`}>
        <audio
          ref={audioRef}
          src={currentSong.audio_url || undefined}
          preload="metadata"
          onTimeUpdate={() => { if (audioRef.current && !isDraggingProgress) setCurrentTime(audioRef.current.currentTime); }}
          onLoadedMetadata={() => { if (audioRef.current) setDuration(audioRef.current.duration); }}
          onEnded={() => {
            if (repeat === 'one') { audioRef.current?.play(); }
            else if (!shuffle && currentIndex === queue.length - 1 && repeat === 'off') { setIsPlaying(false); }
            else { handleNext(); }
          }}
          onError={(e) => console.error('Audio error:', e)}
        />

        {/* Thin progress bar at top */}
        <div
          ref={progressRef}
          className="absolute top-0 left-0 right-0 h-0.5 bg-white/10 cursor-pointer group"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-green-400 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-2 mt-1">
          {/* Track info */}
          <div
            className="flex items-center min-w-0 flex-1 cursor-pointer group"
            onClick={() => setShowFullPlayer(true)}
          >
            <div className="relative flex-shrink-0 mr-3">
              <img
                src={currentSong.album?.cover_url || 'https://images.pexels.com/photos/167635/pexels-photo-167635.jpeg?auto=compress&cs=tinysrgb&w=200'}
                alt={currentSong.title}
                className="w-11 h-11 rounded-lg object-cover ring-1 ring-white/10 group-hover:ring-green-500/30 transition-all"
              />
              {isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-end space-x-0.5">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="wave-bar" style={{ height: `${8 + i * 3}px` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-semibold truncate transition-colors ${isKidsMode ? 'text-gray-900 text-lg' : 'text-white group-hover:text-green-400'}`}>{currentSong.title}</p>
              <p className={`text-xs truncate ${isKidsMode ? 'text-blue-500 font-medium text-sm' : 'text-gray-500'}`}>{currentSong.artist?.name}</p>
            </div>
            {user && (
              <button
                onClick={(e) => { e.stopPropagation(); toggleLikeSong(currentSong.id); }}
                className="ml-3 flex-shrink-0 text-gray-500 hover:text-green-400 transition-colors"
              >
                {isLiked ? <Heart className="w-4 h-4 fill-current text-green-400" /> : <HeartOff className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Center controls */}
          <div className="flex flex-col items-center flex-shrink-0 max-w-md w-full mx-4 hidden md:flex">
            <div className={`flex items-center space-x-4 ${isKidsMode ? 'mb-0' : 'mb-1.5'}`}>
              {!isKidsMode && (
                <>
                  <button onClick={handleShuffleToggle} className={`transition-colors relative ${shuffleColor}`} title="Shuffle">
                    <Shuffle className="w-4 h-4" />
                    {smartShuffle && isPremium && <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-purple-500 rounded-full" />}
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setShowTimerMenu(!showTimerMenu)}
                      className={`transition-colors relative ${sleepTimer !== null ? 'text-indigo-400' : 'text-gray-500 hover:text-white'}`}
                      title="Sleep Timer"
                    >
                      <Moon className="w-4 h-4" />
                      {sleepTimer !== null && sleepTimerRemaining !== null && (
                        <span className="absolute -top-4 -right-4 bg-indigo-500/20 text-indigo-300 text-[9px] px-1 rounded font-bold whitespace-nowrap">
                          {formatTimerRemaining(sleepTimerRemaining)}
                        </span>
                      )}
                    </button>

                    {/* Timer Dropdown Mini Player */}
                    {showTimerMenu && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowTimerMenu(false)} />
                        <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 glass-dark rounded-xl shadow-2xl z-50 py-2 w-48 border border-white/10 animate-scale-in">
                          <div className="px-3 pb-2 mb-2 border-b border-white/5 flex items-center justify-between">
                            <span className="text-white text-sm font-bold flex items-center gap-2"><Timer className="w-4 h-4 text-indigo-400" /> Sleep Timer</span>
                          </div>
                          <button onClick={() => handleSetTimer(0)} className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-colors">Off</button>
                          <button onClick={() => handleSetTimer(1)} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors flex justify-between"><span>1 Minute (Demo)</span></button>
                          <button onClick={() => handleSetTimer(15)} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors flex justify-between"><span>15 Minutes</span></button>
                          <button onClick={() => handleSetTimer(30)} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors flex justify-between"><span>30 Minutes</span></button>
                          <button onClick={() => handleSetTimer(45)} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors flex justify-between"><span>45 Minutes</span></button>
                          <button onClick={() => handleSetTimer(60)} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors flex justify-between"><span>1 Hour</span></button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}

              <button onClick={handlePrevious} className={isKidsMode ? "text-blue-500 bg-blue-100 p-2 rounded-full hover:bg-blue-200" : "text-gray-400 hover:text-white transition-colors"}>
                <SkipBack className={isKidsMode ? "w-6 h-6" : "w-5 h-5"} />
              </button>
              <button
                onClick={handlePlayPause}
                className={isKidsMode ? "w-14 h-14 bg-green-400 text-white rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-lg mx-2" : "w-9 h-9 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-md"}
              >
                {isPlaying ? <Pause className={isKidsMode ? "w-6 h-6" : "w-4 h-4"} /> : <Play className={isKidsMode ? "w-6 h-6 ml-1" : "w-4 h-4 ml-0.5"} />}
              </button>
              <button onClick={handleNext} className={isKidsMode ? "text-blue-500 bg-blue-100 p-2 rounded-full hover:bg-blue-200" : "text-gray-400 hover:text-white transition-colors"}>
                <SkipForward className={isKidsMode ? "w-6 h-6" : "w-5 h-5"} />
              </button>

              {!isKidsMode && (
                <button onClick={handleRepeatClick} className={`transition-colors relative ${repeatColor}`} title="Repeat">
                  <Repeat className="w-4 h-4" />
                  {repeat === 'one' && <span className="absolute -top-1.5 -right-1.5 text-[9px] font-bold text-blue-400">1</span>}
                  {repeat === 'all' && <span className="absolute -top-1.5 -right-1.5 text-[9px] font-bold text-green-400">∞</span>}
                </button>
              )}
            </div>

            {/* Progress */}
            {!isKidsMode && (
              <div className="flex items-center w-full space-x-2">
                <span className="text-[11px] text-gray-500 w-8 text-right">{formatTime(currentTime)}</span>
                <div
                  className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer group"
                  onClick={handleProgressClick}
                >
                  <div
                    className="h-full bg-white group-hover:bg-green-400 rounded-full transition-colors"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <span className="text-[11px] text-gray-500 w-8">{formatTime(duration)}</span>
              </div>
            )}
          </div>

          {/* Right controls */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* Mobile play */}
            <button
              onClick={handlePlayPause}
              className={`md:hidden rounded-full flex items-center justify-center ${isKidsMode ? 'w-12 h-12 bg-green-400 text-white shadow-lg' : 'w-9 h-9 bg-white text-black'}`}
            >
              {isPlaying ? <Pause className={isKidsMode ? "w-6 h-6" : "w-4 h-4"} /> : <Play className={isKidsMode ? "w-6 h-6 ml-1" : "w-4 h-4 ml-0.5"} />}
            </button>

            {!isKidsMode && (
              <>
                {/* Queue */}
                <button
                  onClick={() => setShowQueue(true)}
                  className="hidden md:flex text-gray-500 hover:text-white transition-colors relative"
                  title="Queue"
                >
                  <List className="w-4 h-4" />
                  {queue.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-[9px] rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold">
                      {queue.length > 9 ? '9+' : queue.length}
                    </span>
                  )}
                </button>

                {/* Volume */}
                <div className="hidden md:flex items-center space-x-1.5">
                  <button onClick={handleVolumeToggle} className="text-gray-500 hover:text-white transition-colors">
                    {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input
                    type="range" min={0} max={100} value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 accent-green-400 cursor-pointer"
                  />
                </div>
              </>
            )}

            {/* Expand */}
            <button
              onClick={() => setShowFullPlayer(true)}
              className={`transition-colors ${isKidsMode ? 'bg-blue-100 text-blue-500 p-3 rounded-full hover:bg-blue-200' : 'text-gray-500 hover:text-white'}`}
              title="Full Player"
            >
              <Music2 className={isKidsMode ? "w-6 h-6" : "w-4 h-4"} />
            </button>
          </div>
        </div>
      </div>

      <Queue
        isOpen={showQueue}
        onClose={() => setShowQueue(false)}
        currentSong={currentSong}
        onSongSelect={onSongSelect}
      />
    </>
  );
};

export default Player;
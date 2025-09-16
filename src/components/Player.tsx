import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Heart, HeartOff } from 'lucide-react';
import { Song } from '../hooks/useAPI';
import { useAPI } from '../hooks/useAPI';
import { useAuth } from '../contexts/AuthContext';

interface PlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  shuffle: boolean;
  setShuffle: (shuffle: boolean) => void;
  repeat: 'off' | 'all' | 'one';
  setRepeat: (repeat: 'off' | 'all' | 'one') => void;
}

const Player: React.FC<PlayerProps> = ({ 
  currentSong, 
  isPlaying, 
  setIsPlaying,
  onNext,
  onPrevious,
  shuffle,
  setShuffle,
  repeat,
  setRepeat
}) => {
  const { user } = useAuth();
  const { likedSongs, toggleLikeSong } = useAPI();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      console.log('Loading song:', currentSong.title, 'Audio URL:', currentSong.audio_url);
      audioRef.current.currentTime = 0;
      
      // Add error event listener
      const handleError = (e: Event) => {
        console.error('Audio load error for song:', currentSong.title, e);
        console.error('Audio URL that failed:', currentSong.audio_url);
      };
      
      const handleCanPlay = () => {
        console.log('Audio can play:', currentSong.title);
      };
      
      audioRef.current.addEventListener('error', handleError);
      audioRef.current.addEventListener('canplay', handleCanPlay);
      
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error('Play error for song:', currentSong.title, error);
        });
      }
      
      // Cleanup event listeners
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('error', handleError);
          audioRef.current.removeEventListener('canplay', handleCanPlay);
        }
      };
    }
  }, [currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newVolume = Math.max(0, Math.min(100, percent * 100));
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleRepeatClick = () => {
    const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeat);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeat(modes[nextIndex]);
  };

  const isLiked = currentSong ? likedSongs.includes(currentSong.id) : false;

  const handleLikeToggle = async () => {
    if (!currentSong || !user) return;
    try {
      await toggleLikeSong(currentSong.id);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (!currentSong) {
    return (
      <div className="bg-gray-900 dark:bg-gray-900 border-t border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex-1"></div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-500">
            <SkipBack className="w-5 h-5" />
          </button>
          <button className="text-gray-500">
            <Play className="w-8 h-8" />
          </button>
          <button className="text-gray-500">
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 dark:bg-gray-900 border-t border-gray-800 px-4 py-3">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={(e) => {
          console.error('Audio element error:', e);
          console.error('Failed to load:', currentSong.audio_url);
        }}
        onLoadStart={() => {
          console.log('Started loading:', currentSong.title);
        }}
        onCanPlay={() => {
          console.log('Can play:', currentSong.title);
        }}
        onEnded={() => {
          if (repeat === 'one') {
            audioRef.current?.play();
          } else if (onNext) {
            onNext();
          } else {
            setIsPlaying(false);
          }
        }}
        src={currentSong.audio_url || undefined}
        preload="metadata"
      />

      <div className="flex items-center justify-between">
        {/* Track Info */}
        <div className="flex items-center flex-1 min-w-0">
          <img
            src={currentSong.album?.cover_url || 'https://images.pexels.com/photos/167635/pexels-photo-167635.jpeg?auto=compress&cs=tinysrgb&w=300'}
            alt={`${currentSong.title} cover`}
            className="w-14 h-14 rounded-md mr-4"
          />
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-medium truncate">{currentSong.title}</p>
            <p className="text-gray-400 text-xs truncate">{currentSong.artist?.name}</p>
          </div>
          {user && (
            <button
              onClick={handleLikeToggle}
              className="text-gray-400 hover:text-green-500 transition-colors ml-4"
            >
              {isLiked ? (
                <Heart className="w-4 h-4 fill-current text-green-500" />
              ) : (
                <HeartOff className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center flex-1 max-w-md mx-8">
          <div className="flex items-center space-x-4 mb-2">
            <button
              onClick={() => setShuffle(!shuffle)}
              className={`transition-colors ${
                shuffle ? 'text-green-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <button
              onClick={onPrevious}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button
              onClick={onNext}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>
            <button
              onClick={handleRepeatClick}
              className={`transition-colors ${
                repeat !== 'off' ? 'text-green-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Repeat className="w-4 h-4" />
              {repeat === 'one' && (
                <span className="absolute -mt-2 -ml-1 text-xs">1</span>
              )}
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center w-full space-x-2">
            <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
            <div
              className="flex-1 bg-gray-600 h-1 rounded-full cursor-pointer"
              onClick={handleProgressClick}
            >
              <div
                className="bg-white h-1 rounded-full transition-all duration-300"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-400">{formatTime(duration || (typeof currentSong.duration === 'number' ? currentSong.duration : 0))}</span>
          </div>
        </div>

        {/* Volume Controls */}
        <div className="flex items-center justify-end flex-1">
          <Volume2 className="w-4 h-4 text-gray-400 mr-2" />
          <div
            className="w-20 bg-gray-600 h-1 rounded-full cursor-pointer"
            onClick={handleVolumeChange}
          >
            <div
              className="bg-white h-1 rounded-full transition-all duration-300"
              style={{ width: `${volume}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
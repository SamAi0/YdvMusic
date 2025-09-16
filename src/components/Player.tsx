import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Heart, HeartOff, List } from 'lucide-react';
import { Song } from '../hooks/useAPI';
import { useAPI } from '../hooks/useAPI';
import { useAuth } from '../contexts/AuthContext';
import { useQueue } from '../contexts/QueueContext';
import Queue from './Queue';
import toast from 'react-hot-toast';

interface PlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  onSongSelect: (song: Song) => void;
}

const Player: React.FC<PlayerProps> = ({ 
  currentSong, 
  isPlaying, 
  setIsPlaying,
  onSongSelect
}) => {
  const { user } = useAuth();
  const { likedSongs, toggleLikeSong } = useAPI();
  const {
    queue,
    currentIndex,
    shuffle,
    repeat,
    smartShuffle,
    next,
    previous,
    setShuffle,
    setRepeat,
    setSmartShuffle
  } = useQueue();
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [showQueue, setShowQueue] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const isPremium = user?.isAdmin || false;

  // Enhanced Play/Pause functionality
  const handlePlayPause = () => {
    if (!currentSong) return;
    
    if (isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
      }
    }
  };

  // Enhanced Skip functionality with queue awareness
  const handleNext = () => {
    if (queue.length === 0) {
      toast('No songs in queue');
      return;
    }
    
    // Handle repeat modes
    if (repeat === 'one') {
      // Restart current song
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        if (isPlaying) {
          audioRef.current.play().catch(console.error);
        }
      }
      return;
    }
    
    next();
    toast.success('Next track');
  };

  const handlePrevious = () => {
    if (queue.length === 0) {
      toast('No songs in queue');
      return;
    }
    
    // If more than 3 seconds into the song, restart it
    if (currentTime > 3) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
      }
      return;
    }
    
    previous();
    toast.success('Previous track');
  };

  // Enhanced Shuffle functionality
  const handleShuffleToggle = () => {
    if (isPremium && shuffle) {
      // Toggle Smart Shuffle for premium users
      setSmartShuffle(!smartShuffle);
      toast.success(smartShuffle ? 'Smart Shuffle disabled' : 'Smart Shuffle enabled');
    } else {
      // Toggle regular shuffle
      setShuffle(!shuffle);
      toast.success(shuffle ? 'Shuffle disabled' : 'Shuffle enabled');
    }
  };

  // Enhanced Repeat functionality
  const handleRepeatClick = () => {
    const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one'];
    const currentModeIndex = modes.indexOf(repeat);
    const nextMode = modes[(currentModeIndex + 1) % modes.length];
    setRepeat(nextMode);
    
    const modeLabels = {
      'off': 'Repeat disabled',
      'all': 'Repeat all songs',
      'one': 'Repeat current song'
    };
    
    toast.success(modeLabels[nextMode]);
  };

  const getShuffleButtonColor = () => {
    if (smartShuffle && isPremium) return 'text-purple-500';
    if (shuffle) return 'text-green-500';
    return 'text-gray-400 hover:text-white';
  };

  const getShuffleButtonTitle = () => {
    if (smartShuffle && isPremium) return 'Smart Shuffle';
    if (shuffle) return 'Shuffle On';
    return 'Shuffle Off';
  };

  const getRepeatButtonColor = () => {
    switch (repeat) {
      case 'all':
        return 'text-green-500';
      case 'one':
        return 'text-blue-500';
      default:
        return 'text-gray-400 hover:text-white';
    }
  };

  const getRepeatButtonTitle = () => {
    switch (repeat) {
      case 'off':
        return 'Enable repeat';
      case 'all':
        return 'Repeat all songs';
      case 'one':
        return 'Repeat current song';
      default:
        return 'Repeat';
    }
  };

  // Update current song when queue or currentIndex changes
  useEffect(() => {
    if (queue.length > 0 && queue[currentIndex] && queue[currentIndex] !== currentSong) {
      onSongSelect(queue[currentIndex]);
    }
  }, [queue, currentIndex, onSongSelect, currentSong]);

  // Enhanced auto-play functionality
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Keyboard controls for basic playback
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent if user is typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevious();
          break;
        case 'KeyS':
          e.preventDefault();
          handleShuffleToggle();
          break;
        case 'KeyR':
          e.preventDefault();
          handleRepeatClick();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Auto-play next song when current ends
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => {
        if (repeat === 'one') {
          audio.currentTime = 0;
          audio.play().catch(console.error);
        } else {
          handleNext();
        }
      };
      
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, [repeat, handleNext]);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      console.log('Loading song:', currentSong.title, 'Audio URL:', currentSong.audio_url);
      audioRef.current.currentTime = 0;
      
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
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('error', handleError);
          audioRef.current.removeEventListener('canplay', handleCanPlay);
        }
      };
    }
  }, [currentSong]);

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
          } else {
            handleNext();
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
            {/* Shuffle Button */}
            <button
              onClick={handleShuffleToggle}
              className={`transition-colors relative ${getShuffleButtonColor()}`}
              title={getShuffleButtonTitle()}
            >
              <Shuffle className="w-4 h-4" />
              {smartShuffle && isPremium && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
              )}
            </button>
            
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              className="text-gray-400 hover:text-white transition-colors"
              title="Previous (or restart if >3s)"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            
            {/* Play/Pause Button */}
            <button
              onClick={handlePlayPause}
              className="bg-white text-black rounded-full w-10 h-10 flex items-center justify-center hover:scale-105 transition-transform"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            
            {/* Next Button */}
            <button
              onClick={handleNext}
              className="text-gray-400 hover:text-white transition-colors"
              title="Next track"
            >
              <SkipForward className="w-5 h-5" />
            </button>
            
            {/* Repeat Button */}
            <button
              onClick={handleRepeatClick}
              className={`transition-colors relative ${getRepeatButtonColor()}`}
              title={getRepeatButtonTitle()}
            >
              <Repeat className="w-4 h-4" />
              {repeat === 'one' && (
                <span className="absolute -top-1 -right-1 text-xs font-bold text-blue-400">1</span>
              )}
              {repeat === 'all' && (
                <span className="absolute -top-1 -right-1 text-xs font-bold text-green-400">∞</span>
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

        {/* Volume Controls & Queue */}
        <div className="flex items-center justify-end flex-1 space-x-4">
          {/* Queue Button */}
          <button
            onClick={() => setShowQueue(true)}
            className="text-gray-400 hover:text-white transition-colors relative"
            title="Show Queue"
          >
            <List className="w-4 h-4" />
            {queue.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {queue.length}
              </span>
            )}
          </button>
          
          {/* Volume Controls */}
          <Volume2 className="w-4 h-4 text-gray-400" />
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
      
      {/* Queue Modal */}
      <Queue
        isOpen={showQueue}
        onClose={() => setShowQueue(false)}
        currentSong={currentSong}
        onSongSelect={onSongSelect}
      />
    </div>
  );
};

export default Player;
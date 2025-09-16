import React, { createContext, useContext, useState, useCallback } from 'react';
import { Song } from '../hooks/useAPI';
import { useAuth } from './AuthContext';
import { getSmartShuffleNext } from '../utils/recommendations';
import { availableSongs } from '../utils/localData';
import toast from 'react-hot-toast';

interface QueueContextType {
  queue: Song[];
  currentIndex: number;
  shuffle: boolean;
  repeat: 'off' | 'all' | 'one';
  smartShuffle: boolean;
  skipCount: number;
  maxSkips: number;
  
  // Queue management
  setQueue: (songs: Song[], startIndex?: number) => void;
  addToQueue: (song: Song) => void;
  playNext: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  clearQueue: () => void;
  
  // Playback controls
  next: () => void;
  previous: () => void;
  jumpTo: (index: number) => void;
  
  // Settings
  setShuffle: (shuffle: boolean) => void;
  setRepeat: (repeat: 'off' | 'all' | 'one') => void;
  setSmartShuffle: (smartShuffle: boolean) => void;
  
  // Premium features
  canSkip: () => boolean;
  resetSkipCount: () => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [queue, setQueueState] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'off' | 'all' | 'one'>('off');
  const [smartShuffle, setSmartShuffle] = useState(false);
  const [skipCount, setSkipCount] = useState(0);
  const [shuffleHistory, setShuffleHistory] = useState<number[]>([]);

  // Determine if user is premium (admin users are considered premium)
  const isPremium = user?.isAdmin || false;
  const maxSkips = isPremium ? 999 : 6; // Unlimited for premium, 6 for free

  const setQueue = useCallback((songs: Song[], startIndex: number = 0) => {
    setQueueState(songs);
    setCurrentIndex(Math.max(0, Math.min(startIndex, songs.length - 1)));
    setShuffleHistory([]);
  }, []);

  const addToQueue = useCallback((song: Song) => {
    setQueueState(prev => [...prev, song]);
    toast.success(`Added "${song.title}" to queue`);
  }, []);

  const playNext = useCallback((song: Song) => {
    setQueueState(prev => {
      const newQueue = [...prev];
      newQueue.splice(currentIndex + 1, 0, song);
      return newQueue;
    });
    toast.success(`"${song.title}" will play next`);
  }, [currentIndex]);

  const removeFromQueue = useCallback((index: number) => {
    setQueueState(prev => {
      const newQueue = prev.filter((_, i) => i !== index);
      if (index < currentIndex) {
        setCurrentIndex(prev => prev - 1);
      } else if (index === currentIndex && newQueue.length > 0) {
        // If removing current song, adjust index
        setCurrentIndex(prev => Math.min(prev, newQueue.length - 1));
      }
      return newQueue;
    });
  }, [currentIndex]);

  const reorderQueue = useCallback((fromIndex: number, toIndex: number) => {
    setQueueState(prev => {
      const newQueue = [...prev];
      const [movedSong] = newQueue.splice(fromIndex, 1);
      newQueue.splice(toIndex, 0, movedSong);
      
      // Adjust current index if necessary
      if (fromIndex === currentIndex) {
        setCurrentIndex(toIndex);
      } else if (fromIndex < currentIndex && toIndex >= currentIndex) {
        setCurrentIndex(prev => prev - 1);
      } else if (fromIndex > currentIndex && toIndex <= currentIndex) {
        setCurrentIndex(prev => prev + 1);
      }
      
      return newQueue;
    });
  }, [currentIndex]);

  const clearQueue = useCallback(() => {
    setQueueState([]);
    setCurrentIndex(0);
    setShuffleHistory([]);
  }, []);

  const canSkip = useCallback(() => {
    return isPremium || skipCount < maxSkips;
  }, [isPremium, skipCount, maxSkips]);

  const getNextIndex = useCallback(() => {
    if (queue.length === 0) return 0;
    
    if (shuffle) {
      // Smart shuffle logic for premium users
      if (smartShuffle && isPremium) {
        const recommendations = getSmartShuffleNext(queue, currentIndex, shuffleHistory);
        
        // If we have recommendations, add them to the queue
        if (recommendations.length > 0 && queue.length - currentIndex < 3) {
          // Add recommendations to queue to keep it flowing
          const newRecommendations = recommendations.slice(0, 2); // Add 2 recommendations
          setQueueState(prev => [...prev, ...newRecommendations]);
          toast.success(`Smart Shuffle added ${newRecommendations.length} recommended songs`);
        }
        
        // Still use smart shuffle logic for next song selection
        const availableIndices = queue
          .map((_, index) => index)
          .filter(index => !shuffleHistory.includes(index) && index !== currentIndex);
        
        if (availableIndices.length === 0) {
          setShuffleHistory([]);
          return Math.floor(Math.random() * queue.length);
        }
        
        // Prefer songs that are similar to current song for smart shuffle
        const currentSong = queue[currentIndex];
        const smartIndices = availableIndices.filter(index => {
          const song = queue[index];
          return song.genre === currentSong.genre || 
                 song.artist?.name === currentSong.artist?.name;
        });
        
        const selectedIndices = smartIndices.length > 0 ? smartIndices : availableIndices;
        const randomIndex = selectedIndices[Math.floor(Math.random() * selectedIndices.length)];
        setShuffleHistory(prev => [...prev, currentIndex].slice(-Math.floor(queue.length / 2)));
        return randomIndex;
      }
      
      // Regular shuffle - avoid recently played songs
      const availableIndices = queue
        .map((_, index) => index)
        .filter(index => !shuffleHistory.includes(index) && index !== currentIndex);
      
      if (availableIndices.length === 0) {
        // Reset history if all songs have been played
        setShuffleHistory([]);
        return Math.floor(Math.random() * queue.length);
      }
      
      const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      setShuffleHistory(prev => [...prev, currentIndex].slice(-Math.floor(queue.length / 2)));
      return randomIndex;
    }
    
    // Sequential play
    return (currentIndex + 1) % queue.length;
  }, [queue.length, shuffle, smartShuffle, isPremium, currentIndex, shuffleHistory]);

  const getPreviousIndex = useCallback(() => {
    if (queue.length === 0) return 0;
    
    if (shuffle) {
      // In shuffle mode, go to last played song from history
      if (shuffleHistory.length > 0) {
        const lastIndex = shuffleHistory[shuffleHistory.length - 1];
        setShuffleHistory(prev => prev.slice(0, -1));
        return lastIndex;
      }
      // If no history, random song
      return Math.floor(Math.random() * queue.length);
    }
    
    // Sequential play
    return currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
  }, [queue.length, shuffle, currentIndex, shuffleHistory]);

  const next = useCallback(() => {
    if (repeat === 'one') {
      // Stay on current song - let the Player handle restarting
      return;
    }
    
    const nextIndex = getNextIndex();
    
    // Handle end of queue based on repeat mode
    if (!shuffle && currentIndex === queue.length - 1) {
      if (repeat === 'all') {
        // Go back to beginning
        setCurrentIndex(0);
        toast.success('Restarting playlist');
        return;
      } else if (repeat === 'off') {
        toast.success('End of queue reached');
        return;
      }
    }
    
    setCurrentIndex(nextIndex);
  }, [repeat, getNextIndex, currentIndex, queue.length, shuffle]);

  const previous = useCallback(() => {
    const prevIndex = getPreviousIndex();
    setCurrentIndex(prevIndex);
  }, [getPreviousIndex]);

  const jumpTo = useCallback((index: number) => {
    if (index >= 0 && index < queue.length) {
      setCurrentIndex(index);
      setShuffleHistory(prev => [...prev, currentIndex]);
    }
  }, [queue.length, currentIndex]);

  const resetSkipCount = useCallback(() => {
    setSkipCount(0);
  }, []);

  // Reset skip count every hour for free users
  React.useEffect(() => {
    if (!isPremium) {
      const interval = setInterval(() => {
        resetSkipCount();
        toast.success('Skip count reset!');
      }, 60 * 60 * 1000); // 1 hour
      
      return () => clearInterval(interval);
    }
  }, [isPremium, resetSkipCount]);

  const value: QueueContextType = {
    queue,
    currentIndex,
    shuffle,
    repeat,
    smartShuffle,
    skipCount,
    maxSkips,
    
    setQueue,
    addToQueue,
    playNext,
    removeFromQueue,
    reorderQueue,
    clearQueue,
    
    next,
    previous,
    jumpTo,
    
    setShuffle,
    setRepeat,
    setSmartShuffle,
    
    canSkip,
    resetSkipCount,
  };

  return (
    <QueueContext.Provider value={value}>
      {children}
    </QueueContext.Provider>
  );
};
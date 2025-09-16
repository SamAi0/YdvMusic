import React, { useState } from 'react';
import { X, Play, GripVertical, Trash2, SkipForward, Shuffle, Repeat, RotateCcw } from 'lucide-react';
import { useQueue } from '../contexts/QueueContext';
import { useAuth } from '../contexts/AuthContext';
import { Song } from '../hooks/useAPI';

interface QueueProps {
  isOpen: boolean;
  onClose: () => void;
  currentSong: Song | null;
  onSongSelect: (song: Song) => void;
}

const Queue: React.FC<QueueProps> = ({ isOpen, onClose, currentSong, onSongSelect }) => {
  const { user } = useAuth();
  const {
    queue,
    currentIndex,
    shuffle,
    repeat,
    smartShuffle,
    skipCount,
    maxSkips,
    removeFromQueue,
    reorderQueue,
    clearQueue,
    jumpTo,
    setShuffle,
    setRepeat,
    setSmartShuffle,
    canSkip,
    resetSkipCount,
  } = useQueue();
  
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const isPremium = user?.isAdmin || false;

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      reorderQueue(draggedIndex, dragOverIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleSongClick = (song: Song, index: number) => {
    jumpTo(index);
    onSongSelect(song);
  };

  const formatTime = (time: number | string) => {
    const seconds = typeof time === 'string' ? parseInt(time) : time;
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const totalDuration = queue.reduce((total, song) => {
    const duration = typeof song.duration === 'string' ? parseInt(song.duration) : song.duration || 0;
    return total + duration;
  }, 0);

  const handleRepeatClick = () => {
    const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one'];
    const currentModeIndex = modes.indexOf(repeat);
    const nextMode = modes[(currentModeIndex + 1) % modes.length];
    setRepeat(nextMode);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-white">Play Queue</h2>
            <p className="text-gray-400 text-sm">
              {queue.length} songs • {formatTime(totalDuration)} total
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShuffle(!shuffle)}
                className={`flex items-center space-x-2 px-3 py-1 rounded transition-colors ${
                  shuffle 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Shuffle className="w-4 h-4" />
                <span className="text-sm">Shuffle</span>
              </button>
              
              <button
                onClick={handleRepeatClick}
                className={`flex items-center space-x-2 px-3 py-1 rounded transition-colors ${
                  repeat !== 'off' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Repeat className="w-4 h-4" />
                <span className="text-sm">
                  {repeat === 'off' && 'Repeat'}
                  {repeat === 'all' && 'Repeat All'}
                  {repeat === 'one' && 'Repeat One'}
                </span>
              </button>

              {isPremium && (
                <button
                  onClick={() => setSmartShuffle(!smartShuffle)}
                  className={`flex items-center space-x-2 px-3 py-1 rounded transition-colors ${
                    smartShuffle 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="text-sm">Smart Shuffle</span>
                </button>
              )}
            </div>

            <button
              onClick={clearQueue}
              className="text-gray-400 hover:text-red-400 transition-colors"
              title="Clear Queue"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Queue List */}
        <div className="flex-1 overflow-y-auto">
          {queue.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-gray-400">No songs in queue</p>
            </div>
          ) : (
            <div className="p-2">
              {queue.map((song, index) => (
                <div
                  key={`${song.id}-${index}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center p-2 rounded hover:bg-gray-800 transition-colors group cursor-pointer ${
                    index === currentIndex ? 'bg-gray-800 border-l-4 border-green-500' : ''
                  } ${dragOverIndex === index ? 'bg-gray-700' : ''}`}
                  onClick={() => handleSongClick(song, index)}
                >
                  <div className="cursor-grab active:cursor-grabbing mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </div>
                  
                  <div className="w-8 h-8 mr-3 relative">
                    {index === currentIndex ? (
                      <div className="w-full h-full bg-green-500 rounded flex items-center justify-center">
                        <Play className="w-3 h-3 text-white" />
                      </div>
                    ) : (
                      <img
                        src={song.album?.cover_url || 'https://images.pexels.com/photos/167635/pexels-photo-167635.jpeg?auto=compress&cs=tinysrgb&w=300'}
                        alt={song.title}
                        className="w-full h-full rounded object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      index === currentIndex ? 'text-green-400' : 'text-white'
                    }`}>
                      {song.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {song.artist?.name || 'Unknown Artist'}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">
                      {formatTime(song.duration || 0)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromQueue(index);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Drag songs to reorder • Click to play</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Queue;
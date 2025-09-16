import React, { useState } from 'react';
import { Play, Heart, HeartOff, Plus, Download, MoreVertical, ListPlus, SkipForward } from 'lucide-react';
import { Song } from '../hooks/useAPI';
import { useAPI } from '../hooks/useAPI';
import { useAuth } from '../contexts/AuthContext';
import { useQueue } from '../contexts/QueueContext';
import toast from 'react-hot-toast';

interface SongCardProps {
  song: Song;
  onPlay: (song: Song) => void;
  showAddToPlaylist?: boolean;
  onAddToPlaylist?: (song: Song) => void;
}

const SongCard: React.FC<SongCardProps> = ({ 
  song, 
  onPlay, 
  showAddToPlaylist = false,
  onAddToPlaylist 
}) => {
  const { user } = useAuth();
  const { likedSongs, toggleLikeSong } = useAPI();
  const { addToQueue, playNext, setQueue } = useQueue();
  const [showMenu, setShowMenu] = useState(false);

  const isLiked = likedSongs.includes(song.id);

  const handleLikeToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    try {
      await toggleLikeSong(song.id);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handlePlayNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    playNext(song);
    setShowMenu(false);
  };

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(song);
    setShowMenu(false);
  };

  const handlePlayNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Set this song as a new queue and start playing
    setQueue([song], 0);
    onPlay(song);
    setShowMenu(false);
    toast.success(`Now playing: ${song.title}`);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!song.audio_url) {
      toast.error('Audio file not available for download');
      return;
    }
    
    try {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = song.audio_url;
      link.download = `${song.artist?.name} - ${song.title}.mp3`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Downloading "${song.title}"`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download song');
    }
  };

  return (
    <div
      className="flex items-center p-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-700 cursor-pointer group transition-colors"
      onClick={() => onPlay(song)}
    >
      <img
        src={song.album?.cover_url || 'https://images.pexels.com/photos/167635/pexels-photo-167635.jpeg?auto=compress&cs=tinysrgb&w=300'}
        alt={song.title}
        className="w-12 h-12 rounded-md mr-4 flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-white dark:text-white font-medium truncate">{song.title}</p>
        <p className="text-gray-400 text-sm truncate">{song.artist?.name}</p>
      </div>
      <div className="flex items-center space-x-2 relative">
        {user && (
          <button
            onClick={handleLikeToggle}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-green-500"
          >
            {isLiked ? (
              <Heart className="w-4 h-4 fill-current text-green-500" />
            ) : (
              <HeartOff className="w-4 h-4" />
            )}
          </button>
        )}
        
        {/* More Options Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white"
            title="More options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-6 bg-gray-800 rounded-md shadow-lg z-50 py-1 min-w-[160px] border border-gray-700">
              <button
                onClick={handlePlayNow}
                className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Play Now</span>
              </button>
              <button
                onClick={handlePlayNext}
                className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 flex items-center space-x-2"
              >
                <SkipForward className="w-4 h-4" />
                <span>Play Next</span>
              </button>
              <button
                onClick={handleAddToQueue}
                className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 flex items-center space-x-2"
              >
                <ListPlus className="w-4 h-4" />
                <span>Add to Queue</span>
              </button>
              {showAddToPlaylist && onAddToPlaylist && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToPlaylist(song);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Playlist</span>
                </button>
              )}
              <hr className="border-gray-700 my-1" />
              <button
                onClick={handleDownload}
                className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          )}
        </div>
        
        <span className="text-gray-400 text-sm mr-2">
          {typeof song.duration === 'number' ? formatDuration(song.duration) : song.duration}
        </span>
        <button 
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onPlay(song);
          }}
        >
          <Play className="w-5 h-5 text-green-500" />
        </button>
      </div>
    </div>
  );
};

export default SongCard;
import React from 'react';
import { Play, Heart, HeartOff, Plus } from 'lucide-react';
import { Song } from '../hooks/useAPI';
import { useAPI } from '../hooks/useAPI';
import { useAuth } from '../contexts/AuthContext';

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

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
      <div className="flex items-center space-x-2">
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
        {showAddToPlaylist && onAddToPlaylist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToPlaylist(song);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-green-500"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
        <span className="text-gray-400 text-sm mr-2">
          {formatDuration(song.duration)}
        </span>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Play className="w-5 h-5 text-green-500" />
        </button>
      </div>
    </div>
  );
};

export default SongCard;
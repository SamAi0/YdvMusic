import React, { useState } from 'react';
import { Play, Heart, HeartOff, Plus, Download, MoreVertical, ListPlus, SkipForward, Music, Coins } from 'lucide-react';
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
  index?: number;
}

const SongCard: React.FC<SongCardProps> = ({
  song,
  onPlay,
  showAddToPlaylist = false,
  onAddToPlaylist,
  index,
}) => {
  const { user } = useAuth();
  const { likedSongs, toggleLikeSong } = useAPI();
  const { addToQueue, playNext, setQueue } = useQueue();
  const [showMenu, setShowMenu] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [isProcessingTip, setIsProcessingTip] = useState(false);

  const isLiked = likedSongs.includes(song.id);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleLikeToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    await toggleLikeSong(song.id).catch(console.error);
  };

  const handlePlayNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    playNext(song);
    setShowMenu(false);
    toast.success(`"${song.title}" plays next`);
  };

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(song);
    setShowMenu(false);
    toast.success(`Added "${song.title}" to queue`);
  };

  const handlePlayNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQueue([song], 0);
    onPlay(song);
    setShowMenu(false);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!song.audio_url) { toast.error('Audio not available for download'); return; }
    const link = document.createElement('a');
    link.href = song.audio_url;
    link.download = `${song.artist?.name} - ${song.title}.mp3`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloading "${song.title}"`);
  };

  return (
    <div
      className="flex items-center px-3 py-2.5 rounded-xl hover:bg-white/5 cursor-pointer group transition-all duration-200 relative"
      onClick={() => onPlay(song)}
    >
      {/* Track number / play indicator */}
      <div className="w-8 flex-shrink-0 mr-3 flex items-center justify-center">
        {index !== undefined ? (
          <>
            <span className="text-gray-500 text-sm group-hover:hidden block">{index + 1}</span>
            <Play className="w-3.5 h-3.5 text-white hidden group-hover:block" />
          </>
        ) : (
          <Play className="w-3.5 h-3.5 text-gray-500 group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>

      {/* Album art */}
      <div className="relative flex-shrink-0 mr-3">
        {!imgError ? (
          <img
            src={song.album?.cover_url || 'https://images.pexels.com/photos/167635/pexels-photo-167635.jpeg?auto=compress&cs=tinysrgb&w=200'}
            alt={song.title}
            onError={() => setImgError(true)}
            className="w-10 h-10 rounded-lg object-cover ring-1 ring-white/5 group-hover:ring-green-500/20 transition-all"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center ring-1 ring-white/5">
            <Music className="w-4 h-4 text-gray-600" />
          </div>
        )}
      </div>

      {/* Title & artist */}
      <div className="flex-1 min-w-0 mr-3">
        <p className="text-white text-sm font-medium truncate group-hover:text-green-400 transition-colors">{song.title}</p>
        <p className="text-gray-500 text-xs truncate">{song.artist?.name || 'Unknown Artist'}</p>
      </div>

      {/* Right side actions */}
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {user && (
          <button
            onClick={handleLikeToggle}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title={isLiked ? 'Unlike' : 'Like'}
          >
            {isLiked
              ? <Heart className="w-3.5 h-3.5 fill-current text-green-400" />
              : <HeartOff className="w-3.5 h-3.5 text-gray-500 hover:text-white" />}
          </button>
        )}

        
        {/* Support Button */}
        <button
          onClick={(e) => { e.stopPropagation(); setShowTipModal(true); }}
          className="p-1.5 rounded-lg hover:bg-white/10 text-pink-400 hover:text-pink-300 transition-colors mr-1"
          title="Support Artist"
        >
          <Coins className="w-3.5 h-3.5" />
        </button>

        {/* More menu */}
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {showMenu && (
            <>
              {/* Backdrop to close */}
              <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setShowMenu(false); }} />
              <div className="absolute right-0 bottom-full mb-1 glass-dark rounded-xl shadow-2xl z-50 py-1.5 min-w-[170px] animate-scale-in">
                <button onClick={handlePlayNow} className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 flex items-center space-x-2.5 transition-colors">
                  <Play className="w-3.5 h-3.5 text-green-400" />
                  <span>Play Now</span>
                </button>
                <button onClick={handlePlayNext} className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 flex items-center space-x-2.5 transition-colors">
                  <SkipForward className="w-3.5 h-3.5 text-blue-400" />
                  <span>Play Next</span>
                </button>
                <button onClick={handleAddToQueue} className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 flex items-center space-x-2.5 transition-colors">
                  <ListPlus className="w-3.5 h-3.5 text-purple-400" />
                  <span>Add to Queue</span>
                </button>
                {showAddToPlaylist && onAddToPlaylist && (
                  <button onClick={(e) => { e.stopPropagation(); onAddToPlaylist(song); setShowMenu(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 flex items-center space-x-2.5 transition-colors">
                    <Plus className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Add to Playlist</span>
                  </button>
                )}
                <div className="h-px bg-white/5 my-1 mx-3" />
                <button onClick={handleDownload} className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 flex items-center space-x-2.5 transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Duration */}
      <span className="text-gray-600 text-xs ml-3 flex-shrink-0 group-hover:opacity-50 transition-opacity">
        {typeof song.duration === 'number' ? formatDuration(song.duration) : song.duration || '—'}
      </span>


      {/* Tipping Modal */}
      {showTipModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
          onClick={(e) => { e.stopPropagation(); setShowTipModal(false); }}
        >
          <div 
            className="bg-[#18181b] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center mb-6 text-center">
              <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-pink-500/30">
                <img 
                  src={song.album?.cover_url || 'https://images.pexels.com/photos/167635/pexels-photo-167635.jpeg'} 
                  alt="Artist" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h3 className="text-xl font-bold text-white">Support {song.artist?.name || 'Artist'}</h3>
              <p className="text-gray-400 text-sm mt-1">Send a tip to show your appreciation!</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[5, 10, 20].map((amount) => (
                <button
                  key={amount}
                  disabled={isProcessingTip}
                  onClick={() => handleTip(amount)}
                  className="py-3 rounded-xl font-bold border border-white/10 hover:border-pink-500 hover:bg-pink-500/10 transition-all text-white disabled:opacity-50"
                >
                  ${amount}
                </button>
              ))}
            </div>

            <button
               disabled={isProcessingTip}
               onClick={() => setShowTipModal(false)}
               className="w-full py-3 rounded-xl font-medium text-gray-400 hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            
            {isProcessingTip && (
                <div className="absolute inset-0 bg-[#18181b]/80 rounded-2xl flex flex-col items-center justify-center backdrop-blur-sm">
                    <div className="w-8 h-8 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mb-3"></div>
                    <p className="text-white font-medium animate-pulse">Processing Tip...</p>
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SongCard;
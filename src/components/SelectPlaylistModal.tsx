import React from 'react';
import { X, ListMusic } from 'lucide-react';
import { Playlist } from '../hooks/useAPI';

interface SelectPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlists: Playlist[];
  onSelect: (playlistId: string) => Promise<void> | void;
}

const SelectPlaylistModal: React.FC<SelectPlaylistModalProps> = ({ isOpen, onClose, playlists, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <ListMusic className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Add to playlist
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Choose a playlist to add this song
          </p>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto">
          {playlists.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">You have no playlists yet.</p>
          ) : (
            playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => onSelect(playlist.id)}
                className="w-full text-left p-3 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white transition-colors"
              >
                <div className="flex items-center">
                  <img
                    src={playlist.cover_url || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300'}
                    alt={playlist.name}
                    className="w-10 h-10 rounded mr-3"
                  />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{playlist.name}</p>
                    {playlist.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{playlist.description}</p>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="pt-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectPlaylistModal;



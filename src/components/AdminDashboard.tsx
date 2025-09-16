import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Upload, Music, Users, Disc, Edit, Trash2, Play, Pause, Settings, Eye, Search, Plus, X, Save, AlertTriangle } from 'lucide-react';
import UploadSong from './UploadSong';
import { availableSongs } from '../utils/localData';
import { Song } from '../hooks/useAPI';
import toast from 'react-hot-toast';

type TabKey = 'overview' | 'upload' | 'songs' | 'artists' | 'albums' | 'users';

interface EditingSong {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: number;
}

const AdminDashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [tab, setTab] = useState<TabKey>('overview');
  const [songs, setSongs] = useState<Song[]>(availableSongs);
  const [editingSong, setEditingSong] = useState<EditingSong | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});
  const [audioElements, setAudioElements] = useState<{ [key: string]: HTMLAudioElement }>({});
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      toast.error('Access denied. Admin privileges required.');
    }
  }, [isAdmin]);

  // Filter songs based on search
  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.genre?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Audio preview functions
  const toggleAudioPreview = (song: Song) => {
    const songId = song.id;
    
    // Stop any currently playing audio
    if (currentlyPlaying && currentlyPlaying !== songId) {
      if (audioElements[currentlyPlaying]) {
        audioElements[currentlyPlaying].pause();
        setIsPlaying(prev => ({ ...prev, [currentlyPlaying]: false }));
      }
    }

    if (!audioElements[songId]) {
      const audio = new Audio(song.audio_url || '');
      audio.addEventListener('ended', () => {
        setIsPlaying(prev => ({ ...prev, [songId]: false }));
        setCurrentlyPlaying(null);
      });
      setAudioElements(prev => ({ ...prev, [songId]: audio }));
    }

    const audio = audioElements[songId];
    
    if (isPlaying[songId]) {
      audio.pause();
      setIsPlaying(prev => ({ ...prev, [songId]: false }));
      setCurrentlyPlaying(null);
    } else {
      audio.play().catch(console.error);
      setIsPlaying(prev => ({ ...prev, [songId]: true }));
      setCurrentlyPlaying(songId);
    }
  };

  // Edit song functions
  const startEditingSong = (song: Song) => {
    setEditingSong({
      id: song.id,
      title: song.title,
      artist: song.artist?.name || '',
      genre: song.genre || '',
      duration: song.duration
    });
  };

  const saveEditingSong = () => {
    if (!editingSong) return;
    
    setSongs(prev => prev.map(song => 
      song.id === editingSong.id 
        ? { 
            ...song, 
            title: editingSong.title,
            artist: song.artist ? { ...song.artist, name: editingSong.artist } : { id: 'unknown', name: editingSong.artist, image_url: null },
            genre: editingSong.genre,
            duration: editingSong.duration
          }
        : song
    ));
    
    setEditingSong(null);
    toast.success('Song updated successfully!');
  };

  const cancelEditingSong = () => {
    setEditingSong(null);
  };

  // Delete song function
  const deleteSong = (songId: string) => {
    setSongs(prev => prev.filter(song => song.id !== songId));
    setShowDeleteConfirm(null);
    
    // Stop and clean up audio if playing
    if (audioElements[songId]) {
      audioElements[songId].pause();
      delete audioElements[songId];
    }
    if (isPlaying[songId]) {
      setIsPlaying(prev => ({ ...prev, [songId]: false }));
    }
    if (currentlyPlaying === songId) {
      setCurrentlyPlaying(null);
    }
    
    toast.success('Song deleted successfully!');
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format file size
  const formatFileSize = (url: string) => {
    // This is a placeholder - in a real app you'd get this from the server
    return 'N/A';
  };

  // Get genre color
  const getGenreColor = (genre: string) => {
    const colors: { [key: string]: string } = {
      'Romantic Songs': 'bg-pink-500/20 text-pink-400',
      'Sad / Heartbreak Songs': 'bg-blue-500/20 text-blue-400',
      'Item Songs': 'bg-yellow-500/20 text-yellow-400',
      'Devotional / Bhajans': 'bg-orange-500/20 text-orange-400',
      'Patriotic Songs': 'bg-green-500/20 text-green-400',
      'Festive Songs': 'bg-purple-500/20 text-purple-400'
    };
    return colors[genre] || 'bg-gray-500/20 text-gray-400';
  };

  if (!isAdmin) {
    return (
      <div className="flex-1 bg-gradient-to-b from-red-800 to-black text-white overflow-y-auto">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-gray-300">Admin privileges required to access this dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-gray-800 to-black dark:from-gray-800 dark:to-gray-900 text-white overflow-y-auto">
      {/* Header */}
      <div className="px-6 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user?.fullName || user?.email}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-400">Admin Panel</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {([
            ['overview', 'Overview', Eye],
            ['upload', 'Upload Songs', Upload],
            ['songs', 'Manage Songs', Music],
            ['artists', 'Artists', Users],
            ['albums', 'Albums', Disc],
            ['users', 'Users', Users],
          ] as [TabKey, string, any][]).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                tab === key 
                  ? 'bg-green-500 text-black font-medium' 
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        {/* Overview Tab */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Songs</p>
                    <p className="text-white text-2xl font-bold">{songs.length}</p>
                  </div>
                  <Music className="w-8 h-8 text-blue-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Total Artists</p>
                    <p className="text-white text-2xl font-bold">{new Set(songs.map(s => s.artist?.name).filter(Boolean)).size}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Genres</p>
                    <p className="text-white text-2xl font-bold">{new Set(songs.map(s => s.genre)).size}</p>
                  </div>
                  <Disc className="w-8 h-8 text-purple-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Total Duration</p>
                    <p className="text-white text-2xl font-bold">{Math.floor(songs.reduce((acc, song) => acc + song.duration, 0) / 60)}m</p>
                  </div>
                  <Play className="w-8 h-8 text-orange-200" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Songs</h3>
              <div className="space-y-3">
                {songs.slice(0, 5).map((song) => (
                  <div key={song.id} className="flex items-center space-x-4 p-3 bg-gray-700 rounded-lg">
                    <img
                      src={song.album?.cover_url || ''}
                      alt={song.title}
                      className="w-12 h-12 rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{song.title}</p>
                      <p className="text-sm text-gray-400">{song.artist?.name || 'Unknown Artist'}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${getGenreColor(song.genre || '')}`}>
                      {song.genre || 'Unknown'}
                    </span>
                    <span className="text-sm text-gray-400">{formatDuration(song.duration)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Upload Tab */}
        {tab === 'upload' && <UploadSong />}

        {/* Songs Management Tab */}
        {tab === 'songs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Manage Songs ({filteredSongs.length})</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search songs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Songs Table */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Song</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Artist</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Genre</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Duration</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredSongs.map((song) => (
                      <tr key={song.id} className="hover:bg-gray-700/50">
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={song.album?.cover_url || ''}
                              alt={song.title}
                              className="w-12 h-12 rounded"
                            />
                            <div>
                              {editingSong?.id === song.id ? (
                                <input
                                  type="text"
                                  value={editingSong.title}
                                  onChange={(e) => setEditingSong(prev => prev ? {...prev, title: e.target.value} : null)}
                                  className="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                              ) : (
                                <p className="font-medium text-white">{song.title}</p>
                              )}
                              <p className="text-sm text-gray-400">ID: {song.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {editingSong?.id === song.id ? (
                            <input
                              type="text"
                              value={editingSong.artist}
                              onChange={(e) => setEditingSong(prev => prev ? {...prev, artist: e.target.value} : null)}
                              className="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                          ) : (
                            <p className="text-white">{song.artist?.name || 'Unknown Artist'}</p>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          {editingSong?.id === song.id ? (
                            <select
                              value={editingSong.genre}
                              onChange={(e) => setEditingSong(prev => prev ? {...prev, genre: e.target.value} : null)}
                              className="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none focus:ring-1 focus:ring-green-500"
                            >
                              <option value="Romantic Songs">Romantic Songs</option>
                              <option value="Sad / Heartbreak Songs">Sad / Heartbreak Songs</option>
                              <option value="Item Songs">Item Songs</option>
                              <option value="Devotional / Bhajans">Devotional / Bhajans</option>
                              <option value="Patriotic Songs">Patriotic Songs</option>
                              <option value="Festive Songs">Festive Songs</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-1 rounded-full text-xs ${getGenreColor(song.genre || '')}`}>
                              {song.genre || 'Unknown'}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          {editingSong?.id === song.id ? (
                            <input
                              type="number"
                              value={editingSong.duration}
                              onChange={(e) => setEditingSong(prev => prev ? {...prev, duration: parseInt(e.target.value)} : null)}
                              className="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none focus:ring-1 focus:ring-green-500 w-20"
                            />
                          ) : (
                            <p className="text-white">{formatDuration(song.duration)}</p>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            {editingSong?.id === song.id ? (
                              <>
                                <button
                                  onClick={saveEditingSong}
                                  className="p-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                                  title="Save"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={cancelEditingSong}
                                  className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                                  title="Cancel"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => toggleAudioPreview(song)}
                                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                                  title="Preview"
                                >
                                  {isPlaying[song.id] ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => startEditingSong(song)}
                                  className="p-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setShowDeleteConfirm(song.id)}
                                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredSongs.length === 0 && (
              <div className="text-center py-12">
                <Music className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-300 mb-2">No songs found</h3>
                <p className="text-gray-500">
                  {searchQuery ? `No songs match "${searchQuery}"` : 'No songs available'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Other tabs placeholder */}
        {(['artists', 'albums', 'users'] as TabKey[]).includes(tab) && (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              {tab === 'artists' && <Users className="w-8 h-8 text-gray-400" />}
              {tab === 'albums' && <Disc className="w-8 h-8 text-gray-400" />}
              {tab === 'users' && <Users className="w-8 h-8 text-gray-400" />}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{tab.charAt(0).toUpperCase() + tab.slice(1)} Management</h3>
            <p className="text-gray-400 mb-4">This feature is coming soon.</p>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">
              <Plus className="w-4 h-4 mr-2 inline" />
              Add New {tab.slice(0, -1)}
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold text-white">Confirm Delete</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this song? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteSong(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
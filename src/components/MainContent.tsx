import React, { useState, useEffect } from 'react';
import { Play, Heart, X, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAPI, Song, Playlist } from '../hooks/useAPI';
import SearchBar from './SearchBar';
import SongCard from './SongCard';
import SelectPlaylistModal from './SelectPlaylistModal';
import AdminDashboard from './AdminDashboard';
import AuthModal from './Auth/AuthModal';
import toast from 'react-hot-toast';

interface MainContentProps {
  currentView: string;
  onSongSelect: (song: Song) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setCurrentView?: (view: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({ 
  currentView, 
  onSongSelect, 
  searchQuery, 
  setSearchQuery,
  setCurrentView,
}) => {
  const { user } = useAuth();
  const { songs, playlists, loading, fetchSongs, getPlaylistWithSongs, likedSongs, addSongToPlaylist, deletePlaylist, removeSongFromPlaylist } = useAPI();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSelectPlaylist, setShowSelectPlaylist] = useState(false);
  const [pendingSongId, setPendingSongId] = useState<string | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    if (searchQuery) {
      fetchSongs(searchQuery);
    } else {
      fetchSongs();
    }
  }, [searchQuery]);

  useEffect(() => {
    setFilteredSongs(songs);
  }, [songs]);

  useEffect(() => {
    if (currentView.startsWith('playlist:')) {
      const playlistId = currentView.replace('playlist:', '');
      getPlaylistWithSongs(playlistId).then(playlist => {
        setCurrentPlaylist(playlist);
      });
    } else {
      setCurrentPlaylist(null);
    }
  }, [currentView]);

  const handleSongPlay = (song: Song) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    onSongSelect(song);
  };

  const handleAddToPlaylistClick = (song: Song) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setPendingSongId(song.id);
    setShowSelectPlaylist(true);
  };

  const handleSelectPlaylist = async (playlistId: string) => {
    if (!pendingSongId) return;
    await addSongToPlaylist(playlistId, pendingSongId);
    setShowSelectPlaylist(false);
    setPendingSongId(null);
  };

  // Search View
  if (currentView === 'search') {
    return (
      <>
        <div className="flex-1 bg-gradient-to-b from-gray-800 to-black dark:from-gray-800 dark:to-gray-900 text-white overflow-y-auto">
          <div className="p-6">
            <SearchBar onSearch={setSearchQuery} />
            
            {searchQuery && (
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Search Results</h2>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                ) : filteredSongs.length > 0 ? (
                  <div className="space-y-2">
                    {filteredSongs.map((song) => (
                      <SongCard
                        key={song.id}
                        song={song}
                        onPlay={handleSongPlay}
                        showAddToPlaylist={!!user}
                        onAddToPlaylist={handleAddToPlaylistClick}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No results found for "{searchQuery}"</p>
                )}
              </div>
            )}

            {!searchQuery && (
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Browse all</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Romantic Songs', 'Sad / Heartbreak Songs', 'Fun Songs', 'Devotional / Bhajans', 'Patriotic Songs', 'Festive Songs'].map((genre) => (
                    <div
                      key={genre}
                      className="bg-gradient-to-br from-purple-600 to-blue-600 p-4 rounded-lg cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setSearchQuery(genre)}
                    >
                      <h3 className="font-bold text-lg">{genre}</h3>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  // Library View
  if (currentView === 'library') {
    return (
      <>
        <div className="flex-1 bg-gradient-to-b from-gray-800 to-black dark:from-gray-800 dark:to-gray-900 text-white overflow-y-auto">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-8">Your Library</h1>
            
            {!user ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-4">Sign in to see your library</h2>
                <div className="space-y-4">
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors mr-4"
                  >
                    Sign In / Sign Up
                  </button>
                  <br />
                  <button
                    onClick={async () => {
                      const authContext = useAuth();
                      await authContext.signIn('demo@example.com', 'password123');
                    }}
                    className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors text-sm"
                  >
                    Quick Demo Login
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">Your Playlists ({playlists.length})</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {playlists.map((playlist) => (
                    <div
                      key={playlist.id}
                      className="bg-gray-800 dark:bg-gray-700 p-4 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors cursor-pointer group relative"
                    >
                      <div className="relative mb-4" onClick={() => setCurrentView && setCurrentView(`playlist:${playlist.id}`)}>
                        <img
                          src={playlist.cover_url || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300'}
                          alt={playlist.name}
                          className="w-full aspect-square rounded-md"
                        />
                        <button className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                          <Play className="w-5 h-5 text-black ml-1" />
                        </button>
                      </div>
                      <div onClick={() => setCurrentView && setCurrentView(`playlist:${playlist.id}`)}>
                        <h3 className="font-bold mb-1 truncate">{playlist.name}</h3>
                        <p className="text-gray-400 text-sm truncate">{playlist.description || 'No description'}</p>
                        <p className="text-gray-500 text-xs mt-1">{playlist.songs?.length || 0} songs</p>
                      </div>
                      
                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Are you sure you want to delete "${playlist.name}"?`)) {
                            deletePlaylist(playlist.id);
                          }
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        title="Delete playlist"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                  
                  {/* Add new playlist card */}
                  <div
                    className="bg-gray-800 dark:bg-gray-700 p-4 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors cursor-pointer group border-2 border-dashed border-gray-600 flex flex-col items-center justify-center aspect-square"
                    onClick={() => {
                      // This will be handled by the sidebar Create Playlist button
                      toast.success('Use the "Create Playlist" button in the sidebar');
                    }}
                  >
                    <Plus className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-gray-400 text-sm text-center">Create New Playlist</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  // Liked Songs View
  if (currentView === 'liked') {
    const likedSongsData = songs.filter(song => likedSongs.includes(song.id));

    return (
      <>
        <div className="flex-1 bg-gradient-to-b from-purple-800 to-black text-white overflow-y-auto">
          <div className="p-6">
            <div className="flex items-end space-x-6 mb-8">
              <div className="w-48 h-48 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md flex items-center justify-center">
                <Heart className="w-20 h-20 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-300 uppercase tracking-wide">Playlist</p>
                <h1 className="text-5xl font-bold mb-4">Liked Songs</h1>
                <p className="text-gray-300">
                  {user?.email} • {likedSongsData.length} songs
                </p>
              </div>
            </div>

            {!user ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-4">Sign in to see your liked songs</h2>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors"
                >
                  Sign In
                </button>
              </div>
            ) : likedSongsData.length > 0 ? (
              <div className="space-y-2">
                {likedSongsData.map((song, index) => (
                  <div key={song.id} className="flex items-center">
                    <span className="text-gray-400 text-sm w-8 mr-4">{index + 1}</span>
                    <div className="flex-1">
                      <SongCard song={song} onPlay={handleSongPlay} showAddToPlaylist={!!user} onAddToPlaylist={handleAddToPlaylistClick} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-4">No liked songs yet</h2>
                <p className="text-gray-400 mb-6">Start exploring music and like songs you enjoy!</p>
                <button
                  onClick={() => setCurrentView && setCurrentView('search')}
                  className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors"
                >
                  Discover Music
                </button>
              </div>
            )}
          </div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  // Playlist View
  if (currentView.startsWith('playlist:') && currentPlaylist) {
    return (
      <>
        <div className="flex-1 bg-gradient-to-b from-blue-800 to-black text-white overflow-y-auto">
          <div className="p-6">
            <div className="flex items-end space-x-6 mb-8">
              <img
                src={currentPlaylist.cover_url || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300'}
                alt={currentPlaylist.name}
                className="w-48 h-48 rounded-md"
              />
              <div>
                <p className="text-sm text-gray-300 uppercase tracking-wide">Playlist</p>
                <h1 className="text-5xl font-bold mb-4">{currentPlaylist.name}</h1>
                <p className="text-gray-300 mb-2">{currentPlaylist.description}</p>
                <p className="text-gray-300">
                  {user?.email} • {currentPlaylist.songs?.length || 0} songs
                </p>
              </div>
            </div>

            {currentPlaylist.songs && currentPlaylist.songs.length > 0 ? (
              <div className="space-y-2">
                {currentPlaylist.songs.map((song, index) => (
                  <div key={song.id} className="flex items-center group">
                    <span className="text-gray-400 text-sm w-8 mr-4">{index + 1}</span>
                    <div className="flex-1">
                      <SongCard song={song} onPlay={handleSongPlay} showAddToPlaylist={!!user} onAddToPlaylist={handleAddToPlaylistClick} />
                    </div>
                    {/* Remove from playlist button */}
                    <button
                      onClick={() => {
                        if (window.confirm(`Remove "${song.title}" from this playlist?`)) {
                          removeSongFromPlaylist(currentPlaylist.id, song.id);
                          // Refresh the current playlist view
                          getPlaylistWithSongs(currentPlaylist.id).then(playlist => {
                            setCurrentPlaylist(playlist);
                          });
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity ml-4 p-2 text-red-400 hover:text-red-300"
                      title="Remove from playlist"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-4">This playlist is empty</h2>
                <p className="text-gray-400 mb-6">Add some songs to get started!</p>
                <button
                  onClick={() => setCurrentView && setCurrentView('search')}
                  className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors"
                >
                  Find Music
                </button>
              </div>
            )}
          </div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  // Admin Upload View
  if (currentView === 'admin') {
    return <AdminDashboard />;
  }

  // Home View
  return (
    <>
      <div className="flex-1 bg-gradient-to-b from-gray-800 to-black dark:from-gray-800 dark:to-gray-900 text-white overflow-y-auto">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-8">{getGreeting()}{user ? `, ${user.email?.split('@')[0]}` : ''}</h1>
          
          {/* Recently Played */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {playlists.slice(0, 6).map((playlist) => (
              <div
                key={playlist.id}
                className="bg-gray-800 dark:bg-gray-700 rounded-md flex items-center p-2 hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors cursor-pointer group"
                onClick={() => setCurrentView && setCurrentView(`playlist:${playlist.id}`)}
              >
                <img
                  src={playlist.cover_url || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300'}
                  alt={playlist.name}
                  className="w-16 h-16 rounded-md mr-4"
                />
                <div className="flex-1">
                  <p className="font-medium truncate">{playlist.name}</p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity mr-2">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                    <Play className="w-5 h-5 text-black ml-1" />
                  </div>
                </button>
              </div>
            ))}
          </div>

          {/* Recently played tracks */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Available Songs</h2>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {songs.slice(0, 10).map((song, index) => (
                  <div key={song.id} className="flex items-center">
                    <span className="text-gray-400 text-sm w-8 mr-4">{index + 1}</span>
                    <div className="flex-1">
                      <SongCard 
                        song={song} 
                        onPlay={handleSongPlay}
                        showAddToPlaylist={!!user}
                        onAddToPlaylist={handleAddToPlaylistClick}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
      <SelectPlaylistModal
        isOpen={showSelectPlaylist}
        onClose={() => setShowSelectPlaylist(false)}
        playlists={playlists}
        onSelect={handleSelectPlaylist}
      />
    </>
  );
};

export default MainContent;
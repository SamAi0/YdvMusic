import React, { useState, useEffect } from 'react';
import {
  Play, Heart, X, Plus, Music2, Music4, Church, Flag, Sparkles,
  TrendingUp, Clock, Star, Headphones, Library
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAPI, Song, Playlist } from '../hooks/useAPI';
import SearchBar from './SearchBar';
import SongCard from './SongCard';
import SelectPlaylistModal from './SelectPlaylistModal';
import AdminDashboard from './AdminDashboard';
import AuthModal from './Auth/AuthModal';
import ProtectedRoute from './ProtectedRoute';
import Movies from './Movies';
import MovieDetail from './MovieDetail';

import Studio from './Studio';
import { useQueue } from '../contexts/QueueContext';
import toast from 'react-hot-toast';

interface MainContentProps {
  currentView: string;
  onSongSelect: (song: Song) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setCurrentView?: (view: string) => void;
}

// ── Skeleton loader ──────────────────────────────────────────
const SongSkeleton: React.FC = () => (
  <div className="flex items-center px-3 py-2.5 rounded-xl">
    <div className="w-8 mr-3" />
    <div className="w-10 h-10 rounded-lg bg-white/5 shimmer mr-3 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-white/5 shimmer rounded w-3/5" />
      <div className="h-2.5 bg-white/5 shimmer rounded w-2/5" />
    </div>
    <div className="w-8 h-2.5 bg-white/5 shimmer rounded ml-3" />
  </div>
);

// ── Category card ────────────────────────────────────────────
const categories = [
  { name: 'Romantic Songs', icon: Heart, from: 'from-pink-600', to: 'to-rose-800' },
  { name: 'Sad / Heartbreak', icon: Music2, from: 'from-blue-600', to: 'to-indigo-800' },
  { name: 'Item Songs', icon: Music4, from: 'from-orange-500', to: 'to-amber-700' },
  { name: 'Devotional / Bhajans', icon: Church, from: 'from-amber-500', to: 'to-orange-700' },
  { name: 'Patriotic Songs', icon: Flag, from: 'from-green-600', to: 'to-teal-800' },
  { name: 'Festive Songs', icon: Sparkles, from: 'from-purple-600', to: 'to-pink-800' },
];

// ── Feature stat pills ───────────────────────────────────────
const stats = [
  { icon: Headphones, label: 'Songs', value: '18+' },
  { icon: TrendingUp, label: 'Genres', value: '6' },
  { icon: Star, label: 'HD Audio', value: '✓' },
  { icon: Clock, label: 'Free', value: '100%' },
];

const MainContent: React.FC<MainContentProps> = ({
  currentView, onSongSelect, searchQuery, setSearchQuery, setCurrentView,
}) => {
  const { user } = useAuth();
  const { songs, playlists, loading, fetchSongs, getPlaylistWithSongs, likedSongs, addSongToPlaylist, deletePlaylist, removeSongFromPlaylist } = useAPI();
  const { setQueue } = useQueue();

  const typedFetchSongs = fetchSongs as (params?: string | { search?: string; genre?: string; mood?: string; tempo?: string; album_id?: string }) => Promise<void>;

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSelectPlaylist, setShowSelectPlaylist] = useState(false);
  const [pendingSongId, setPendingSongId] = useState<string | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState({ genre: '', mood: '', tempo: '', album_id: '' });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const params: any = {};
    if (searchQuery) params.search = searchQuery;
    if (advancedFilters.genre) params.genre = advancedFilters.genre;
    if (advancedFilters.mood) params.mood = advancedFilters.mood;
    if (advancedFilters.tempo) params.tempo = advancedFilters.tempo;
    if (advancedFilters.album_id) params.album_id = advancedFilters.album_id;
    typedFetchSongs(params);
  }, [searchQuery, advancedFilters]);

  useEffect(() => { setFilteredSongs(songs); }, [songs]);

  useEffect(() => {
    if (currentView.startsWith('playlist:')) {
      getPlaylistWithSongs(currentView.replace('playlist:', '')).then(setCurrentPlaylist);
    } else {
      setCurrentPlaylist(null);
    }
  }, [currentView]);

  const handleSongPlay = (song: Song) => {
    if (!user) { setShowAuthModal(true); return; }
    onSongSelect(song);
  };

  const handleAddToPlaylistClick = (song: Song) => {
    if (!user) { setShowAuthModal(true); return; }
    setPendingSongId(song.id);
    setShowSelectPlaylist(true);
  };

  const handleSelectPlaylist = async (playlistId: string) => {
    if (!pendingSongId) return;
    await addSongToPlaylist(playlistId, pendingSongId);
    setShowSelectPlaylist(false);
    setPendingSongId(null);
  };

  const handlePlayAll = (songList: Song[]) => {
    if (!user) { setShowAuthModal(true); return; }
    if (songList.length === 0) return;
    setQueue(songList, 0);
    onSongSelect(songList[0]);
    toast.success(`Playing ${songList.length} songs`);
  };

  // ── Shared auth modal footer ─────────────────────────────────
  const AuthModalFooter = () => (
    <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
  );

  // ═══════════════════════════════════════
  //   SEARCH VIEW
  // ═══════════════════════════════════════
  if (currentView === 'search') {
    return (
      <>
        <div className="flex-1 bg-black text-white overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <SearchBar onSearch={(query, filters) => {
                setSearchQuery(query);
                if (filters) setAdvancedFilters(p => ({ ...p, ...filters }));
                else setAdvancedFilters({ genre: '', mood: '', tempo: '', album_id: '' });
              }} />
            </div>

            {searchQuery ? (
              <div className="animate-fade-in-up">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Results for "{searchQuery}"</h2>
                  {filteredSongs.length > 0 && (
                    <button onClick={() => handlePlayAll(filteredSongs)} className="flex items-center space-x-2 bg-green-500 hover:bg-green-400 text-black font-semibold px-4 py-1.5 rounded-full text-sm transition-colors">
                      <Play className="w-3.5 h-3.5" /> <span>Play All</span>
                    </button>
                  )}
                </div>
                {loading ? (
                  <div className="space-y-1">{Array.from({ length: 6 }).map((_, i) => <SongSkeleton key={i} />)}</div>
                ) : filteredSongs.length > 0 ? (
                  <div className="space-y-0.5">
                    {filteredSongs.map((song, i) => (
                      <SongCard key={song.id} song={song} index={i} onPlay={handleSongPlay}
                        showAddToPlaylist={!!user} onAddToPlaylist={handleAddToPlaylistClick} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Music2 className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">No results for "{searchQuery}"</p>
                    <p className="text-gray-600 text-sm mt-1">Try a different search or browse categories below</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="animate-fade-in-up">
                <h2 className="text-xl font-bold mb-4">Browse Categories</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categories.map((cat, i) => {
                    const Icon = cat.icon;
                    return (
                      <div
                        key={cat.name}
                        className={`bg-gradient-to-br ${cat.from} ${cat.to} p-5 rounded-2xl cursor-pointer hover:scale-[1.03] transition-all duration-300 shadow-lg group relative overflow-hidden`}
                        style={{ animationDelay: `${i * 60}ms` }}
                        onClick={() => setSearchQuery(cat.name)}
                      >
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        <Icon className="w-7 h-7 text-white/80 mb-2 group-hover:scale-110 transition-transform" />
                        <p className="text-white font-semibold text-sm leading-tight">{cat.name}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        <AuthModalFooter />
      </>
    );
  }

  // ═══════════════════════════════════════
  //   LIBRARY VIEW
  // ═══════════════════════════════════════
  if (currentView === 'library') {
    return (
      <>
        <div className="flex-1 bg-black text-white overflow-y-auto">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Your Library</h1>
            {!user ? (
              <div className="text-center py-16">
                <Library className="w-14 h-14 text-gray-700 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Sign in to see your library</h2>
                <p className="text-gray-500 text-sm mb-6">Your playlists and saved tracks will appear here</p>
                <button onClick={() => setShowAuthModal(true)}
                  className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-2.5 rounded-full transition-colors text-sm">
                  Sign In / Sign Up
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-400 text-sm">{playlists.length} playlist{playlists.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {playlists.map((playlist, i) => (
                    <div
                      key={playlist.id}
                      className="group relative bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-all cursor-pointer animate-fade-in-up"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <div className="relative mb-3" onClick={() => setCurrentView && setCurrentView(`playlist:${playlist.id}`)}>
                        <img
                          src={playlist.cover_url || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300'}
                          alt={playlist.name}
                          className="w-full aspect-square rounded-lg object-cover"
                        />
                        <button className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xl translate-y-1 group-hover:translate-y-0 hover:bg-green-400">
                          <Play className="w-4 h-4 text-black ml-0.5" />
                        </button>
                      </div>
                      <div onClick={() => setCurrentView && setCurrentView(`playlist:${playlist.id}`)}>
                        <h3 className="font-semibold text-sm truncate">{playlist.name}</h3>
                        <p className="text-gray-500 text-xs mt-0.5">{playlist.songs?.length || 0} songs</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); if (window.confirm(`Delete "${playlist.name}"?`)) deletePlaylist(playlist.id); }}
                        className="absolute top-4 right-4 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-400 shadow"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                  {/* Create new */}
                  <div
                    className="border-2 border-dashed border-white/10 p-3 rounded-xl hover:border-white/20 cursor-pointer transition-colors flex flex-col items-center justify-center aspect-square"
                    onClick={() => toast.success('Use "Create Playlist" in the sidebar')}
                  >
                    <Plus className="w-8 h-8 text-gray-600 mb-2" />
                    <p className="text-gray-600 text-xs text-center">New Playlist</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <AuthModalFooter />
      </>
    );
  }

  // ═══════════════════════════════════════
  //   LIKED SONGS VIEW
  // ═══════════════════════════════════════
  if (currentView === 'liked') {
    const likedData = songs.filter(s => likedSongs.includes(s.id));
    return (
      <>
        <div className="flex-1 text-white overflow-y-auto" style={{ background: 'linear-gradient(180deg, #3b1e7c 0%, #1a0a3c 25%, #000 60%)' }}>
          <div className="p-6">
            {/* Header */}
            <div className="flex items-end space-x-5 mb-8">
              <div className="w-44 h-44 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xl"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>
                <Heart className="w-20 h-20 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-1">Playlist</p>
                <h1 className="text-5xl font-black mb-3">Liked Songs</h1>
                <p className="text-gray-300 text-sm">{user?.email} · {likedData.length} songs</p>
                {likedData.length > 0 && (
                  <button onClick={() => handlePlayAll(likedData)} className="mt-4 flex items-center space-x-2 bg-green-500 hover:bg-green-400 text-black font-bold px-5 py-2 rounded-full text-sm transition-colors shadow-lg">
                    <Play className="w-4 h-4" /><span>Play All</span>
                  </button>
                )}
              </div>
            </div>
            {!user ? (
              <div className="text-center py-12">
                <h2 className="text-lg font-semibold mb-4">Sign in to see liked songs</h2>
                <button onClick={() => setShowAuthModal(true)} className="bg-white text-black font-bold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors">Sign In</button>
              </div>
            ) : likedData.length > 0 ? (
              <div className="space-y-0.5">
                {likedData.map((song, i) => (
                  <SongCard key={song.id} song={song} index={i} onPlay={handleSongPlay}
                    showAddToPlaylist onAddToPlaylist={handleAddToPlaylistClick} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <h2 className="text-lg font-semibold mb-2">No liked songs yet</h2>
                <p className="text-gray-500 text-sm mb-5">Heart a song to save it here</p>
                <button onClick={() => setCurrentView && setCurrentView('search')} className="bg-white text-black font-bold px-5 py-2 rounded-full hover:bg-gray-100 text-sm transition-colors">Browse Music</button>
              </div>
            )}
          </div>
        </div>
        <AuthModalFooter />
      </>
    );
  }

  // ═══════════════════════════════════════
  //   PLAYLIST VIEW
  // ═══════════════════════════════════════
  if (currentView.startsWith('playlist:') && currentPlaylist) {
    return (
      <>
        <div className="flex-1 text-white overflow-y-auto" style={{ background: 'linear-gradient(180deg, #1e3a5c 0%, #0a1a2e 30%, #000 60%)' }}>
          <div className="p-6">
            <div className="flex items-end space-x-5 mb-8">
              <img
                src={currentPlaylist.cover_url || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300'}
                alt={currentPlaylist.name}
                className="w-44 h-44 rounded-2xl shadow-2xl object-cover flex-shrink-0"
              />
              <div>
                <p className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-1">Playlist</p>
                <h1 className="text-4xl font-black mb-1">{currentPlaylist.name}</h1>
                {currentPlaylist.description && <p className="text-gray-400 text-sm mb-1">{currentPlaylist.description}</p>}
                <p className="text-gray-400 text-sm">{user?.email} · {currentPlaylist.songs?.length || 0} songs</p>
                {(currentPlaylist.songs?.length ?? 0) > 0 && (
                  <button onClick={() => handlePlayAll(currentPlaylist.songs || [])} className="mt-4 flex items-center space-x-2 bg-green-500 hover:bg-green-400 text-black font-bold px-5 py-2 rounded-full text-sm transition-colors shadow-lg">
                    <Play className="w-4 h-4" /><span>Play All</span>
                  </button>
                )}
              </div>
            </div>
            {currentPlaylist.songs && currentPlaylist.songs.length > 0 ? (
              <div className="space-y-0.5">
                {currentPlaylist.songs.map((song, i) => (
                  <div key={song.id} className="flex items-center group">
                    <div className="flex-1">
                      <SongCard song={song} index={i} onPlay={handleSongPlay}
                        showAddToPlaylist={!!user} onAddToPlaylist={handleAddToPlaylistClick} />
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm(`Remove "${song.title}" from playlist?`)) {
                          removeSongFromPlaylist(currentPlaylist.id, song.id);
                          getPlaylistWithSongs(currentPlaylist.id).then(setCurrentPlaylist);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 ml-2 p-2 text-gray-600 hover:text-red-400 transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Plus className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <h2 className="text-lg font-semibold mb-2">This playlist is empty</h2>
                <button onClick={() => setCurrentView && setCurrentView('search')} className="bg-white text-black font-bold px-5 py-2 rounded-full hover:bg-gray-100 text-sm">Find Music</button>
              </div>
            )}
          </div>
        </div>
        <AuthModalFooter />
      </>
    );
  }

  // ═══════════════════════════════════════
  //   SPECIAL VIEWS
  // ═══════════════════════════════════════
  if (currentView === 'admin') return <ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>;
  if (currentView === 'movies') return <Movies setCurrentView={setCurrentView!} />;
  if (currentView.startsWith('movie:') && setCurrentView) return <MovieDetail movieId={currentView.replace('movie:', '')} setCurrentView={setCurrentView} />;
  if (currentView === 'studio') return <Studio />;

  // ═══════════════════════════════════════
  //   HOME VIEW
  // ═══════════════════════════════════════
  return (
    <>
      <div className="flex-1 bg-black text-white overflow-y-auto">
        {/* Hero Banner */}
        <div className="relative overflow-hidden px-6 pt-8 pb-10"
          style={{ background: 'linear-gradient(135deg, #0d1a0f 0%, #0a2218 40%, #000 100%)' }}>
          {/* Ambient blobs */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-green-500/10 rounded-full blur-3xl -translate-x-16 -translate-y-16" />
          <div className="absolute top-0 right-0 w-56 h-56 bg-emerald-400/8 rounded-full blur-3xl" />

          <div className="relative z-10">
            <p className="text-green-400 text-sm font-medium mb-1">
              {greeting()}{user ? `, ${user.fullName || user.email?.split('@')[0]}` : ''} 👋
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 text-shadow">
              Your Music,<br />Your Vibe
            </h1>
            <p className="text-gray-400 mb-6 max-w-md text-sm">
              Stream Hindi hits, create playlists, explore movies &amp; more — completely free.
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {!user ? (
                <>
                  <button onClick={() => setShowAuthModal(true)}
                    className="bg-green-500 hover:bg-green-400 text-black font-bold px-5 py-2.5 rounded-full text-sm transition-colors shadow-lg glow-green-sm">
                    Get Started Free
                  </button>
                  <button onClick={() => handlePlayAll(songs)}
                    className="bg-white/10 hover:bg-white/15 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-colors border border-white/10">
                    Browse Music
                  </button>
                </>
              ) : (
                <button onClick={() => handlePlayAll(songs)}
                  className="flex items-center space-x-2 bg-green-500 hover:bg-green-400 text-black font-bold px-5 py-2.5 rounded-full text-sm transition-colors shadow-lg">
                  <Play className="w-4 h-4" /><span>Play All Songs</span>
                </button>
              )}
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-3">
              {stats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center space-x-1.5 bg-white/5 border border-white/5 rounded-full px-3 py-1">
                  <Icon className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-white text-xs font-semibold">{value}</span>
                  <span className="text-gray-500 text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 pb-8">
          {/* Browse Categories */}
          <section className="mb-8 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Browse by Genre</h2>
              <button onClick={() => setCurrentView && setCurrentView('search')} className="text-sm text-green-400 hover:text-green-300 transition-colors">
                See all →
              </button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {categories.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.name}
                    className={`bg-gradient-to-br ${cat.from} ${cat.to} p-4 rounded-2xl cursor-pointer hover:scale-105 transition-all duration-300 group relative overflow-hidden text-center animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}
                    onClick={() => { setSearchQuery(cat.name); setCurrentView && setCurrentView('search'); }}
                  >
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors rounded-2xl" />
                    <Icon className="w-6 h-6 text-white/80 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                    <p className="text-white text-xs font-semibold leading-tight">{cat.name}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Quick Access playlists */}
          {playlists.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Quick Access</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {playlists.slice(0, 6).map((playlist, i) => (
                  <div
                    key={playlist.id}
                    className={`bg-white/5 rounded-xl flex items-center p-2.5 hover:bg-white/10 cursor-pointer group transition-all animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}
                    onClick={() => setCurrentView && setCurrentView(`playlist:${playlist.id}`)}
                  >
                    <img
                      src={playlist.cover_url || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=200'}
                      alt={playlist.name}
                      className="w-14 h-14 rounded-lg mr-3 object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{playlist.name}</p>
                      <p className="text-gray-500 text-xs">{playlist.songs?.length || 0} songs</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handlePlayAll(playlist.songs || []); }}
                      className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-green-400 shadow-lg flex-shrink-0"
                    >
                      <Play className="w-3.5 h-3.5 text-black ml-0.5" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Popular Songs */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Popular Songs</h2>
              {songs.length > 10 && (
                <button onClick={() => setCurrentView && setCurrentView('search')} className="text-sm text-green-400 hover:text-green-300 transition-colors">
                  See all →
                </button>
              )}
            </div>
            {/* Table header */}
            <div className="flex items-center px-3 mb-2 text-xs text-gray-600 font-medium uppercase tracking-wider">
              <span className="w-8 mr-3 text-center">#</span>
              <span className="w-10 mr-3" />
              <span className="flex-1">Title</span>
              <span className="w-16 text-right pr-4">Duration</span>
            </div>
            {loading ? (
              <div className="space-y-1">{Array.from({ length: 8 }).map((_, i) => <SongSkeleton key={i} />)}</div>
            ) : (
              <div className="space-y-0.5">
                {songs.slice(0, 10).map((song, i) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    index={i}
                    onPlay={handleSongPlay}
                    showAddToPlaylist={!!user}
                    onAddToPlaylist={handleAddToPlaylistClick}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <AuthModalFooter />
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
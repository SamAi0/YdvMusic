import React, { useState } from 'react';
import {
  Home, Search, Library, Plus, Heart, Sun, Moon, LogOut,
  Upload, User, Menu, X, Film, Mic2, ChevronRight, Music2, Palette,
  Gamepad2, BookOpen, GraduationCap, Github as Child, Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAPI } from '../hooks/useAPI';
import { useKidsMode } from '../contexts/KidsModeContext';
import CreatePlaylistModal from './CreatePlaylistModal';
import Profile from './Profile';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenBgSelector: () => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'library', label: 'Your Library', icon: Library },
  { id: 'liked', label: 'Liked Songs', icon: Heart },
  { id: 'movies', label: 'Movies', icon: Film },
  { id: 'studio', label: 'Studio', icon: Mic2 },
];

const kidsNavItems = [
  { id: 'kids-home', label: 'Home', icon: Home, color: 'text-blue-500', bg: 'hover:bg-blue-100' },
  { id: 'kids-games', label: 'Games', icon: Gamepad2, color: 'text-green-500', bg: 'hover:bg-green-100' },
  { id: 'kids-stories', label: 'Stories', icon: BookOpen, color: 'text-purple-500', bg: 'hover:bg-purple-100' },
  { id: 'kids-learn', label: 'Learn', icon: GraduationCap, color: 'text-yellow-500', bg: 'hover:bg-yellow-100' },
];

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, onOpenBgSelector }) => {
  const { user, isAdmin, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { playlists } = useAPI();
  const { isKidsMode, enterKidsMode, requestExitKidsMode } = useKidsMode();
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (id: string) =>
    currentView === id ||
    (id === 'movies' && (currentView.startsWith('movie:') || currentView.startsWith('video:')));

  const closeMobile = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl glass-dark text-white shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${isMobileMenuOpen ? 'translate-x-0 fixed inset-y-0 z-40' : '-translate-x-full md:translate-x-0'}
          w-60 bg-black text-white flex flex-col h-full transition-transform duration-300 ease-in-out
          border-r border-white/5
        `}
      >
        {/* Logo */}
        <div
          className="flex items-center px-5 py-5 cursor-pointer group"
          onClick={() => { setCurrentView('home'); closeMobile(); }}
        >
          <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center mr-3 shadow-lg glow-green-sm group-hover:scale-105 transition-transform">
            <Music2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-black tracking-tight gradient-text">PlayMusic</span>
        </div>

        {/* Main Nav */}
        <nav className="px-3 mb-2">
          {isKidsMode ? (
            <ul className="space-y-3 mt-4">
              {kidsNavItems.map(({ id, label, icon: Icon, color, bg }) => (
                <li key={id}>
                  <button
                    onClick={() => { setCurrentView(id); closeMobile(); }}
                    className={`
                      flex items-center w-full text-left px-4 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-sm
                      ${isActive(id)
                        ? 'bg-white border-4 border-gray-200 text-black shadow-md'
                        : `bg-white/50 text-gray-700 ${bg}`}
                    `}
                  >
                    <Icon className={`w-8 h-8 mr-4 ${color}`} />
                    <span className="text-xl font-black tracking-wide">{label}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-0.5">
              {navItems.map(({ id, label, icon: Icon }) => (
                <li key={id}>
                  <button
                    onClick={() => { setCurrentView(id); closeMobile(); }}
                    className={`
                      flex items-center w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 group
                      ${isActive(id)
                        ? 'bg-white/10 text-white font-semibold'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'}
                    `}
                  >
                    <Icon
                      className={`w-5 h-5 mr-3 transition-transform group-hover:scale-110 ${isActive(id) ? 'text-green-400' : ''}`}
                    />
                    <span className="text-sm">{label}</span>
                    {isActive(id) && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </nav>

        {/* Display playlists and standard items only in adult mode */}
        {!isKidsMode && (
          <>
            {/* Divider */}
            <div className="h-px bg-white/5 mx-5 my-2" />

            {/* Admin section */}
            {user && isAdmin && (
              <div className="px-3 mb-2">
                <div className="bg-gradient-to-r from-green-600/30 to-emerald-600/20 border border-green-500/20 rounded-xl p-3 mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-300 text-xs font-semibold">Admin Access</span>
                  </div>
                </div>
                <button
                  onClick={() => { setCurrentView('admin'); closeMobile(); }}
                  className={`flex items-center w-full text-left px-3 py-2.5 rounded-xl transition-all text-sm ${currentView === 'admin' ? 'bg-white/10 text-white font-semibold' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <Upload className="w-5 h-5 mr-3 text-green-400" />
                  Admin Dashboard
                </button>
              </div>
            )}

            {/* Create Playlist */}
            <div className="px-3 mb-2">
              <button
                onClick={() => { setShowCreatePlaylist(true); closeMobile(); }}
                className="flex items-center w-full text-left px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm group"
              >
                <div className="w-5 h-5 mr-3 rounded-md border border-gray-600 group-hover:border-green-400 flex items-center justify-center transition-colors">
                  <Plus className="w-3.5 h-3.5 group-hover:text-green-400" />
                </div>
                Create Playlist
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/5 mx-5 my-1" />

            {/* Playlists */}
            <div className="flex-1 overflow-y-auto px-3 py-2">
              {playlists.length > 0 && (
                <>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">Playlists</p>
                  {playlists.map((playlist) => (
                    <button
                      key={playlist.id}
                      onClick={() => { setCurrentView(`playlist:${playlist.id}`); closeMobile(); }}
                      className={`flex items-center w-full text-left px-3 py-2 rounded-xl transition-all text-sm group ${currentView === `playlist:${playlist.id}` ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      <div className="w-7 h-7 rounded-md bg-gradient-to-br from-gray-700 to-gray-800 mr-3 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-400 group-hover:from-green-800 group-hover:to-emerald-900 transition-all">
                        {playlist.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate">{playlist.name}</span>
                      {currentView === `playlist:${playlist.id}` && (
                        <ChevronRight className="ml-auto w-3.5 h-3.5 flex-shrink-0 text-green-400" />
                      )}
                    </button>
                  ))}
                </>
              )}
            </div>
          </>
        )}

        {isKidsMode && <div className="flex-1" />}

        {/* Footer */}
        <div className="px-3 py-3 border-t border-white/5 space-y-1">
          {/* Kids Mode Toggle */}
          <button
            onClick={() => {
              if (isKidsMode) requestExitKidsMode();
              else {
                enterKidsMode();
                setCurrentView('kids-home');
              }
              closeMobile();
            }}
            className={`flex items-center justify-center w-full text-center px-4 py-3 rounded-xl transition-all font-bold group shadow-md mb-3 
              ${isKidsMode ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90'}
            `}
          >
            {isKidsMode ? (
              <><Shield className="w-5 h-5 mr-2" /> Exit Kids Mode</>
            ) : (
              <><Child className="w-5 h-5 mr-2 animate-bounce flex-shrink-0" /> Kids Mode</>
            )}
          </button>

          {!isKidsMode && (
            <>
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center w-full text-left px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm"
              >
                {theme === 'dark'
                  ? <Sun className="w-4 h-4 mr-3 text-yellow-400" />
                  : <Moon className="w-4 h-4 mr-3 text-blue-400" />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>

              {/* Background selector toggle */}
              <button
                onClick={onOpenBgSelector}
                className="flex items-center w-full text-left px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm"
              >
                <Palette className="w-4 h-4 mr-3 text-purple-400" />
                Change Background
              </button>
            </>
          )}

          {/* User profile */}
          {user ? (
            <div className="flex items-center px-3 py-2 rounded-xl hover:bg-white/5 transition-all group">
              <button
                className="flex items-center flex-1 min-w-0"
                onClick={() => { setShowProfile(true); closeMobile(); }}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mr-3 flex-shrink-0 flex items-center justify-center shadow-md">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-sm text-white font-medium truncate">{user.fullName || user.email?.split('@')[0]}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </button>
              <button
                onClick={signOut}
                className="ml-2 text-gray-500 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-500/10"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="px-3 py-2">
              <p className="text-xs text-gray-600">Not signed in</p>
            </div>
          )}
        </div>
      </aside>

      <CreatePlaylistModal
        isOpen={showCreatePlaylist}
        onClose={() => setShowCreatePlaylist(false)}
      />
      {showProfile && <Profile onClose={() => setShowProfile(false)} />}
    </>
  );
};

export default Sidebar;
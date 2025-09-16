import React, { useState } from 'react';
import { Home, Search, Library, Plus, Heart, ChevronDown, Sun, Moon, LogOut, Upload, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAPI } from '../hooks/useAPI';
import CreatePlaylistModal from './CreatePlaylistModal';
import Profile from './Profile';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const { user, isAdmin, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { playlists } = useAPI();
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <div className="w-64 bg-black dark:bg-black text-white p-6 flex flex-col h-full">
        {/* Logo */}
        <div 
          className="flex items-center mb-8 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setCurrentView('home')}
          title="Go to Home"
        >
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-2">
            <span className="text-black font-bold text-sm">♪</span>
          </div>
          <span className="text-xl font-bold">Ydvmusic</span>
        </div>

        {/* Main Navigation */}
        <nav className="mb-8">
          <ul className="space-y-4">
            <li>
              <button
                onClick={() => setCurrentView('home')}
                className={`flex items-center w-full text-left p-2 rounded-md transition-colors ${
                  currentView === 'home' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                <Home className="w-6 h-6 mr-3" />
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView('search')}
                className={`flex items-center w-full text-left p-2 rounded-md transition-colors ${
                  currentView === 'search' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                <Search className="w-6 h-6 mr-3" />
                Search
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView('library')}
                className={`flex items-center w-full text-left p-2 rounded-md transition-colors ${
                  currentView === 'library' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                <Library className="w-6 h-6 mr-3" />
                Your Library
              </button>
            </li>
          </ul>
        </nav>

        {/* Actions */}
        <div className="mb-8">
          {user && isAdmin && (
            <button
              onClick={() => setCurrentView('admin')}
              className={`flex items-center w-full text-left p-2 rounded-md transition-colors mb-4 ${
                currentView === 'admin' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              <Upload className="w-6 h-6 mr-3" />
              Admin Upload
            </button>
          )}
          <button
            onClick={() => setShowCreatePlaylist(true)}
            className="flex items-center text-gray-300 hover:text-white transition-colors mb-4 w-full"
          >
            <Plus className="w-6 h-6 mr-3" />
            Create Playlist
          </button>
          <button
            onClick={() => setCurrentView('liked')}
            className={`flex items-center w-full text-left transition-colors ${
              currentView === 'liked' ? 'text-white' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Heart className="w-6 h-6 mr-3" />
            Liked Songs
          </button>
        </div>

        {/* Playlists */}
        <div className="flex-1 overflow-y-auto">
          <div className="border-t border-gray-800 pt-4">
            <h3 className="text-gray-400 text-sm font-medium mb-2 px-2">Your Playlists</h3>
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => setCurrentView(`playlist:${playlist.id}`)}
                className={`block w-full text-left text-gray-300 hover:text-white transition-colors py-2 px-2 truncate rounded-md ${
                  currentView === `playlist:${playlist.id}` ? 'bg-gray-800 text-white' : ''
                }`}
              >
                {playlist.name}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Toggle & User Profile */}
        <div className="mt-auto pt-4 border-t border-gray-800 space-y-3">
          <button
            onClick={toggleTheme}
            className="flex items-center w-full text-gray-300 hover:text-white transition-colors p-2 rounded-md"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 mr-3" /> : <Moon className="w-5 h-5 mr-3" />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>

          {user && (
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0 flex-1 cursor-pointer" onClick={() => setShowProfile(true)}>
                <div className="w-8 h-8 bg-gray-600 rounded-full mr-2 flex-shrink-0 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm truncate">{user.fullName || user.email}</span>
              </div>
              <div className="flex items-center space-x-1 ml-2">
                <button
                  onClick={signOut}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          )}
        </div>
      </div>

      <CreatePlaylistModal
        isOpen={showCreatePlaylist}
        onClose={() => setShowCreatePlaylist(false)}
      />
      
      {showProfile && (
        <Profile onClose={() => setShowProfile(false)} />
      )}
    </>
  );
};

export default Sidebar;
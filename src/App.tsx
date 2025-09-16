import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { QueueProvider, useQueue } from './contexts/QueueContext';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Player from './components/Player';
import { Song } from './hooks/useAPI';

// Inner component that has access to QueueContext
const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState('home');
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { setQueue } = useQueue();

  const handleSongSelect = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    // Add the selected song to queue if it's not already there
    setQueue([song], 0);
  };

  return (
    <div className="h-screen flex flex-col bg-black dark:bg-gray-900 transition-colors duration-300">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        <MainContent 
          currentView={currentView}
          onSongSelect={handleSongSelect}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setCurrentView={setCurrentView}
        />
      </div>
      <Player 
        currentSong={currentSong}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        onSongSelect={handleSongSelect}
      />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
          },
        }}
      />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueueProvider>
          <AppContent />
        </QueueProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
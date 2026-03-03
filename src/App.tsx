import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { QueueProvider, useQueue } from './contexts/QueueContext';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Player from './components/Player';
import BackgroundSelector from './components/BackgroundSelector';
import { Song } from './hooks/useAPI';
import { BackgroundProvider, useBackground } from './contexts/BackgroundContext';
import { KidsModeProvider } from './contexts/KidsModeContext';
import { ParentalControlProvider } from './contexts/ParentalControlContext';
import ParentGateway from './components/ParentGateway';
import VoiceCommandManager from './components/VoiceCommandManager';

// Inner component that has access to QueueContext
const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState('home');
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBgSelector, setShowBgSelector] = useState(false);
  const { setQueue, queue, jumpTo } = useQueue();
  const { getBgStyle } = useBackground();

  const handleSongSelect = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    // Check if the song is already in the queue
    const existingIndex = queue.findIndex(s => s.id === song.id);
    if (existingIndex >= 0) {
      // If song is already in queue, jump to it
      jumpTo(existingIndex);
    } else {
      // Add the selected song to queue if it's not already there
      setQueue([song], 0);
    }
  };

  return (
    <div
      className="h-screen flex flex-col transition-all duration-700 ease-in-out relative overflow-hidden"
      style={getBgStyle()}
    >
      {/* Dark overlay for custom images to ensure readability */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Mobile sidebar will appear as overlay, desktop sidebar as aside */}
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          onOpenBgSelector={() => setShowBgSelector(true)}
        />
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
      <VoiceCommandManager />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(17, 24, 39, 0.95)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
      <BackgroundSelector
        isOpen={showBgSelector}
        onClose={() => setShowBgSelector(false)}
      />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ParentalControlProvider>
        <KidsModeProvider>
          <AuthProvider>
            <QueueProvider>
              <BackgroundProvider>
                <AppContent />
                <ParentGateway />
              </BackgroundProvider>
            </QueueProvider>
          </AuthProvider>
        </KidsModeProvider>
      </ParentalControlProvider>
    </ThemeProvider>
  );
}

export default App;
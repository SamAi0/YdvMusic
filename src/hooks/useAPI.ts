import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  availableSongs,
  getPlaylists,
  savePlaylist,
  deletePlaylist as deletePlaylistFromStorage,
  getPlaylistById,
  addSongToPlaylist as addSongToPlaylistStorage,
  removeSongFromPlaylist as removeSongFromPlaylistStorage,
  getLikedSongs,
  toggleLikedSong,
  generateId
} from '../utils/localData';

export interface Song {
  id: string;
  title: string;
  duration: number;
  genre: string | null;
  audio_url: string | null;
  created_at: string;
  artist: {
    id: string;
    name: string;
    image_url: string | null;
  } | null;
  album: {
    id: string;
    title: string;
    cover_url: string | null;
  } | null;
}

export interface Playlist {
  id: string;
  name: string;
  description: string | null;
  cover_url: string | null;
  is_public: boolean | null;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  songs?: Song[];
}

export const useAPI = () => {
  const { user } = useAuth();
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [likedSongs, setLikedSongs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch songs with search
  const fetchSongs = async (searchQuery?: string) => {
    setLoading(true);
    try {
      let filteredSongs = availableSongs;
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredSongs = availableSongs.filter(song => 
          song.title.toLowerCase().includes(query) ||
          song.artist?.name.toLowerCase().includes(query) ||
          song.genre?.toLowerCase().includes(query)
        );
      }
      
      setSongs(filteredSongs);
    } catch (error) {
      console.error('Error fetching songs:', error);
      toast.error('Failed to fetch songs');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user playlists
  const fetchPlaylists = async () => {
    if (!user) return;

    try {
      const userPlaylists = getPlaylists(user.id);
      setPlaylists(userPlaylists);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      toast.error('Failed to fetch playlists');
    }
  };

  // Fetch liked songs
  const fetchLikedSongs = async () => {
    if (!user) return;

    try {
      const likedSongIds = getLikedSongs(user.id);
      setLikedSongs(likedSongIds);
    } catch (error) {
      console.error('Error fetching liked songs:', error);
    }
  };

  // Create playlist
  const createPlaylist = async (name: string, description?: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const newPlaylist: Playlist = {
        id: generateId(),
        name,
        description: description || null,
        cover_url: null,
        is_public: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: user.id,
        songs: []
      };
      
      savePlaylist(newPlaylist);
      setPlaylists(prev => [newPlaylist, ...prev]);
      toast.success('Playlist created successfully!');
      return newPlaylist;
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast.error('Failed to create playlist');
      throw error;
    }
  };

  // Add song to playlist
  const addSongToPlaylist = async (playlistId: string, songId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      addSongToPlaylistStorage(playlistId, songId);
      await fetchPlaylists(); // Refresh playlists
      toast.success('Song added to playlist!');
    } catch (error) {
      console.error('Error adding song to playlist:', error);
      toast.error('Failed to add song to playlist');
      throw error;
    }
  };

  // Remove song from playlist
  const removeSongFromPlaylist = async (playlistId: string, songId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      removeSongFromPlaylistStorage(playlistId, songId);
      await fetchPlaylists(); // Refresh playlists
      toast.success('Song removed from playlist!');
    } catch (error) {
      console.error('Error removing song from playlist:', error);
      toast.error('Failed to remove song from playlist');
      throw error;
    }
  };

  // Toggle like song
  const toggleLikeSong = async (songId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const isNowLiked = toggleLikedSong(user.id, songId);
      setLikedSongs(prev => 
        isNowLiked 
          ? [...prev, songId]
          : prev.filter(id => id !== songId)
      );
      
      toast.success(isNowLiked ? 'Added to liked songs' : 'Removed from liked songs');
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update liked songs');
      throw error;
    }
  };

  // Get playlist with songs
  const getPlaylistWithSongs = async (playlistId: string): Promise<Playlist | null> => {
    try {
      const playlist = getPlaylistById(playlistId);
      return playlist;
    } catch (error) {
      console.error('Error fetching playlist:', error);
      return null;
    }
  };

  // Delete playlist
  const deletePlaylist = async (playlistId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      deletePlaylistFromStorage(playlistId);
      setPlaylists(prev => prev.filter(p => p.id !== playlistId));
      toast.success('Playlist deleted successfully!');
    } catch (error) {
      console.error('Error deleting playlist:', error);
      toast.error('Failed to delete playlist');
      throw error;
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  useEffect(() => {
    if (user) {
      fetchPlaylists();
      fetchLikedSongs();
    } else {
      setPlaylists([]);
      setLikedSongs([]);
    }
  }, [user]);

  return {
    songs,
    playlists,
    likedSongs,
    loading,
    fetchSongs,
    createPlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    toggleLikeSong,
    getPlaylistWithSongs,
    deletePlaylist,
  };
};
import { useState, useEffect } from 'react';
import { musicAPI, playlistAPI, likesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

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
      const data = await musicAPI.getSongs({ 
        search: searchQuery,
        limit: 50 
      });
      setSongs(data);
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
      const data = await playlistAPI.getUserPlaylists();
      setPlaylists(data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      toast.error('Failed to fetch playlists');
    }
  };

  // Fetch liked songs
  const fetchLikedSongs = async () => {
    if (!user) return;

    try {
      const data = await likesAPI.getLikedSongs();
      setLikedSongs(data.map((song: Song) => song.id));
    } catch (error) {
      console.error('Error fetching liked songs:', error);
    }
  };

  // Create playlist
  const createPlaylist = async (name: string, description?: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const data = await playlistAPI.createPlaylist({ name, description });
      setPlaylists(prev => [data, ...prev]);
      toast.success('Playlist created successfully!');
      return data;
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
      await playlistAPI.addSongToPlaylist(playlistId, songId);
      toast.success('Song added to playlist!');
    } catch (error) {
      console.error('Error adding song to playlist:', error);
      toast.error('Failed to add song to playlist');
      throw error;
    }
  };

  // Toggle like song
  const toggleLikeSong = async (songId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const isLiked = likedSongs.includes(songId);

      if (isLiked) {
        await likesAPI.unlikeSong(songId);
        setLikedSongs(prev => prev.filter(id => id !== songId));
        toast.success('Removed from liked songs');
      } else {
        await likesAPI.likeSong(songId);
        setLikedSongs(prev => [...prev, songId]);
        toast.success('Added to liked songs');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update liked songs');
      throw error;
    }
  };

  // Get playlist with songs
  const getPlaylistWithSongs = async (playlistId: string): Promise<Playlist | null> => {
    try {
      const data = await playlistAPI.getPlaylist(playlistId);
      return data;
    } catch (error) {
      console.error('Error fetching playlist:', error);
      return null;
    }
  };

  // Delete playlist
  const deletePlaylist = async (playlistId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await playlistAPI.deletePlaylist(playlistId);
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
    toggleLikeSong,
    getPlaylistWithSongs,
    deletePlaylist,
  };
};
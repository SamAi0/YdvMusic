import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
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

export const useMusic = () => {
  const { user } = useAuth();
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [likedSongs, setLikedSongs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all songs
  const fetchSongs = async (searchQuery?: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('songs')
        .select(`
          *,
          artist:artists(*),
          album:albums(*)
        `)
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,artists.name.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSongs(data || []);
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
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlaylists(data || []);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      toast.error('Failed to fetch playlists');
    }
  };

  // Fetch liked songs
  const fetchLikedSongs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_likes')
        .select('song_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setLikedSongs(data?.map(like => like.song_id) || []);
    } catch (error) {
      console.error('Error fetching liked songs:', error);
    }
  };

  // Create playlist
  const createPlaylist = async (name: string, description?: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('playlists')
        .insert({
          name,
          description: description || '',
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
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
      const { error } = await supabase
        .from('playlist_songs')
        .insert({
          playlist_id: playlistId,
          song_id: songId,
        });

      if (error) throw error;
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
        const { error } = await supabase
          .from('user_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('song_id', songId);

        if (error) throw error;
        setLikedSongs(prev => prev.filter(id => id !== songId));
        toast.success('Removed from liked songs');
      } else {
        const { error } = await supabase
          .from('user_likes')
          .insert({
            user_id: user.id,
            song_id: songId,
          });

        if (error) throw error;
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
      const { data: playlist, error: playlistError } = await supabase
        .from('playlists')
        .select('*')
        .eq('id', playlistId)
        .single();

      if (playlistError) throw playlistError;

      const { data: playlistSongs, error: songsError } = await supabase
        .from('playlist_songs')
        .select(`
          song_id,
          songs(
            *,
            artist:artists(*),
            album:albums(*)
          )
        `)
        .eq('playlist_id', playlistId)
        .order('position');

      if (songsError) throw songsError;

      return {
        ...playlist,
        songs: playlistSongs?.map(ps => ps.songs).filter(Boolean) || []
      };
    } catch (error) {
      console.error('Error fetching playlist:', error);
      return null;
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
  };
};
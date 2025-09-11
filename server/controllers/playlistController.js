import { supabase } from '../config/database.js';

// Get user playlists
export const getUserPlaylists = async (req, res) => {
  try {
    const { data: playlists, error } = await supabase
      .from('playlists')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(playlists);
  } catch (error) {
    console.error('Get user playlists error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single playlist with songs
export const getPlaylist = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: playlist, error: playlistError } = await supabase
      .from('playlists')
      .select('*')
      .eq('id', id)
      .single();

    if (playlistError) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    // Check if user has access to this playlist
    if (!playlist.is_public && playlist.user_id !== req.user?.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { data: playlistSongs, error: songsError } = await supabase
      .from('playlist_songs')
      .select(`
        position,
        added_at,
        song:songs(
          *,
          artist:artists(*),
          album:albums(*)
        )
      `)
      .eq('playlist_id', id)
      .order('position');

    if (songsError) {
      return res.status(400).json({ error: songsError.message });
    }

    const songs = playlistSongs.map(ps => ({
      ...ps.song,
      position: ps.position,
      added_at: ps.added_at
    }));

    res.json({ ...playlist, songs });
  } catch (error) {
    console.error('Get playlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new playlist
export const createPlaylist = async (req, res) => {
  try {
    const { name, description, is_public = false } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Playlist name is required' });
    }

    const { data: playlist, error } = await supabase
      .from('playlists')
      .insert({
        name,
        description: description || '',
        user_id: req.user.id,
        is_public
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(playlist);
  } catch (error) {
    console.error('Create playlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update playlist
export const updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, is_public, cover_url } = req.body;

    const { data: playlist, error } = await supabase
      .from('playlists')
      .update({
        name,
        description,
        is_public,
        cover_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found or access denied' });
    }

    res.json(playlist);
  } catch (error) {
    console.error('Update playlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete playlist
export const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('playlists')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    console.error('Delete playlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add song to playlist
export const addSongToPlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { song_id } = req.body;

    if (!song_id) {
      return res.status(400).json({ error: 'Song ID is required' });
    }

    // Check if user owns the playlist
    const { data: playlist, error: playlistError } = await supabase
      .from('playlists')
      .select('user_id')
      .eq('id', id)
      .single();

    if (playlistError || playlist.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get the next position
    const { data: lastSong } = await supabase
      .from('playlist_songs')
      .select('position')
      .eq('playlist_id', id)
      .order('position', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextPosition = (lastSong?.position ?? -1) + 1;

    const { data: playlistSong, error } = await supabase
      .from('playlist_songs')
      .insert({
        playlist_id: id,
        song_id,
        position: nextPosition
      })
      .select(`
        *,
        song:songs(
          *,
          artist:artists(*),
          album:albums(*)
        )
      `)
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return res.status(400).json({ error: 'Song already in playlist' });
      }
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(playlistSong);
  } catch (error) {
    console.error('Add song to playlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Remove song from playlist
export const removeSongFromPlaylist = async (req, res) => {
  try {
    const { id, songId } = req.params;

    // Check if user owns the playlist
    const { data: playlist, error: playlistError } = await supabase
      .from('playlists')
      .select('user_id')
      .eq('id', id)
      .single();

    if (playlistError || playlist.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { error } = await supabase
      .from('playlist_songs')
      .delete()
      .eq('playlist_id', id)
      .eq('song_id', songId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Song removed from playlist successfully' });
  } catch (error) {
    console.error('Remove song from playlist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
import { supabase } from '../config/database.js';
import { persistToS3 } from '../config/storage.js';

// Get all songs with pagination and search
export const getSongs = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, genre, artist_id } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('songs')
      .select(`
        *,
        artist:artists(*),
        album:albums(*)
      `)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`title.ilike.%${search}%,artists.name.ilike.%${search}%`);
    }

    if (genre) {
      query = query.eq('genre', genre);
    }

    if (artist_id) {
      query = query.eq('artist_id', artist_id);
    }

    const { data: songs, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(songs);
  } catch (error) {
    console.error('Get songs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single song
export const getSong = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: song, error } = await supabase
      .from('songs')
      .select(`
        *,
        artist:artists(*),
        album:albums(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Song not found' });
    }

    res.json(song);
  } catch (error) {
    console.error('Get song error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Upload new song (admin only)
export const uploadSong = async (req, res) => {
  try {
    const { title, artist_id, album_id, duration, genre } = req.body;
    let audio_url = null;
    if (req.file?.buffer) {
      audio_url = await persistToS3(req.file, 'audio');
    }

    if (!title || !artist_id || !duration || !audio_url) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data: song, error } = await supabase
      .from('songs')
      .insert({
        title,
        artist_id,
        album_id,
        duration: parseInt(duration),
        audio_url,
        genre
      })
      .select(`
        *,
        artist:artists(*),
        album:albums(*)
      `)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(song);
  } catch (error) {
    console.error('Upload song error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all artists
export const getArtists = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('artists')
      .select('*')
      .range(offset, offset + limit - 1)
      .order('name');

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data: artists, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(artists);
  } catch (error) {
    console.error('Get artists error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single artist with songs
export const getArtist = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: artist, error: artistError } = await supabase
      .from('artists')
      .select('*')
      .eq('id', id)
      .single();

    if (artistError) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    const { data: songs, error: songsError } = await supabase
      .from('songs')
      .select(`
        *,
        album:albums(*)
      `)
      .eq('artist_id', id)
      .order('created_at', { ascending: false });

    if (songsError) {
      return res.status(400).json({ error: songsError.message });
    }

    res.json({ ...artist, songs });
  } catch (error) {
    console.error('Get artist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all albums
export const getAlbums = async (req, res) => {
  try {
    const { page = 1, limit = 20, artist_id } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('albums')
      .select(`
        *,
        artist:artists(*)
      `)
      .range(offset, offset + limit - 1)
      .order('release_date', { ascending: false });

    if (artist_id) {
      query = query.eq('artist_id', artist_id);
    }

    const { data: albums, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(albums);
  } catch (error) {
    console.error('Get albums error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single album with songs
export const getAlbum = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: album, error: albumError } = await supabase
      .from('albums')
      .select(`
        *,
        artist:artists(*)
      `)
      .eq('id', id)
      .single();

    if (albumError) {
      return res.status(404).json({ error: 'Album not found' });
    }

    const { data: songs, error: songsError } = await supabase
      .from('songs')
      .select('*')
      .eq('album_id', id)
      .order('created_at');

    if (songsError) {
      return res.status(400).json({ error: songsError.message });
    }

    res.json({ ...album, songs });
  } catch (error) {
    console.error('Get album error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
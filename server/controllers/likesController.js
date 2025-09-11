import { supabase } from '../config/database.js';

// Get user's liked songs
export const getLikedSongs = async (req, res) => {
  try {
    const { data: likes, error } = await supabase
      .from('user_likes')
      .select(`
        created_at,
        song:songs(
          *,
          artist:artists(*),
          album:albums(*)
        )
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const likedSongs = likes.map(like => ({
      ...like.song,
      liked_at: like.created_at
    }));

    res.json(likedSongs);
  } catch (error) {
    console.error('Get liked songs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Like a song
export const likeSong = async (req, res) => {
  try {
    const { song_id } = req.body;

    if (!song_id) {
      return res.status(400).json({ error: 'Song ID is required' });
    }

    const { data: like, error } = await supabase
      .from('user_likes')
      .insert({
        user_id: req.user.id,
        song_id
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return res.status(400).json({ error: 'Song already liked' });
      }
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(like);
  } catch (error) {
    console.error('Like song error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Unlike a song
export const unlikeSong = async (req, res) => {
  try {
    const { songId } = req.params;

    const { error } = await supabase
      .from('user_likes')
      .delete()
      .eq('user_id', req.user.id)
      .eq('song_id', songId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Song unliked successfully' });
  } catch (error) {
    console.error('Unlike song error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Check if song is liked
export const checkLikeStatus = async (req, res) => {
  try {
    const { songId } = req.params;

    const { data: like, error } = await supabase
      .from('user_likes')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('song_id', songId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      return res.status(400).json({ error: error.message });
    }

    res.json({ liked: !!like });
  } catch (error) {
    console.error('Check like status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
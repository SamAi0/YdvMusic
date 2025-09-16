import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// Check for valid Supabase configuration
let supabase;
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')) {
  console.warn('⚠️ Supabase not configured properly in frontend. Auth features will not work.');
  
  // Create a mock client for development
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Database not configured' } }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null })
    })
  };
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      artists: {
        Row: {
          id: string
          name: string
          bio: string | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          bio?: string | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          bio?: string | null
          image_url?: string | null
          created_at?: string
        }
      }
      albums: {
        Row: {
          id: string
          title: string
          artist_id: string | null
          cover_url: string | null
          release_date: string | null
          genre: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          artist_id?: string | null
          cover_url?: string | null
          release_date?: string | null
          genre?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          artist_id?: string | null
          cover_url?: string | null
          release_date?: string | null
          genre?: string | null
          created_at?: string
        }
      }
      songs: {
        Row: {
          id: string
          title: string
          artist_id: string | null
          album_id: string | null
          duration: number
          audio_url: string | null
          genre: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          artist_id?: string | null
          album_id?: string | null
          duration: number
          audio_url?: string | null
          genre?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          artist_id?: string | null
          album_id?: string | null
          duration?: number
          audio_url?: string | null
          genre?: string | null
          created_at?: string
        }
      }
      playlists: {
        Row: {
          id: string
          name: string
          description: string | null
          user_id: string | null
          cover_url: string | null
          is_public: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          user_id?: string | null
          cover_url?: string | null
          is_public?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          user_id?: string | null
          cover_url?: string | null
          is_public?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      playlist_songs: {
        Row: {
          id: string
          playlist_id: string | null
          song_id: string | null
          position: number | null
          added_at: string
        }
        Insert: {
          id?: string
          playlist_id?: string | null
          song_id?: string | null
          position?: number | null
          added_at?: string
        }
        Update: {
          id?: string
          playlist_id?: string | null
          song_id?: string | null
          position?: number | null
          added_at?: string
        }
      }
      user_likes: {
        Row: {
          id: string
          user_id: string | null
          song_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          song_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          song_id?: string | null
          created_at?: string
        }
      }
    }
  }
}
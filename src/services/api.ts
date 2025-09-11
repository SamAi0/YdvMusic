import { supabase } from '../lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    ...(session?.access_token && { 'Authorization': `Bearer ${session.access_token}` })
  };
};

// Generic API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = await getAuthHeaders();
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
};

// Auth API
export const authAPI = {
  register: (email: string, password: string, fullName: string) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    }),

  login: (email: string, password: string) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    apiRequest('/auth/logout', { method: 'POST' }),

  getProfile: () =>
    apiRequest('/auth/profile'),

  updateProfile: (data: any) =>
    apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Music API
export const musicAPI = {
  getSongs: (params?: { page?: number; limit?: number; search?: string; genre?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.genre) searchParams.append('genre', params.genre);
    
    return apiRequest(`/music/songs?${searchParams.toString()}`);
  },

  getSong: (id: string) =>
    apiRequest(`/music/songs/${id}`),

  uploadSong: async (formData: FormData) => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    const res = await fetch(`${API_BASE_URL}/music/songs`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
      body: formData,
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${res.status}`);
    }
    return res.json();
  },

  getArtists: (params?: { page?: number; limit?: number; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    
    return apiRequest(`/music/artists?${searchParams.toString()}`);
  },

  getArtist: (id: string) =>
    apiRequest(`/music/artists/${id}`),

  getAlbums: (params?: { page?: number; limit?: number; artist_id?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.artist_id) searchParams.append('artist_id', params.artist_id);
    
    return apiRequest(`/music/albums?${searchParams.toString()}`);
  },

  getAlbum: (id: string) =>
    apiRequest(`/music/albums/${id}`),
};

// Playlist API
export const playlistAPI = {
  getUserPlaylists: () =>
    apiRequest('/playlists'),

  getPlaylist: (id: string) =>
    apiRequest(`/playlists/${id}`),

  createPlaylist: (data: { name: string; description?: string; is_public?: boolean }) =>
    apiRequest('/playlists', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updatePlaylist: (id: string, data: any) =>
    apiRequest(`/playlists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deletePlaylist: (id: string) =>
    apiRequest(`/playlists/${id}`, { method: 'DELETE' }),

  addSongToPlaylist: (playlistId: string, songId: string) =>
    apiRequest(`/playlists/${playlistId}/songs`, {
      method: 'POST',
      body: JSON.stringify({ song_id: songId }),
    }),

  removeSongFromPlaylist: (playlistId: string, songId: string) =>
    apiRequest(`/playlists/${playlistId}/songs/${songId}`, { method: 'DELETE' }),
};

// Likes API
export const likesAPI = {
  getLikedSongs: () =>
    apiRequest('/likes'),

  likeSong: (songId: string) =>
    apiRequest('/likes', {
      method: 'POST',
      body: JSON.stringify({ song_id: songId }),
    }),

  unlikeSong: (songId: string) =>
    apiRequest(`/likes/${songId}`, { method: 'DELETE' }),

  checkLikeStatus: (songId: string) =>
    apiRequest(`/likes/${songId}/status`),
};
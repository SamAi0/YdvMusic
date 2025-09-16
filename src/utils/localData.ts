import { Song, Playlist } from '../hooks/useAPI';

// Local storage keys
const PLAYLISTS_KEY = 'ydvmusic_playlists';
const LIKED_SONGS_KEY = 'ydvmusic_liked_songs';
const USER_KEY = 'ydvmusic_user';

// Real songs from public/audio directory
export const availableSongs: Song[] = [
  {
    id: 'song_1',
    title: 'Yeh Ishq Hai',
    duration: 240, // approximate duration in seconds
    genre: 'Bollywood',
    audio_url: '/audio/Yeh Ishq Hai Papon Version-64kbps.mp3',
    created_at: new Date().toISOString(),
    artist: {
      id: 'artist_1',
      name: 'Papon',
      image_url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    album: {
      id: 'album_1',
      title: 'Bollywood Hits',
      cover_url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  }
];

// User management
export interface LocalUser {
  id: string;
  email: string;
  fullName: string;
  isAdmin: boolean;
}

export const saveUser = (user: LocalUser): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): LocalUser | null => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

// Playlist management
export const getPlaylists = (userId: string): Playlist[] => {
  const playlistsData = localStorage.getItem(PLAYLISTS_KEY);
  const allPlaylists: Playlist[] = playlistsData ? JSON.parse(playlistsData) : [];
  return allPlaylists.filter(playlist => playlist.user_id === userId);
};

export const savePlaylist = (playlist: Playlist): void => {
  const playlistsData = localStorage.getItem(PLAYLISTS_KEY);
  const allPlaylists: Playlist[] = playlistsData ? JSON.parse(playlistsData) : [];
  
  const existingIndex = allPlaylists.findIndex(p => p.id === playlist.id);
  if (existingIndex >= 0) {
    allPlaylists[existingIndex] = playlist;
  } else {
    allPlaylists.push(playlist);
  }
  
  localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(allPlaylists));
};

export const deletePlaylist = (playlistId: string): void => {
  const playlistsData = localStorage.getItem(PLAYLISTS_KEY);
  const allPlaylists: Playlist[] = playlistsData ? JSON.parse(playlistsData) : [];
  const filteredPlaylists = allPlaylists.filter(p => p.id !== playlistId);
  localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(filteredPlaylists));
};

export const getPlaylistById = (playlistId: string): Playlist | null => {
  const playlistsData = localStorage.getItem(PLAYLISTS_KEY);
  const allPlaylists: Playlist[] = playlistsData ? JSON.parse(playlistsData) : [];
  return allPlaylists.find(p => p.id === playlistId) || null;
};

export const addSongToPlaylist = (playlistId: string, songId: string): void => {
  const playlist = getPlaylistById(playlistId);
  if (!playlist) return;
  
  const song = availableSongs.find(s => s.id === songId);
  if (!song) return;
  
  if (!playlist.songs) playlist.songs = [];
  
  // Check if song is already in playlist
  if (!playlist.songs.find(s => s.id === songId)) {
    playlist.songs.push(song);
    playlist.updated_at = new Date().toISOString();
    savePlaylist(playlist);
  }
};

export const removeSongFromPlaylist = (playlistId: string, songId: string): void => {
  const playlist = getPlaylistById(playlistId);
  if (!playlist || !playlist.songs) return;
  
  playlist.songs = playlist.songs.filter(s => s.id !== songId);
  playlist.updated_at = new Date().toISOString();
  savePlaylist(playlist);
};

// Liked songs management
export const getLikedSongs = (userId: string): string[] => {
  const likedData = localStorage.getItem(LIKED_SONGS_KEY);
  const allLiked: { [userId: string]: string[] } = likedData ? JSON.parse(likedData) : {};
  return allLiked[userId] || [];
};

export const toggleLikedSong = (userId: string, songId: string): boolean => {
  const likedData = localStorage.getItem(LIKED_SONGS_KEY);
  const allLiked: { [userId: string]: string[] } = likedData ? JSON.parse(likedData) : {};
  
  if (!allLiked[userId]) allLiked[userId] = [];
  
  const isLiked = allLiked[userId].includes(songId);
  if (isLiked) {
    allLiked[userId] = allLiked[userId].filter(id => id !== songId);
  } else {
    allLiked[userId].push(songId);
  }
  
  localStorage.setItem(LIKED_SONGS_KEY, JSON.stringify(allLiked));
  return !isLiked;
};

// Generate unique IDs
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
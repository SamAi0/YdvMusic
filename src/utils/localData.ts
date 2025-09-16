import { Song, Playlist } from '../hooks/useAPI';

// Local storage keys
const PLAYLISTS_KEY = 'ydvmusic_playlists';
const LIKED_SONGS_KEY = 'ydvmusic_liked_songs';
const USER_KEY = 'ydvmusic_user';

// Real songs from public/audio directory
export const availableSongs: Song[] = [
  // ❤️ Romantic Songs
  {
    id: 'song_1',
    title: 'Yeh Ishq Hai (Papon Version)',
    duration: 244,
    genre: 'Romantic Songs',
    audio_url: '/audio/Yeh Ishq Hai Papon Version-64kbps.mp3',
    created_at: new Date().toISOString(),
    artist: {
      id: 'artist_1',
      name: 'Papon',
      image_url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    album: {
      id: 'album_1',
      title: 'Romantic Hits',
      cover_url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  },
  {
    id: 'song_2',
    title: 'Vaaste',
    duration: 347,
    genre: 'Romantic Songs',
    audio_url: '/song/Vaaste_Song__Dhvani_Bhanushali,_TanishkBagchi_Nikhil_D___Bhushan_Kumar__RadhikaRao,_Vinay_Sapru(48k).mp3',
    created_at: new Date().toISOString(),
    artist: {
      id: 'artist_2',
      name: 'Dhvani Bhanushali, Tanishk Bagchi',
      image_url: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    album: {
      id: 'album_2',
      title: 'Modern Romance',
      cover_url: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  },
  {
    id: 'song_3',
    title: 'Ladki Badi Anjani Hai',
    duration: 502,
    genre: 'Romantic Songs',
    audio_url: '/song/Ladki_Badi_Anjani_Hai_-_Full_4K__Love_Song__Shahrukh_Khan,_Kajol___Alka_Yagnik,_Kumar_Sanu___90s_Hit(48k).mp3',
    created_at: new Date().toISOString(),
    artist: {
      id: 'artist_3',
      name: 'Alka Yagnik, Kumar Sanu',
      image_url: 'https://images.pexels.com/photos/1644775/pexels-photo-1644775.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    album: {
      id: 'album_3',
      title: 'DDLJ - Dilwale Dulhania Le Jayenge',
      cover_url: 'https://images.pexels.com/photos/1644775/pexels-photo-1644775.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  },
  {
    id: 'song_4',
    title: 'Aavan Jaavan (War 2)',
    duration: 312,
    genre: 'Romantic Songs',
    audio_url: '/song/Aavan_Jaavan_Song___WAR_2___Hrithik_Roshan,_Kiara_Advani___Pritam,_Arijit_Singh,_Nikhita___Amitabh_B(48k).mp3',
    created_at: new Date().toISOString(),
    artist: {
      id: 'artist_4',
      name: 'Arijit Singh, Nikhita Gandhi',
      image_url: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    album: {
      id: 'album_4',
      title: 'War 2',
      cover_url: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  },
  {
    id: 'song_5',
    title: 'Tere Khatir Ishq Mera',
    duration: 244,
    genre: 'Romantic Songs',
    audio_url: '/song/Tere_Khatir_Ishq_Mera___Kartik_Aaryan___Kriti_Sanon___Romantic_Song(48k).mp3',
    created_at: new Date().toISOString(),
    artist: {
      id: 'artist_5',
      name: 'Kartik Aaryan',
      image_url: 'https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    album: {
      id: 'album_5',
      title: 'Kriti Sanon Romantic Collection',
      cover_url: 'https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  },

  // 😢 Sad / Emotional Songs
  {
    id: 'song_6',
    title: 'Saiyaara',
    duration: 447,
    genre: 'Sad / Heartbreak Songs',
    audio_url: '/song/Saiyaara_Full_Song___Ahaan_Panday,_Aneet_Padda___Tanishk_Bagchi,_Faheem_A,_Arslan_N___Irshad_Kamil(48k).mp3',
    created_at: new Date().toISOString(),
    artist: {
      id: 'artist_6',
      name: 'Ahaan Panday, Aneet Padda, Tanishk Bagchi',
      image_url: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    album: {
      id: 'album_6',
      title: 'Emotional Collection',
      cover_url: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  },
  {
    id: 'song_7',
    title: 'Mohabbat Mai Koi Aashiq Kyu Ban Jata Hai',
    duration: 271,
    genre: 'Sad / Heartbreak Songs',
    audio_url: '/song/Mohabbat_mai_koi_ashiq_kyu_ban_jata_hai_deewana__whatsapp_status_beautiful_song(48k).mp3',
    created_at: new Date().toISOString(),
    artist: {
      id: 'artist_7',
      name: 'Various Artists',
      image_url: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    album: {
      id: 'album_7',
      title: 'Status Songs Collection',
      cover_url: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  },
  {
    id: 'song_8',
    title: 'Dewaane Hum Nahi Hote',
    duration: 235,
    genre: 'Sad / Heartbreak Songs',
    audio_url: '/song/Dewaane_Hum_Nahi_Hote_Deewani_Raat_Aati_Hai__Lyrics__Aditya_Yadav(48k).mp3',
    created_at: new Date().toISOString(),
    artist: {
      id: 'artist_8',
      name: 'Aditya Yadav',
      image_url: 'https://images.pexels.com/photos/1749303/pexels-photo-1749303.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    album: {
      id: 'album_8',
      title: 'Heartbreak Melodies',
      cover_url: 'https://images.pexels.com/photos/1749303/pexels-photo-1749303.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  },

  // 🎉 Party / Dance / Item Songs
  {
    id: 'song_9',
    title: 'LAAL PARI',
    duration: 240,
    genre: 'Item Songs',
    audio_url: '/song/LAAL_PARI__Song___Yo_Yo_Honey_Singh___Sajid_Nadiadwala___Tarun_Mansukhani___Housefull_5(48k).mp3',
    created_at: new Date().toISOString(),
    artist: {
      id: 'artist_9',
      name: 'Yo Yo Honey Singh',
      image_url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    album: {
      id: 'album_9',
      title: 'Housefull 5',
      cover_url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  },
  {
    id: 'song_10',
    title: 'GULABI SAAWARIYA',
    duration: 202,
    genre: 'Item Songs',
    audio_url: '/song/GULABI_SAAWARIYA__Song___Divya_Khossla___Rajniesh_Duggall___Ek_Chatur_Naar___Sachet,Shilpa,Abhijeet(48k).mp3',
    created_at: new Date().toISOString(),
    artist: {
      id: 'artist_10',
      name: 'Divya Khossla, Rajniesh Duggal',
      image_url: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    album: {
      id: 'album_10',
      title: 'Ek Chatur Naar',
      cover_url: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  },
  {
    id: 'song_11',
    title: 'Akeli Laila',
    duration: 208,
    genre: 'Item Songs',
    audio_url: '/song/Akeli_Laila__Song____Tiger_S,Sonam_B,Sanjay_D___Payal,Aditya,Paradox___Sajid_N,A._Harsha(48k).mp3',
    created_at: new Date().toISOString(),
    artist: {
      id: 'artist_11',
      name: 'Tiger Shroff, Sonam Bajwa, Sanjay Dutt',
      image_url: 'https://images.pexels.com/photos/1644775/pexels-photo-1644775.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    album: {
      id: 'album_11',
      title: 'Action Dance Collection',
      cover_url: 'https://images.pexels.com/photos/1644775/pexels-photo-1644775.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  },

  // 📻 90s / Old Classics
  {
    id: 'song_12',
    title: 'Chunnari Chunnari',
    duration: 411,
    genre: 'Festive Songs',
    audio_url: '/song/Chunnari_Chunnari_-_Biwi_No.1__1999____Abhijeet___Anuradha_Sriram___90s_Hindi_Song(48k).mp3',
    created_at: new Date().toISOString(),
    artist: {
      id: 'artist_12',
      name: 'Abhijeet, Anuradha Sriram',
      image_url: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    album: {
      id: 'album_12',
      title: 'Biwi No.1 (1999)',
      cover_url: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  },
  {
    id: 'song_13',
    title: 'Dil Ne Yeh Kaha Hain Dil Se',
    duration: 543,
    genre: 'Romantic Songs',
    audio_url: '/song/Dil_Ne_Yeh_Kaha_Hain_Dil_Se_-HD_VIDEO_SONG___Akshay,_Suniel___Shilpa___Dhadkan___Hindi_Romantic_Song(48k).mp3',
    created_at: new Date().toISOString(),
    artist: {
      id: 'artist_13',
      name: 'Akshay Kumar, Suniel Shetty',
      image_url: 'https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    album: {
      id: 'album_13',
      title: 'Dhadkan',
      cover_url: 'https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  },

  // 🎵 New Hindi Songs (2024–25 Trend)
  {
    id: 'song_14',
    title: 'Uyi Amma - Azaad',
    duration: 253,
    genre: 'Festive Songs',
    audio_url: '/song/Uyi_Amma_-_Azaad___Aaman_D,_Rasha_Thadani__Madhubanti_Bagchi,Amit_Trivedi,Amitabh__Bosco__Abhishek_K(48k).mp3',
    created_at: new Date().toISOString(),
    artist: {
      id: 'artist_14',
      name: 'Aaman Devgan, Rasha Thadani, Amit Trivedi',
      image_url: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    album: {
      id: 'album_14',
      title: 'Azaad',
      cover_url: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  },
  {
    id: 'song_15',
    title: 'DEEWANIYAT Title Track',
    duration: 312,
    genre: 'Festive Songs',
    audio_url: '/song/DEEWANIYAT_Title_Track_-_Ek_Deewane_Ki_Deewaniyat___Harshvardhan_Sonam___Vishal_,KaushikGuddu,Kunaal(48k).mp3',
    created_at: new Date().toISOString(),
    artist: {
      id: 'artist_15',
      name: 'Harshvardhan Ranveer, Sonam Kapoor, Vishal Dadlani',
      image_url: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    album: {
      id: 'album_15',
      title: 'Deewaniyat',
      cover_url: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  },
  {
    id: 'song_16',
    title: 'Paras Garima – T-Series New Release',
    duration: 271,
    genre: 'Festive Songs',
    audio_url: '/song/__Viral_Song___Jab_Se_Chadhal_Ba_Jawani__Song___Manoj_Tiwari__Mridul____Paras_,Garima___T-Series(48k).mp3',
    created_at: new Date().toISOString(),
    artist: {
      id: 'artist_16',
      name: 'Manoj Tiwari, Mridul',
      image_url: 'https://images.pexels.com/photos/1749303/pexels-photo-1749303.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    album: {
      id: 'album_16',
      title: 'T-Series New Releases',
      cover_url: 'https://images.pexels.com/photos/1749303/pexels-photo-1749303.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  },

  // 🪕 Bhojpuri Songs (Fixed paths for proper playback)
  {
    id: 'song_17',
    title: 'Maroon Color Sadiya',
    duration: 219,
    genre: 'Devotional / Bhajans',
    audio_url: '/audio/Maroon_Color_Sadiya.mp3',
    created_at: new Date().toISOString(),
    artist: {
      id: 'artist_17',
      name: 'Dinesh Lal Yadav, Aamrapali Dubey',
      image_url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    album: {
      id: 'album_17',
      title: 'FASAL - Bhojpuri Collection',
      cover_url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  },
  {
    id: 'song_18',
    title: 'Dil Na Bikau Hamaar',
    duration: 272,
    genre: 'Devotional / Bhajans',
    audio_url: '/audio/Dil_Na_Bikau_Hamaar.mp3',
    created_at: new Date().toISOString(),
    artist: {
      id: 'artist_18',
      name: 'Swati Mishra',
      image_url: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    album: {
      id: 'album_18',
      title: 'New Bhojpuri Love Songs 2025',
      cover_url: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  }
];

// User management
export interface LocalUser {
  id: string;
  email: string;
  fullName: string;
  isAdmin: boolean;
  username?: string;
  bio?: string;
  avatar_url?: string;
  dateOfBirth?: string;
  country?: string;
  favoriteGenres?: string[];
  isPrivate?: boolean;
  joinedDate: string;
  totalListeningTime?: number;
  followersCount?: number;
  followingCount?: number;
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

// Profile management
const PROFILE_STATS_KEY = 'ydvmusic_profile_stats';
const USER_PREFERENCES_KEY = 'ydvmusic_user_preferences';

export interface ProfileStats {
  totalSongsPlayed: number;
  totalListeningTime: number; // in seconds
  favoriteArtists: { [artistId: string]: number };
  favoriteGenres: { [genre: string]: number };
  dailyListening: { [date: string]: number };
  streakDays: number;
  lastActiveDate: string;
  thisMonthSongs?: number;
  thisMonthTime?: number;
  favoriteArtistsCount?: number;
  favoriteGenresCount?: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  autoPlay: boolean;
  showExplicitContent: boolean;
  defaultVolume: number;
  crossfadeSeconds: number;
  notificationsEnabled: boolean;
  emailUpdates: boolean;
  crossfade?: boolean;
  highQuality?: boolean;
  privateProfile?: boolean;
  hideActivity?: boolean;
  emailNotifications?: boolean;
  desktopNotifications?: boolean;
}

export const getProfileStats = (userId: string): ProfileStats => {
  const statsData = localStorage.getItem(PROFILE_STATS_KEY);
  const allStats: { [userId: string]: ProfileStats } = statsData ? JSON.parse(statsData) : {};
  const baseStats = allStats[userId] || {
    totalSongsPlayed: 0,
    totalListeningTime: 0,
    favoriteArtists: {},
    favoriteGenres: {},
    dailyListening: {},
    streakDays: 0,
    lastActiveDate: new Date().toISOString().split('T')[0]
  };

  // Calculate this month's statistics
  const now = new Date();
  const currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
  let thisMonthSongs = 0;
  let thisMonthTime = 0;
  
  Object.entries(baseStats.dailyListening).forEach(([date, time]) => {
    if (date.startsWith(currentMonth)) {
      thisMonthSongs += 1;
      thisMonthTime += time;
    }
  });

  return {
    ...baseStats,
    thisMonthSongs,
    thisMonthTime,
    favoriteArtistsCount: Object.keys(baseStats.favoriteArtists).length,
    favoriteGenresCount: Object.keys(baseStats.favoriteGenres).length
  };
};

export const saveProfileStats = (userId: string, stats: ProfileStats): void => {
  const statsData = localStorage.getItem(PROFILE_STATS_KEY);
  const allStats: { [userId: string]: ProfileStats } = statsData ? JSON.parse(statsData) : {};
  allStats[userId] = stats;
  localStorage.setItem(PROFILE_STATS_KEY, JSON.stringify(allStats));
};

export const getUserPreferences = (userId: string): UserPreferences => {
  const prefsData = localStorage.getItem(USER_PREFERENCES_KEY);
  const allPrefs: { [userId: string]: UserPreferences } = prefsData ? JSON.parse(prefsData) : {};
  return allPrefs[userId] || {
    theme: 'dark',
    autoPlay: true,
    showExplicitContent: true,
    defaultVolume: 50,
    crossfadeSeconds: 0,
    notificationsEnabled: true,
    emailUpdates: false
  };
};

export const saveUserPreferences = (userId: string, preferences: UserPreferences): void => {
  const prefsData = localStorage.getItem(USER_PREFERENCES_KEY);
  const allPrefs: { [userId: string]: UserPreferences } = prefsData ? JSON.parse(prefsData) : {};
  allPrefs[userId] = preferences;
  localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(allPrefs));
};

// Update listening statistics
export const updateListeningStats = (userId: string, songId: string, artistName: string, genre: string, duration: number): void => {
  const stats = getProfileStats(userId);
  const today = new Date().toISOString().split('T')[0];
  
  // Update basic stats
  stats.totalSongsPlayed += 1;
  stats.totalListeningTime += duration;
  
  // Update favorite artists
  const artistKey = artistName || 'Unknown Artist';
  stats.favoriteArtists[artistKey] = (stats.favoriteArtists[artistKey] || 0) + 1;
  
  // Update favorite genres
  if (genre) {
    stats.favoriteGenres[genre] = (stats.favoriteGenres[genre] || 0) + 1;
  }
  
  // Update daily listening
  stats.dailyListening[today] = (stats.dailyListening[today] || 0) + duration;
  
  // Update streak
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  if (stats.lastActiveDate === yesterdayStr) {
    stats.streakDays += 1;
  } else if (stats.lastActiveDate !== today) {
    stats.streakDays = 1;
  }
  
  stats.lastActiveDate = today;
  
  saveProfileStats(userId, stats);
};

// Get user's top items
export const getTopArtists = (userId: string, limit: number = 5): Array<{name: string; playCount: number}> => {
  const stats = getProfileStats(userId);
  return Object.entries(stats.favoriteArtists)
    .sort(([,a], [,b]) => b - a)
    .slice(0, limit)
    .map(([name, playCount]) => ({ name, playCount }));
};

export const getTopGenres = (userId: string, limit: number = 5): Array<{name: string; playCount: number}> => {
  const stats = getProfileStats(userId);
  return Object.entries(stats.favoriteGenres)
    .sort(([,a], [,b]) => b - a)
    .slice(0, limit)
    .map(([name, playCount]) => ({ name, playCount }));
};

// Update user profile
export const updateUserProfile = (updates: Partial<LocalUser>): void => {
  const currentUser = getUser();
  if (currentUser) {
    const updatedUser = { ...currentUser, ...updates };
    saveUser(updatedUser);
  }
};
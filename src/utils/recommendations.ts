import { Song } from '../hooks/useAPI';
import { availableSongs } from '../utils/localData';

interface RecommendationEngine {
  getRecommendations: (currentSong: Song, playedSongs: Song[], availableSongs: Song[]) => Song[];
  getSimilarByGenre: (genre: string, excludeIds: string[]) => Song[];
  getSimilarByArtist: (artistName: string, excludeIds: string[]) => Song[];
  getPopularSongs: (excludeIds: string[]) => Song[];
  getSmartShuffleRecommendations: (queue: Song[], currentIndex: number, shuffleHistory: number[]) => Song[];
}

class SmartRecommendationEngine implements RecommendationEngine {
  private allSongs: Song[] = [];
  
  constructor() {
    this.loadSongs();
  }
  
  private loadSongs() {
    this.allSongs = availableSongs;
  }
  
  getRecommendations(currentSong: Song, playedSongs: Song[], availableSongs: Song[]): Song[] {
    const playedIds = playedSongs.map(s => s.id);
    const recommendations: Song[] = [];
    
    // 1. Similar by genre (40% weight)
    const genreMatches = this.getSimilarByGenre(currentSong.genre || '', playedIds)
      .filter(song => !playedIds.includes(song.id))
      .slice(0, 3);
    recommendations.push(...genreMatches);
    
    // 2. Same artist (30% weight)
    if (currentSong.artist?.name) {
      const artistMatches = this.getSimilarByArtist(currentSong.artist.name, playedIds)
        .filter(song => !playedIds.includes(song.id) && !recommendations.find(r => r.id === song.id))
        .slice(0, 2);
      recommendations.push(...artistMatches);
    }
    
    // 3. Popular songs (20% weight)
    const popularSongs = this.getPopularSongs(playedIds)
      .filter(song => !playedIds.includes(song.id) && !recommendations.find(r => r.id === song.id))
      .slice(0, 2);
    recommendations.push(...popularSongs);
    
    // 4. Random discovery (10% weight)
    const remainingSongs = availableSongs
      .filter(song => !playedIds.includes(song.id) && !recommendations.find(r => r.id === song.id));
    
    if (remainingSongs.length > 0) {
      const randomSong = remainingSongs[Math.floor(Math.random() * remainingSongs.length)];
      recommendations.push(randomSong);
    }
    
    return recommendations.slice(0, 5); // Return top 5 recommendations
  }
  
  getSimilarByGenre(genre: string, excludeIds: string[]): Song[] {
    if (!genre) return [];
    return this.allSongs
      .filter(song => 
        song.genre === genre && 
        !excludeIds.includes(song.id)
      )
      .sort(() => Math.random() - 0.5) // Randomize within genre
      .slice(0, 10);
  }
  
  getSimilarByArtist(artistName: string, excludeIds: string[]): Song[] {
    return this.allSongs
      .filter(song => 
        song.artist?.name === artistName && 
        !excludeIds.includes(song.id)
      )
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
  }
  
  getPopularSongs(excludeIds: string[]): Song[] {
    // For now, we'll simulate popularity by shuffle
    // In a real app, this would be based on play counts, likes, etc.
    return this.allSongs
      .filter(song => !excludeIds.includes(song.id))
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
  }
  
  getSmartShuffleRecommendations(queue: Song[], currentIndex: number, shuffleHistory: number[]): Song[] {
    if (queue.length === 0) return [];
    
    const currentSong = queue[currentIndex];
    const playedSongs = shuffleHistory.map(index => queue[index]).filter(Boolean);
    const playedIds = [...playedSongs.map(s => s.id), currentSong.id];
    
    // Get recommendations based on current song
    const recommendations = this.getRecommendations(currentSong, playedSongs, this.allSongs);
    
    // Filter out songs already in queue
    const queueIds = queue.map(s => s.id);
    const newRecommendations = recommendations.filter(song => !queueIds.includes(song.id));
    
    return newRecommendations;
  }
  
  // Advanced recommendation methods
  getRecommendationsByMood(mood: 'happy' | 'sad' | 'energetic' | 'calm', excludeIds: string[]): Song[] {
    // Map moods to genres (simplified)
    const moodGenreMap: Record<string, string[]> = {
      happy: ['Festive Songs', 'Item Songs'],
      sad: ['Sad / Heartbreak Songs', 'Romantic Songs'],
      energetic: ['Item Songs', 'Patriotic Songs'],
      calm: ['Devotional / Bhajans', 'Romantic Songs']
    };
    
    const relevantGenres = moodGenreMap[mood] || [];
    const songs = this.allSongs.filter(song => 
      song.genre && relevantGenres.includes(song.genre) && 
      !excludeIds.includes(song.id)
    );
    
    return songs.sort(() => Math.random() - 0.5).slice(0, 8);
  }
  
  getRecommendationsByTime(): Song[] {
    const hour = new Date().getHours();
    let timeBasedGenres: string[] = [];
    
    if (hour >= 5 && hour < 10) {
      // Morning: Devotional and calm music
      timeBasedGenres = ['Devotional / Bhajans', 'Romantic Songs'];
    } else if (hour >= 10 && hour < 17) {
      // Day: Energetic music
      timeBasedGenres = ['Item Songs', 'Patriotic Songs'];
    } else if (hour >= 17 && hour < 22) {
      // Evening: Mixed
      timeBasedGenres = ['Romantic Songs', 'Festive Songs'];
    } else {
      // Night: Calm and romantic
      timeBasedGenres = ['Sad / Heartbreak Songs', 'Romantic Songs'];
    }
    
    return this.allSongs
      .filter(song => song.genre && timeBasedGenres.includes(song.genre))
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);
  }
}

// Singleton instance
export const recommendationEngine = new SmartRecommendationEngine();

// Utility functions for quick access
export const getSmartRecommendations = (currentSong: Song, playedSongs: Song[], availableSongs: Song[]) => {
  return recommendationEngine.getRecommendations(currentSong, playedSongs, availableSongs);
};

export const getSmartShuffleNext = (queue: Song[], currentIndex: number, shuffleHistory: number[]) => {
  return recommendationEngine.getSmartShuffleRecommendations(queue, currentIndex, shuffleHistory);
};

export const getMoodBasedRecommendations = (mood: 'happy' | 'sad' | 'energetic' | 'calm', excludeIds: string[]) => {
  return recommendationEngine.getRecommendationsByMood(mood, excludeIds);
};

export const getTimeBasedRecommendations = () => {
  return recommendationEngine.getRecommendationsByTime();
};
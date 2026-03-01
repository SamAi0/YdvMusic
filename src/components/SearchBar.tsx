import React, { useState } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string, filters?: {
    genre?: string;
    mood?: string;
    tempo?: string;
  }) => void;
  placeholder?: string;
}

interface FilterOption {
  value: string;
  label: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = "What do you want to listen to?" }) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    genre: '',
    mood: '',
    tempo: ''
  });
  
  const genres: FilterOption[] = [
    { value: '', label: 'All Genres' },
    { value: 'pop', label: 'Pop' },
    { value: 'rock', label: 'Rock' },
    { value: 'hip-hop', label: 'Hip-Hop' },
    { value: 'electronic', label: 'Electronic' },
    { value: 'jazz', label: 'Jazz' },
    { value: 'classical', label: 'Classical' },
    { value: 'country', label: 'Country' },
    { value: 'blues', label: 'Blues' },
    { value: 'reggae', label: 'Reggae' },
    { value: 'indie', label: 'Indie' },
    { value: 'folk', label: 'Folk' },
    { value: 'metal', label: 'Metal' },
    { value: 'punk', label: 'Punk' },
    { value: 'rnb', label: 'R&B' },
    { value: 'soul', label: 'Soul' },
    { value: 'disco', label: 'Disco' },
    { value: 'funk', label: 'Funk' },
  ];
  
  const moods: FilterOption[] = [
    { value: '', label: 'All Moods' },
    { value: 'happy', label: 'Happy' },
    { value: 'sad', label: 'Sad' },
    { value: 'energetic', label: 'Energetic' },
    { value: 'chill', label: 'Chill' },
    { value: 'romantic', label: 'Romantic' },
    { value: 'motivational', label: 'Motivational' },
    { value: 'focus', label: 'Focus' },
    { value: 'party', label: 'Party' },
    { value: 'workout', label: 'Workout' },
    { value: 'sleep', label: 'Sleep' },
  ];
  
  const tempos: FilterOption[] = [
    { value: '', label: 'All Tempos' },
    { value: 'slow', label: 'Slow (< 100 BPM)' },
    { value: 'medium', label: 'Medium (100-130 BPM)' },
    { value: 'fast', label: 'Fast (> 130 BPM)' },
  ];
  
  const activeFilters = Object.entries(filters).filter(([_, value]) => value !== '');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, filters);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery, filters); // Real-time search with filters
  };
  
  const handleFilterChange = (filterType: keyof typeof filters, value: string) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onSearch(query, newFilters);
  };
  
  const clearFilter = (filterType: keyof typeof filters) => {
    const newFilters = { ...filters, [filterType]: '' };
    setFilters(newFilters);
    onSearch(query, newFilters);
  };
  
  const clearAllFilters = () => {
    const clearedFilters = { genre: '', mood: '', tempo: '' };
    setFilters(clearedFilters);
    onSearch(query, clearedFilters);
  };

  return (
    <div className="max-w-2xl w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full bg-white dark:bg-gray-700 text-black dark:text-white pl-10 pr-10 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-300 dark:border-gray-600"
          />
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-24 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
        
        {/* Active filters display */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {activeFilters.map(([filterType, value]) => {
              const label = filterType.charAt(0).toUpperCase() + filterType.slice(1);
              return (
                <div key={filterType} className="flex items-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-xs">
                  <span>{label}: {value}</span>
                  <button 
                    type="button" 
                    onClick={() => clearFilter(filterType as keyof typeof filters)}
                    className="ml-2"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
            <button 
              type="button" 
              onClick={clearAllFilters}
              className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Clear all
            </button>
          </div>
        )}
        
        {/* Filter dropdowns */}
        {showFilters && (
          <div className="mt-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Genre Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Genre</label>
                <select
                  value={filters.genre}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                  className="w-full bg-white dark:bg-gray-700 text-black dark:text-white px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-300 dark:border-gray-600"
                >
                  {genres.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Mood Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mood</label>
                <select
                  value={filters.mood}
                  onChange={(e) => handleFilterChange('mood', e.target.value)}
                  className="w-full bg-white dark:bg-gray-700 text-black dark:text-white px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-300 dark:border-gray-600"
                >
                  {moods.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Tempo Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tempo</label>
                <select
                  value={filters.tempo}
                  onChange={(e) => handleFilterChange('tempo', e.target.value)}
                  className="w-full bg-white dark:bg-gray-700 text-black dark:text-white px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-300 dark:border-gray-600"
                >
                  {tempos.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
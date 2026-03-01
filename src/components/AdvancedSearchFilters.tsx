import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface AdvancedSearchFiltersProps {
  onFilterChange: (filters: {
    genre: string;
    mood: string;
    tempo: string;
    album_id: string;
  }) => void;
}

const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    genre: '',
    mood: '',
    tempo: '',
    album_id: ''
  });

  const genres = [
    'All Genres',
    'Romantic Songs', 
    'Sad / Heartbreak Songs',
    'Item Songs',
    'Devotional / Bhajans',
    'Patriotic Songs',
    'Festive Songs'
  ];

  const moods = [
    'All Moods',
    'Happy',
    'Sad',
    'Energetic',
    'Calm'
  ];

  const tempos = [
    'All Tempos',
    'Slow',
    'Medium',
    'Fast',
    'Very Fast'
  ];

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    const newFilters = { ...filters, [key]: value === 'All' || value === '' ? '' : value };
    setFilters(newFilters);
    onFilterChange({
      genre: newFilters.genre || '',
      mood: newFilters.mood || '',
      tempo: newFilters.tempo || '',
      album_id: newFilters.album_id || '',
    });
  };

  const clearFilter = (key: keyof typeof filters) => {
    const newFilters = { ...filters, [key]: '' };
    setFilters(newFilters);
    onFilterChange({
      genre: newFilters.genre || '',
      mood: newFilters.mood || '',
      tempo: newFilters.tempo || '',
      album_id: newFilters.album_id || '',
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        <span>Advanced Filters</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 p-4">
          <div className="space-y-4">
            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Genre</label>
              <select
                value={filters.genre || 'All Genres'}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                className="w-full bg-gray-700 text-white rounded px-3 py-2"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre === 'All Genres' ? '' : genre}>
                    {genre}
                  </option>
                ))}
              </select>
              {filters.genre && (
                <button 
                  onClick={() => clearFilter('genre')}
                  className="mt-1 text-xs text-gray-400 hover:text-white flex items-center"
                >
                  <X className="w-3 h-3 mr-1" /> Clear
                </button>
              )}
            </div>

            {/* Mood Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Mood</label>
              <select
                value={filters.mood || 'All Moods'}
                onChange={(e) => handleFilterChange('mood', e.target.value.toLowerCase())}
                className="w-full bg-gray-700 text-white rounded px-3 py-2"
              >
                {moods.map(mood => (
                  <option key={mood} value={mood === 'All Moods' ? '' : mood.toLowerCase()}>
                    {mood}
                  </option>
                ))}
              </select>
              {filters.mood && (
                <button 
                  onClick={() => clearFilter('mood')}
                  className="mt-1 text-xs text-gray-400 hover:text-white flex items-center"
                >
                  <X className="w-3 h-3 mr-1" /> Clear
                </button>
              )}
            </div>

            {/* Tempo Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Tempo</label>
              <select
                value={filters.tempo || 'All Tempos'}
                onChange={(e) => handleFilterChange('tempo', e.target.value.toLowerCase())}
                className="w-full bg-gray-700 text-white rounded px-3 py-2"
              >
                {tempos.map(tempo => (
                  <option key={tempo} value={tempo === 'All Tempos' ? '' : tempo.toLowerCase()}>
                    {tempo}
                  </option>
                ))}
              </select>
              {filters.tempo && (
                <button 
                  onClick={() => clearFilter('tempo')}
                  className="mt-1 text-xs text-gray-400 hover:text-white flex items-center"
                >
                  <X className="w-3 h-3 mr-1" /> Clear
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {(filters.genre || filters.mood || filters.tempo) && (
        <div className="mt-2 flex flex-wrap gap-2">
          {filters.genre && (
            <div className="flex items-center bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
              <span>{filters.genre}</span>
              <button 
                onClick={() => clearFilter('genre')}
                className="ml-2 text-gray-300 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {filters.mood && (
            <div className="flex items-center bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
              <span>{filters.mood.charAt(0).toUpperCase() + filters.mood.slice(1)}</span>
              <button 
                onClick={() => clearFilter('mood')}
                className="ml-2 text-gray-300 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {filters.tempo && (
            <div className="flex items-center bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
              <span>{filters.tempo.charAt(0).toUpperCase() + filters.tempo.slice(1)}</span>
              <button 
                onClick={() => clearFilter('tempo')}
                className="ml-2 text-gray-300 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchFilters;
import React, { useState, useEffect } from 'react';
import { Star, ChevronRight, Film, TrendingUp, Info, Calendar, Play } from 'lucide-react';
import { mockMovies, movieGenres } from '../data/movieData';

interface MoviesProps {
    setCurrentView: (view: string) => void;
}

const Movies: React.FC<MoviesProps> = ({ setCurrentView }) => {
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [heroIndex, setHeroIndex] = useState(0); 
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Feature the top 5 highest rated or upcoming movies for the carousel
    const featuredMovies = mockMovies.slice(0, 5); 

    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setHeroIndex((prev) => (prev + 1) % featuredMovies.length);
                setIsTransitioning(false);
            }, 500); // 500ms transition time
        }, 7000); // Rotate every 7 seconds

        return () => clearInterval(interval);
    }, [featuredMovies.length]);

    const featuredMovie = featuredMovies[heroIndex];

    const filteredMovies = selectedGenre
        ? mockMovies.filter(m => m.genre.some(g => g.toLowerCase() === selectedGenre))
        : mockMovies;

    return (
        <div className="flex-1 bg-[#0a0a0a] text-white overflow-y-auto w-full pb-10">
            {/* DYNAMIC HERO CAROUSEL */}
            <div className="relative h-[75vh] min-h-[500px] lg:h-[85vh] w-full overflow-hidden group">
                <div 
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
                >
                    <img
                        src={featuredMovie.hero}
                        alt={featuredMovie.title}
                        className="w-full h-full object-cover transform scale-105"
                    />
                    {/* Premium Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-black/20" /> {/* Subtle overall darkening */}

                    {/* Hero content */}
                    <div className="absolute bottom-0 left-0 p-8 sm:p-12 md:w-2/3 lg:w-1/2 z-10 transition-transform duration-700 delay-100 translate-y-0">
                        <div className="flex items-center space-x-3 mb-4">
                            <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white tracking-widest text-[10px] font-bold px-3 py-1 rounded-sm uppercase">
                                Top Picks
                            </span>
                            <div className="flex items-center space-x-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-yellow-500/30">
                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                <span className="text-white text-xs font-bold">{featuredMovie.rating.toFixed(1)}</span>
                            </div>
                        </div>
                        
                        <h1 className="text-4xl sm:text-6xl font-black mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 drop-shadow-lg">
                            {featuredMovie.title}
                        </h1>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                            {featuredMovie.genre.map(g => (
                                <span key={g} className="text-xs font-medium text-gray-300">
                                    {g} <span className="text-gray-600 mx-1">�</span>
                                </span>
                            ))}
                            {(featuredMovie as any).releaseDate && (
                                <span className="text-green-400 font-medium text-xs flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" /> {(featuredMovie as any).releaseDate}
                                </span>
                            )}
                        </div>
                        
                        <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 line-clamp-3 max-w-xl text-shadow-sm font-light">
                            {featuredMovie.description}
                        </p>
                        
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setCurrentView(`movie:${featuredMovie.id}`)}
                                className="group/btn flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3.5 rounded-full font-bold hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all duration-300 hover:scale-105"
                            >
                                <Play className="w-5 h-5 fill-white" />
                                <span>Watch Trailer</span>
                            </button>
                            <button
                                onClick={() => setCurrentView(`movie:${featuredMovie.id}`)}
                                className="flex items-center space-x-2 bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-3.5 rounded-full font-bold hover:bg-white/20 transition-all duration-300"
                            >
                                <Info className="w-5 h-5" />
                                <span>More Info</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Carousel Indicators */}
                <div className="absolute bottom-8 right-8 lg:right-12 flex space-x-2 z-20">
                    {featuredMovies.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setHeroIndex(idx)}
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                                heroIndex === idx ? 'w-8 bg-red-600' : 'w-2 bg-white/40 hover:bg-white/70'
                            }`}
                        />
                    ))}
                </div>
            </div>

            <div className="px-4 sm:px-8 lg:px-12 py-12 space-y-12 w-full max-w-[2400px] mx-auto">
                {/* Genre Categories */}
                <section>
                    <div className="flex items-end justify-between mb-6">
                        <h2 className="text-2xl font-bold tracking-tight text-white/90">
                            Explore <span className="text-red-500">Genres</span>
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        <button
                            onClick={() => setSelectedGenre(null)}
                            className={`relative overflow-hidden group rounded-2xl p-4 transition-all duration-300 border ${
                                !selectedGenre 
                                ? 'bg-white/10 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)] ring-1 ring-red-500/50' 
                                : 'bg-[#121212] border-white/5 hover:border-white/20 hover:bg-[#1a1a1a]'
                            }`}
                        >
                            <div className="relative z-10 flex flex-col items-center justify-center space-y-2">
                                <Film className={`w-8 h-8 ${!selectedGenre ? 'text-red-500' : 'text-gray-400 group-hover:text-white transition-colors'}`} />
                                <span className={`text-sm font-bold ${!selectedGenre ? 'text-white' : 'text-gray-400 group-hover:text-white transition-colors'}`}>All</span>
                            </div>
                        </button>
                        
                        {movieGenres.map((genre) => {
                            const isSelected = selectedGenre === genre.id;
                            return (
                                <button
                                    key={genre.id}
                                    onClick={() => setSelectedGenre(isSelected ? null : genre.id)}
                                    className={`relative overflow-hidden group rounded-2xl p-4 transition-all duration-300 border ${
                                        isSelected 
                                        ? `bg-gradient-to-br ${genre.gradient} border-white/20 shadow-lg ring-1 ring-white/30` 
                                        : 'bg-[#121212] border-white/5 hover:border-white/20 hover:bg-[#1a1a1a]'
                                    }`}
                                >
                                    {/* Subtle gradient background on hover for unselected */}
                                    {!isSelected && (
                                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${genre.gradient} transition-opacity duration-300`} />
                                    )}
                                    
                                    <div className="relative z-10 flex flex-col items-center justify-center space-y-2">
                                        <span className="text-3xl drop-shadow-md group-hover:scale-110 transition-transform duration-300">{genre.emoji}</span>
                                        <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-white transition-colors'}`}>{genre.label}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Movie Grid */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold tracking-tight text-white/90">
                            {selectedGenre
                                ? movieGenres.find(g => g.id === selectedGenre)?.label + ' Collection'
                                : 'Trending Now'}
                        </h2>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent ml-6 mr-4 opacity-50" />
                        <span className="text-gray-400 text-sm font-medium bg-[#1a1a1a] px-3 py-1 rounded-full border border-white/5">{filteredMovies.length} films</span>
                    </div>

                    {filteredMovies.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-[#121212] rounded-3xl border border-white/5">
                            <Film className="w-16 h-16 text-gray-600 mb-4" />
                            <p className="text-xl font-medium text-gray-400">No movies found in this collection.</p>
                            <button 
                                onClick={() => setSelectedGenre(null)}
                                className="mt-6 text-red-500 hover:text-red-400 font-medium transition-colors"
                            >
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-x-4 gap-y-10">
                            {filteredMovies.map(movie => (
                                <div
                                    key={movie.id}
                                    className="cursor-pointer group flex flex-col"
                                    onClick={() => setCurrentView(`movie:${movie.id}`)}
                                >
                                    {/* Card Image Container */}
                                    <div className="relative rounded-2xl overflow-hidden mb-4 aspect-[2/3] shadow-lg border border-white/5 bg-[#1a1a1a]">
                                        <img
                                            src={movie.poster}
                                            alt={movie.title}
                                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                        />
                                        
                                        {/* Premium Glassmorphism Hover Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out" />
                                        
                                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out flex flex-col items-center justify-end h-full">
                                            <button className="w-12 h-12 bg-red-600/90 backdrop-blur-md rounded-full flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(220,38,38,0.5)] transform hover:scale-110 hover:bg-red-500 transition-all">
                                                <Play className="w-5 h-5 fill-white text-white ml-1" />
                                            </button>
                                            <p className="text-white text-xs text-center line-clamp-2 leading-relaxed opacity-80 backdrop-blur-sm">
                                                {movie.description}
                                            </p>
                                        </div>

                                        {/* Rating badge - always visible but styled better */}
                                        <div className="absolute top-3 right-3 flex items-center space-x-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 shadow-lg group-hover:bg-black/80 transition-colors">
                                            <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                                            <span className="text-white text-xs font-bold">{movie.rating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Card Meta Container - Slides up slightly on hover */}
                                    <div className="px-1 transform group-hover:-translate-y-1 transition-transform duration-300">
                                        <h3 className="text-white font-bold text-base truncate mb-1 group-hover:text-red-400 transition-colors">
                                            {movie.title}
                                        </h3>
                                        <div className="flex items-center space-x-2 text-xs font-medium text-gray-400 group-hover:text-gray-300 transition-colors">
                                            <span>{movie.year}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-600" />
                                            <span className="truncate">{movie.genre.join(', ')}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Movies;

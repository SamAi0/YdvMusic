import React, { useState } from 'react';
import { Star, ArrowLeft, Users, MessageCircle, ChevronRight, Calendar } from 'lucide-react';
import { getMovieById, getRecommendedMovies } from '../data/movieData';

interface MovieDetailProps {
    movieId: string;
    setCurrentView: (view: string) => void;
}

const MovieDetail: React.FC<MovieDetailProps> = ({ movieId, setCurrentView }) => {
    const movie = getMovieById(movieId);
    const [activeTab, setActiveTab] = useState<'overview' | 'cast' | 'reviews'>('overview');

    if (!movie) {
        return (
            <div className="flex-1 bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-400 mb-4">Movie not found</p>
                    <button onClick={() => setCurrentView('movies')} className="text-green-400 hover:text-green-300">
                        ← Back to Movies
                    </button>
                </div>
            </div>
        );
    }

    const recommendations = getRecommendedMovies(movie.recommendationIds);

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < Math.round(rating / 2) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
            />
        ));
    };

    return (
        <div className="flex-1 bg-black text-white overflow-y-auto">
            {/* Hero */}
            <div className="relative h-80 sm:h-96">
                <img
                    src={movie.hero}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                {/* Back button */}
                <button
                    onClick={() => setCurrentView('movies')}
                    className="absolute top-4 left-4 flex items-center space-x-2 bg-black/50 backdrop-blur text-white px-3 py-2 rounded-full hover:bg-black/70 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm">Movies</span>
                </button>

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex flex-wrap gap-2 mb-2">
                        {movie.genre.map(g => (
                            <span key={g} className="text-xs bg-white/10 backdrop-blur px-2 py-1 rounded-full text-gray-200">{g}</span>
                        ))}
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black mb-1">{movie.title}</h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-300">
                        <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 font-medium">{(movie as any).releaseDate || movie.year}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-yellow-400 font-bold">{movie.rating.toFixed(1)}</span>
                            <span className="text-gray-400">/10</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info bar */}
            <div className="px-6 py-4 border-b border-gray-800 flex flex-wrap gap-3 items-center">
                {/* Upcoming / Released badge */}
                {(movie as any).upcoming ? (
                    <div className="flex items-center space-x-1.5 bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
                        <span className="text-green-400 text-xs font-bold tracking-wide">UPCOMING</span>
                    </div>
                ) : (
                    <div className="flex items-center space-x-1.5 bg-blue-500/10 border border-blue-500/30 px-3 py-1.5 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                        <span className="text-blue-400 text-xs font-bold tracking-wide">RELEASED</span>
                    </div>
                )}

                {/* Director */}
                <div className="text-gray-400 text-sm">
                    <span className="text-white font-medium">Director:</span> {movie.director}
                </div>

                {/* Studio */}
                {(movie as any).studio && (
                    <div className="text-gray-400 text-sm">
                        <span className="text-white font-medium">Studio:</span> {(movie as any).studio}
                    </div>
                )}

                {/* Languages */}
                {(movie as any).languages && (
                    <div className="flex flex-wrap gap-1 items-center">
                        <span className="text-white font-medium text-sm">Languages:</span>
                        {((movie as any).languages as string[]).map((lang: string) => (
                            <span key={lang} className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-gray-300">{lang}</span>
                        ))}
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="px-6 border-b border-gray-800">
                <div className="flex space-x-6">
                    {(['overview', 'cast', 'reviews'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-4 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab
                                ? 'border-white text-white'
                                : 'border-transparent text-gray-400 hover:text-white'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab content */}
            <div className="px-6 py-6">
                {/* Overview */}
                {activeTab === 'overview' && (
                    <div>
                        <p className="text-gray-300 leading-relaxed text-base mb-8">{movie.description}</p>

                        {/* Recommendations */}
                        <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                            <ChevronRight className="w-5 h-5 text-green-400" />
                            <span>More Like This</span>
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {recommendations.map(rec => (
                                <div
                                    key={rec.id}
                                    className="cursor-pointer group"
                                    onClick={() => setCurrentView(`movie:${rec.id}`)}
                                >
                                    <div className="relative rounded-xl overflow-hidden mb-2">
                                        <img
                                            src={rec.poster}
                                            alt={rec.title}
                                            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <ChevronRight className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    <p className="text-white font-medium text-sm truncate">{rec.title}</p>
                                    <div className="flex items-center space-x-1">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-gray-400 text-xs">{rec.rating.toFixed(1)}</span>
                                        <span className="text-gray-600 text-xs">• {rec.year}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Cast */}
                {activeTab === 'cast' && (
                    <div>
                        <div className="flex items-center space-x-2 mb-4 text-gray-400">
                            <Users className="w-5 h-5" />
                            <span className="text-sm">{movie.cast.length} cast members</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {movie.cast.map(member => (
                                <div key={member.id} className="text-center group">
                                    <div className="relative mx-auto w-20 h-20 rounded-full overflow-hidden mb-3 ring-2 ring-transparent group-hover:ring-green-500 transition-all">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <p className="text-white font-medium text-sm">{member.name}</p>
                                    <p className="text-gray-400 text-xs mt-1 italic">as {member.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reviews */}
                {activeTab === 'reviews' && (
                    <div>
                        <div className="flex items-center space-x-2 mb-6 text-gray-400">
                            <MessageCircle className="w-5 h-5" />
                            <span className="text-sm">{movie.reviews.length} reviews</span>
                        </div>

                        {/* Avg Rating */}
                        <div className="bg-gray-900 rounded-2xl p-6 mb-6 flex items-center space-x-6">
                            <div className="text-center">
                                <div className="text-5xl font-black text-yellow-400">{movie.rating.toFixed(1)}</div>
                                <div className="text-gray-400 text-sm mt-1">out of 10</div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-1 mb-1">
                                    {renderStars(movie.rating)}
                                </div>
                                <p className="text-gray-300 text-sm">Based on {movie.reviews.length} ratings</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {movie.reviews.map(review => (
                                <div key={review.id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="text-white font-medium text-sm">{review.author}</p>
                                            <p className="text-gray-500 text-xs">{new Date(review.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                        <div className="flex items-center space-x-1 bg-yellow-400/10 px-2 py-1 rounded-lg">
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            <span className="text-yellow-400 text-xs font-bold">{review.rating}/10</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieDetail;

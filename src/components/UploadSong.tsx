import React, { useState, useRef, useCallback } from 'react';
import { musicAPI } from '../services/api';
import { Upload, Music, X, Play, Pause } from 'lucide-react';
import toast from 'react-hot-toast';

const UploadSong: React.FC = () => {
  const [title, setTitle] = useState('');
  const [artistId, setArtistId] = useState('');
  const [albumId, setAlbumId] = useState('');
  const [duration, setDuration] = useState<number | ''>('');
  const [genre, setGenre] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-fill duration from audio file metadata
  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.addEventListener('loadedmetadata', () => {
        resolve(Math.round(audio.duration));
      });
      audio.addEventListener('error', () => {
        resolve(0); // Default if unable to get duration
      });
      audio.src = URL.createObjectURL(file);
    });
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Validate audio file type
  const isValidAudioFile = (file: File): boolean => {
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/flac', 'audio/aac', 'audio/ogg'];
    return validTypes.includes(file.type) || !!file.name.toLowerCase().match(/\.(mp3|wav|m4a|flac|aac|ogg)$/);
  };

  // Handle file selection (both drag and click)
  const handleFileSelect = useCallback(async (selectedFile: File) => {
    if (!isValidAudioFile(selectedFile)) {
      toast.error('Please select a valid audio file (MP3, WAV, M4A, FLAC, AAC, OGG)');
      return;
    }

    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (selectedFile.size > maxSize) {
      toast.error('File size must be less than 50MB');
      return;
    }

    setFile(selectedFile);
    
    // Auto-fill title from filename if not set
    if (!title) {
      const fileName = selectedFile.name.replace(/\.[^/.]+$/, '');
      setTitle(fileName);
    }

    // Auto-fill duration from audio metadata
    try {
      const audioDuration = await getAudioDuration(selectedFile);
      if (audioDuration > 0 && !duration) {
        setDuration(audioDuration);
      }
    } catch (error) {
      console.log('Could not extract audio duration');
    }

    toast.success(`File "${selectedFile.name}" selected`);
  }, [title, duration]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles[0]);
    }
  }, [handleFileSelect]);

  // Click handler for file input
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  // Click to open file dialog
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Remove selected file
  const removeFile = () => {
    setFile(null);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Audio preview controls
  const toggleAudioPreview = () => {
    if (!file) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(URL.createObjectURL(file));
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
      });
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select an audio file');
      return;
    }
    if (!title || !artistId || !duration) {
      toast.error('Title, Artist and Duration are required');
      return;
    }

    const form = new FormData();
    form.append('audio', file);
    form.append('title', title);
    form.append('artist_id', artistId);
    if (albumId) form.append('album_id', albumId);
    form.append('duration', String(duration));
    if (genre) form.append('genre', genre);

    setLoading(true);
    try {
      await musicAPI.uploadSong(form);
      toast.success('Song uploaded successfully');
      // Reset form
      setTitle('');
      setArtistId('');
      setAlbumId('');
      setDuration('');
      setGenre('');
      setFile(null);
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      toast.error(err?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Upload Song</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Drag and Drop File Upload Area */}
        <div className="space-y-4">
          <label className="block text-sm text-gray-300 mb-2">Audio File</label>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          {/* Drag and Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFileDialog}
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
              ${isDragOver 
                ? 'border-green-400 bg-green-500/10 scale-105' 
                : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
              }
              ${file ? 'border-green-500 bg-green-500/5' : ''}
            `}
          >
            {file ? (
              /* File Selected State */
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <Music className="w-12 h-12 text-green-500" />
                </div>
                <div>
                  <p className="text-green-500 font-medium text-lg">{file.name}</p>
                  <p className="text-gray-400 text-sm">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAudioPreview();
                    }}
                    className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-1" />
                        Preview
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="inline-flex items-center px-3 py-1.5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Remove
                  </button>
                </div>
                <p className="text-gray-500 text-sm">Click to select a different file or drag to replace</p>
              </div>
            ) : (
              /* Empty State */
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <Upload className={`w-12 h-12 transition-colors ${
                    isDragOver ? 'text-green-400' : 'text-gray-400'
                  }`} />
                </div>
                <div>
                  <p className={`text-lg font-medium transition-colors ${
                    isDragOver ? 'text-green-400' : 'text-white'
                  }`}>
                    {isDragOver ? 'Drop your audio file here' : 'Drag & drop your audio file here'}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    or click to browse files
                  </p>
                </div>
                <div className="text-xs text-gray-500">
                  Supported formats: MP3, WAV, M4A, FLAC
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Song Information Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter song title"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Artist ID *</label>
              <input
                value={artistId}
                onChange={(e) => setArtistId(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="UUID of artist"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Album ID (optional)</label>
              <input
                value={albumId}
                onChange={(e) => setAlbumId(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="UUID of album"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Duration (seconds) *</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. 210"
                required
                min={1}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Genre (optional)</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select a genre</option>
                <option value="Romantic Songs">Romantic Songs</option>
                <option value="Sad / Heartbreak Songs">Sad / Heartbreak Songs</option>
                <option value="Item Songs">Item Songs</option>
                <option value="Devotional / Bhajans">Devotional / Bhajans</option>
                <option value="Patriotic Songs">Patriotic Songs</option>
                <option value="Festive Songs">Festive Songs</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center space-x-4">
          <button
            type="submit"
            disabled={loading || !file}
            className="bg-green-500 text-black font-medium px-8 py-3 rounded-full hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload Song</span>
              </>
            )}
          </button>
          
          {file && (
            <button
              type="button"
              onClick={() => {
                setTitle('');
                setArtistId('');
                setAlbumId('');
                setDuration('');
                setGenre('');
                removeFile();
              }}
              className="px-6 py-3 rounded-full border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
            >
              Clear Form
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UploadSong;



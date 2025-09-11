import React, { useState } from 'react';
import { musicAPI } from '../services/api';
import toast from 'react-hot-toast';

const UploadSong: React.FC = () => {
  const [title, setTitle] = useState('');
  const [artistId, setArtistId] = useState('');
  const [albumId, setAlbumId] = useState('');
  const [duration, setDuration] = useState<number | ''>('');
  const [genre, setGenre] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

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
      setTitle('');
      setArtistId('');
      setAlbumId('');
      setDuration('');
      setGenre('');
      setFile(null);
    } catch (err: any) {
      toast.error(err?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Upload Song</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Title</label>
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
            <label className="block text-sm text-gray-300 mb-1">Artist ID</label>
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
            <label className="block text-sm text-gray-300 mb-1">Duration (seconds)</label>
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
            <input
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. Pop"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Audio File</label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-gray-200"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-black font-medium px-6 py-2 rounded-full hover:bg-green-400 disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default UploadSong;



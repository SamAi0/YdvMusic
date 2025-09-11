import React, { useState } from 'react';
import UploadSong from './UploadSong';

type TabKey = 'upload' | 'songs' | 'artists' | 'albums';

const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState<TabKey>('upload');

  return (
    <div className="flex-1 bg-gradient-to-b from-gray-800 to-black dark:from-gray-800 dark:to-gray-900 text-white overflow-y-auto">
      <div className="px-6 pt-6">
        <div className="flex space-x-2 mb-6">
          {([
            ['upload', 'Upload'],
            ['songs', 'Songs'],
            ['artists', 'Artists'],
            ['albums', 'Albums'],
          ] as [TabKey, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-full ${
                tab === key ? 'bg-green-500 text-black' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'upload' && <UploadSong />}
      {tab !== 'upload' && (
        <div className="p-6 text-gray-300">Coming soon.</div>
      )}
    </div>
  );
};

export default AdminDashboard;



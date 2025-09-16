import React, { useState, useEffect } from 'react';
import { User, Camera, Edit3, Settings, BarChart3, Calendar, Clock, Trophy, Music, Heart, Play, Globe, Lock, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { 
  LocalUser, 
  ProfileStats, 
  UserPreferences, 
  getProfileStats, 
  getUserPreferences, 
  saveUserPreferences, 
  updateUserProfile,
  getTopArtists,
  getTopGenres 
} from '../utils/localData';
import toast from 'react-hot-toast';

interface ProfileProps {
  onClose: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onClose }) => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'settings' | 'edit'>('overview');
  const [profileStats, setProfileStats] = useState<ProfileStats | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<LocalUser>>({});

  useEffect(() => {
    if (user) {
      setProfileStats(getProfileStats(user.id));
      setPreferences(getUserPreferences(user.id));
      setEditForm({
        fullName: user.fullName,
        username: user.username || '',
        bio: user.bio || '',
        country: user.country || '',
        dateOfBirth: user.dateOfBirth || '',
        isPrivate: user.isPrivate || false
      });
    }
  }, [user]);

  const handleSaveProfile = () => {
    if (user) {
      updateUserProfile(editForm);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    }
  };

  const handleSavePreferences = () => {
    if (user && preferences) {
      saveUserPreferences(user.id, preferences);
      toast.success('Preferences saved!');
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getAvatarUrl = () => {
    return user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=10b981&color=fff&size=200`;
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-t-lg">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={getAvatarUrl()}
                alt={user.fullName}
                className="w-20 h-20 rounded-full border-4 border-white"
              />
              <button className="absolute bottom-0 right-0 bg-white text-gray-800 rounded-full p-1 hover:bg-gray-100 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-white">
              <h1 className="text-2xl font-bold">{user.fullName}</h1>
              <p className="text-blue-100">@{user.username || user.email.split('@')[0]}</p>
              {user.bio && (
                <p className="text-blue-100 mt-1">{user.bio}</p>
              )}
              <div className="flex items-center mt-2">
                <Calendar className="w-4 h-4 mr-1" />
                <span className="text-sm">Joined {new Date(user.joinedDate || new Date()).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-700">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'stats', label: 'Statistics', icon: BarChart3 },
            { id: 'settings', label: 'Settings', icon: Settings },
            { id: 'edit', label: 'Edit Profile', icon: Edit3 }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 px-6 py-3 border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-green-500 text-green-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <Music className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{profileStats?.totalSongsPlayed || 0}</p>
                  <p className="text-gray-400 text-sm">Songs Played</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{formatDuration(profileStats?.totalListeningTime || 0)}</p>
                  <p className="text-gray-400 text-sm">Listening Time</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{profileStats?.streakDays || 0}</p>
                  <p className="text-gray-400 text-sm">Day Streak</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 text-center">
                  <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{user.isAdmin ? 'Admin' : 'User'}</p>
                  <p className="text-gray-400 text-sm">Account Type</p>
                </div>
              </div>

              {/* Top Artists & Genres */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Top Artists</h3>
                  <div className="space-y-2">
                    {getTopArtists(user.id).map((artist, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-300">{artist.name}</span>
                        <span className="text-green-500 font-medium">{artist.playCount} plays</span>
                      </div>
                    ))}
                    {getTopArtists(user.id).length === 0 && (
                      <p className="text-gray-500 text-center py-4">Start listening to see your top artists!</p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Top Genres</h3>
                  <div className="space-y-2">
                    {getTopGenres(user.id).map((genre, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-300">{genre.name}</span>
                        <span className="text-blue-500 font-medium">{genre.playCount} plays</span>
                      </div>
                    ))}
                    {getTopGenres(user.id).length === 0 && (
                      <p className="text-gray-500 text-center py-4">Start listening to see your top genres!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm">Email</label>
                    <p className="text-white">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Country</label>
                    <p className="text-white">{user.country || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Privacy</label>
                    <div className="flex items-center space-x-2">
                      {user.isPrivate ? (
                        <><Lock className="w-4 h-4 text-yellow-500" /><span className="text-white">Private</span></>
                      ) : (
                        <><Globe className="w-4 h-4 text-green-500" /><span className="text-white">Public</span></>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Date of Birth</label>
                    <p className="text-white">{user.dateOfBirth || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              {/* Listening Statistics */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Detailed Statistics</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500 mb-2">
                      {profileStats?.totalSongsPlayed || 0}
                    </div>
                    <div className="text-gray-400">Total Songs Played</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-500 mb-2">
                      {Math.floor((profileStats?.totalListeningTime || 0) / 3600)}
                    </div>
                    <div className="text-gray-400">Hours Listened</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-500 mb-2">
                      {profileStats?.streakDays || 0}
                    </div>
                    <div className="text-gray-400">Current Streak</div>
                  </div>
                </div>
              </div>

              {/* Monthly Activity */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">This Month</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">
                      {profileStats?.thisMonthSongs || 0}
                    </div>
                    <div className="text-gray-400 text-sm">Songs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">
                      {Math.floor((profileStats?.thisMonthTime || 0) / 60)}
                    </div>
                    <div className="text-gray-400 text-sm">Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">
                      {profileStats?.favoriteArtistsCount || 0}
                    </div>
                    <div className="text-gray-400 text-sm">Artists</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500">
                      {profileStats?.favoriteGenresCount || 0}
                    </div>
                    <div className="text-gray-400 text-sm">Genres</div>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Achievements</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                    <Trophy className="w-8 h-8 text-yellow-500" />
                    <div>
                      <div className="text-white font-medium">Music Explorer</div>
                      <div className="text-gray-400 text-sm">Played songs from 5+ genres</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                    <Play className="w-8 h-8 text-green-500" />
                    <div>
                      <div className="text-white font-medium">Dedicated Listener</div>
                      <div className="text-gray-400 text-sm">5+ hour listening streak</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Audio Preferences */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Audio Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-300">Auto-play next song</span>
                      <input
                        type="checkbox"
                        checked={preferences?.autoPlay ?? true}
                        onChange={(e) => setPreferences(prev => prev ? {...prev, autoPlay: e.target.checked} : null)}
                        className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-300">Crossfade between songs</span>
                      <input
                        type="checkbox"
                        checked={preferences?.crossfade ?? false}
                        onChange={(e) => setPreferences(prev => prev ? {...prev, crossfade: e.target.checked} : null)}
                        className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-300">High quality audio</span>
                      <input
                        type="checkbox"
                        checked={preferences?.highQuality ?? false}
                        onChange={(e) => setPreferences(prev => prev ? {...prev, highQuality: e.target.checked} : null)}
                        className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Privacy Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-300">Make profile private</span>
                      <input
                        type="checkbox"
                        checked={preferences?.privateProfile ?? false}
                        onChange={(e) => setPreferences(prev => prev ? {...prev, privateProfile: e.target.checked} : null)}
                        className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-300">Hide listening activity</span>
                      <input
                        type="checkbox"
                        checked={preferences?.hideActivity ?? false}
                        onChange={(e) => setPreferences(prev => prev ? {...prev, hideActivity: e.target.checked} : null)}
                        className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Notifications</h3>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-300">Email notifications</span>
                      <input
                        type="checkbox"
                        checked={preferences?.emailNotifications ?? true}
                        onChange={(e) => setPreferences(prev => prev ? {...prev, emailNotifications: e.target.checked} : null)}
                        className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-300">Desktop notifications</span>
                      <input
                        type="checkbox"
                        checked={preferences?.desktopNotifications ?? false}
                        onChange={(e) => setPreferences(prev => prev ? {...prev, desktopNotifications: e.target.checked} : null)}
                        className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSavePreferences}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Preferences</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'edit' && (
            <div className="space-y-6">
              {/* Profile Information */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      value={editForm.fullName || ''}
                      onChange={(e) => setEditForm(prev => ({...prev, fullName: e.target.value}))}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Username</label>
                    <input
                      type="text"
                      value={editForm.username || ''}
                      onChange={(e) => setEditForm(prev => ({...prev, username: e.target.value}))}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Choose a username"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-300 text-sm font-medium mb-2">Bio</label>
                    <textarea
                      value={editForm.bio || ''}
                      onChange={(e) => setEditForm(prev => ({...prev, bio: e.target.value}))}
                      rows={3}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Country</label>
                    <input
                      type="text"
                      value={editForm.country || ''}
                      onChange={(e) => setEditForm(prev => ({...prev, country: e.target.value}))}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Your country"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Date of Birth</label>
                    <input
                      type="date"
                      value={editForm.dateOfBirth || ''}
                      onChange={(e) => setEditForm(prev => ({...prev, dateOfBirth: e.target.value}))}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Privacy Settings</h3>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={editForm.isPrivate || false}
                      onChange={(e) => setEditForm(prev => ({...prev, isPrivate: e.target.checked}))}
                      className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                    />
                    <div>
                      <div className="text-white font-medium">Private Profile</div>
                      <div className="text-gray-400 text-sm">Only you can see your listening activity and playlists</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
// src/pages/Settings.tsx
import React, { useState } from 'react';
import { Users, Zap, Settings as SettingsIcon, Save, LogOut } from 'lucide-react';
import { User } from '../api';

interface SettingsProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

export default function Settings({ user, setUser }: SettingsProps) {
  const [settings, setSettings] = useState({
    language: user.language || 'en',
    fontPreference: user.font_preference || 'Cinematic',
    defaultGenre: 'Drama',
    defaultMood: 'Dark',
    defaultAspectRatio: '2:3'
  });

  const handleSave = () => {
    setUser({
      ...user,
      language: settings.language,
      font_preference: settings.fontPreference
    });
    alert('Settings saved successfully!');
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      alert('Logged out successfully!');
      // In a real app, this would clear authentication state and redirect to login
    }
  };

  return (
    <div className="px-4 lg:px-8 pt-8 lg:pt-12 pb-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-8">Settings</h1>

        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-white" />
              <h2 className="text-white font-semibold text-xl">Profile Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Full Name</label>
                <input
                  value={user.full_name}
                  disabled
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Email</label>
                <input
                  value={user.email}
                  disabled
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Role</label>
                <input
                  value={user.role}
                  disabled
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white capitalize"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-white" />
              <h2 className="text-white font-semibold text-xl">Usage & Quota</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-2">Total Posters</label>
                <p className="text-2xl font-bold text-white">{user.poster_count}</p>
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Daily Quota</label>
                <p className="text-2xl font-bold text-white">{user.quota_remaining} / 5</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <SettingsIcon className="w-5 h-5 text-white" />
              <h2 className="text-white font-semibold text-xl">Preferences</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Interface Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({...settings, language: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gray-600"
                >
                  <option value="en">English</option>
                  <option value="ta-IN">தமிழ் (Tamil)</option>
                  <option value="te-IN">తెలుగు (Telugu)</option>
                  <option value="kn-IN">ಕನ್ನಡ (Kannada)</option>
                  <option value="ml-IN">മലയാളം (Malayalam)</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Default Font Style</label>
                <select
                  value={settings.fontPreference}
                  onChange={(e) => setSettings({...settings, fontPreference: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gray-600"
                >
                  <option value="Cinematic">Cinematic</option>
                  <option value="Classic">Classic</option>
                  <option value="Tamil-Sans">Tamil-Sans</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Default Genre</label>
                <select
                  value={settings.defaultGenre}
                  onChange={(e) => setSettings({...settings, defaultGenre: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gray-600"
                >
                  <option value="Drama">Drama</option>
                  <option value="Thriller">Thriller</option>
                  <option value="Romance">Romance</option>
                  <option value="Horror">Horror</option>
                  <option value="Comedy">Comedy</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Default Mood</label>
                <select
                  value={settings.defaultMood}
                  onChange={(e) => setSettings({...settings, defaultMood: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gray-600"
                >
                  <option value="Dark">Dark</option>
                  <option value="Dreamy">Dreamy</option>
                  <option value="Vintage">Vintage</option>
                  <option value="Futuristic">Futuristic</option>
                  <option value="Minimal">Minimal</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 border border-gray-700 text-white hover:bg-gray-800 px-6 py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
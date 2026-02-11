'use client';

import { useState } from 'react';
import { User, Bell, Shield, Wallet } from 'lucide-react';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    bio: '',
  });

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  const connectWallet = () => {
    setWalletConnected(true);
  };

  if (!walletConnected) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
          <Wallet className="w-12 h-12 text-white/40 mx-auto mb-4" />
          <p className="text-white/60 mb-6">Connect your wallet to access settings</p>
          <button 
            onClick={connectWallet}
            className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
      
      <div className="flex border-b border-white/10 mb-6">
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'security', label: 'Security', icon: Shield },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3 transition-colors ${
              activeTab === id 
                ? 'text-white border-b-2 border-purple-500' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>
      
      {activeTab === 'profile' && (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500"
              placeholder="Enter username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500 resize-none"
              rows={4}
              placeholder="Tell us about yourself"
            />
          </div>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
      
      {activeTab === 'notifications' && (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <p className="text-gray-400">Notification settings coming soon</p>
        </div>
      )}
      
      {activeTab === 'security' && (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between py-4 border-b border-white/10">
            <div>
              <h3 className="text-white font-medium">Wallet Address</h3>
              <p className="text-gray-400 text-sm font-mono">0x1234...5678</p>
            </div>
            <span className="text-green-400 text-sm">Connected</span>
          </div>
        </div>
      )}
    </div>
  );
}

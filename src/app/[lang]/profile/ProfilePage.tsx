'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useUser } from '@/hooks/useUser';
import { Settings, LogOut } from 'lucide-react';

export function ProfilePage() {
  const { publicKey, disconnect } = useWallet();
  const { user, loading } = useUser();
  const [activeTab, setActiveTab] = useState('posts');

  if (!publicKey) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-400">Connect your wallet to view your profile</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold text-white">
              {user?.username?.[0]?.toUpperCase() || '?'}
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-white">{user?.username || 'Anonymous'}</h1>
              <p className="text-gray-400 text-sm font-mono">
                {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
              </p>
              {user?.bio && <p className="text-gray-300 mt-2">{user.bio}</p>}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Settings size={20} />
            </button>
            <button 
              onClick={disconnect}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex gap-8 mt-6 pt-6 border-t border-white/10">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">0</div>
            <div className="text-gray-400 text-sm">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">0</div>
            <div className="text-gray-400 text-sm">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">0</div>
            <div className="text-gray-400 text-sm">Following</div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-6">
        {['posts', 'likes', 'bots'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-center capitalize transition-colors ${
              activeTab === tab 
                ? 'text-white border-b-2 border-purple-500' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className="text-center py-12 text-gray-500">
        No {activeTab} yet
      </div>
    </div>
  );
}

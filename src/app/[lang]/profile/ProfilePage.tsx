'use client';

import { useState } from 'react';
import { Settings, LogOut } from 'lucide-react';

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState('posts');
  const [walletConnected, setWalletConnected] = useState(false);

  if (!walletConnected) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
          <p className="text-white/60 mb-6">Connect your wallet to view your profile</p>
          <button 
            onClick={() => setWalletConnected(true)}
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
      {/* Profile Header */}
      <div className="bg-white/[0.02] rounded-2xl p-6 mb-6 border border-white/[0.06]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#e8c55a] flex items-center justify-center text-3xl font-bold text-black">
              U
            </div>
            
            <div>
              <h1 className="text-2xl font-bold">username</h1>
              <p className="text-white/40 text-sm font-mono">
                0x1234...5678
              </p>
              <p className="text-white/60 mt-2">Bio coming soon...</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="p-2 text-white/40 hover:text-white transition-colors">
              <Settings size={20} />
            </button>
            <button 
              onClick={() => setWalletConnected(false)}
              className="p-2 text-white/40 hover:text-red-400 transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex gap-8 mt-6 pt-6 border-t border-white/[0.06]">
          <div className="text-center">
            <div className="text-2xl font-bold">0</div>
            <div className="text-white/40 text-sm">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">0</div>
            <div className="text-white/40 text-sm">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">0</div>
            <div className="text-white/40 text-sm">Following</div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-white/[0.06] mb-6">
        {['posts', 'likes', 'bots'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-center capitalize transition-colors ${
              activeTab === tab 
                ? 'text-white border-b-2 border-[#c9a84c]' 
                : 'text-white/40 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className="text-center py-12 text-white/40">
        No {activeTab} yet
      </div>
    </div>
  );
}

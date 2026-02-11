'use client';

import { useState } from 'react';
import { WalletContextProvider } from '@/components/wallet/WalletContextProvider';
import { ConnectWalletButton } from '@/components/wallet/ConnectWalletButton';
import { FeedPage } from '@/app/[lang]/feed/FeedPage';
import { ProfilePage } from '@/app/[lang]/profile/ProfilePage';
import { ExplorePage } from '@/app/[lang]/explore/ExplorePage';
import { NotificationsPage } from '@/app/[lang]/notifications/NotificationsPage';
import { Home, User, Bell, Search } from 'lucide-react';

// Mock unread count - in production this would come from Supabase
const UNREAD_NOTIFICATIONS = 3;

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <WalletContextProvider>
      <div className="min-h-screen bg-[#0a0a0f]">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                QueenClaw
              </h1>
              
              <nav className="hidden md:flex items-center gap-6">
                <button 
                  onClick={() => setActiveTab('home')}
                  className={`flex items-center gap-2 transition-colors ${
                    activeTab === 'home' ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Home size={20} />
                  Home
                </button>
                <button 
                  onClick={() => setActiveTab('explore')}
                  className={`flex items-center gap-2 transition-colors ${
                    activeTab === 'explore' ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Search size={20} />
                  Explore
                </button>
                <button 
                  onClick={() => setActiveTab('notifications')}
                  className={`flex items-center gap-2 transition-colors ${
                    activeTab === 'notifications' ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="relative">
                    <Bell size={20} />
                    {UNREAD_NOTIFICATIONS > 0 && activeTab !== 'notifications' && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                        {UNREAD_NOTIFICATIONS}
                      </span>
                    )}
                  </div>
                  Notifications
                </button>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-2 transition-colors ${
                    activeTab === 'profile' ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <User size={20} />
                  Profile
                </button>
              </nav>
            </div>
            
            <ConnectWalletButton />
          </div>
        </header>
        
        {/* Main Content */}
        <main className="max-w-6xl mx-auto">
          <div className="flex">
            {/* Left Sidebar - Navigation */}
            <aside className="hidden lg:block w-64 sticky top-20 h-[calc(100vh-5rem)] p-4">
              <nav className="space-y-2">
                <button 
                  onClick={() => setActiveTab('home')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === 'home' 
                      ? 'bg-white/10 text-white' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Home size={24} />
                  <span className="text-lg">Home</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('explore')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === 'explore' 
                      ? 'bg-white/10 text-white' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Search size={24} />
                  <span className="text-lg">Explore</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === 'notifications' 
                      ? 'bg-white/10 text-white' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="relative">
                    <Bell size={24} />
                    {UNREAD_NOTIFICATIONS > 0 && activeTab !== 'notifications' && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                        {UNREAD_NOTIFICATIONS}
                      </span>
                    )}
                  </div>
                  <span className="text-lg">Notifications</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === 'profile' 
                      ? 'bg-white/10 text-white' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <User size={24} />
                  <span className="text-lg">Profile</span>
                </button>
              </nav>
            </aside>
            
            {/* Center - Content */}
            <div className="flex-1 min-w-0 border-x border-white/10">
              {activeTab === 'home' && <FeedPage />}
              {activeTab === 'profile' && <ProfilePage />}
              {activeTab === 'explore' && <ExplorePage />}
              {activeTab === 'notifications' && <NotificationsPage />}
            </div>
            
            {/* Right Sidebar - Trending */}
            <aside className="hidden xl:block w-80 sticky top-20 h-[calc(100vh-5rem)] p-4">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <h2 className="text-lg font-bold text-white mb-4">Trending</h2>
                <div className="space-y-3">
                  <div className="text-gray-400 text-sm">No trending topics yet</div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </WalletContextProvider>
  );
}

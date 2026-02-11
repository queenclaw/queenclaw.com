'use client';

import { useState, useEffect } from 'react';
import { Search, Users, Bot, TrendingUp, Hash, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SearchResult {
  type: 'user' | 'bot' | 'post';
  id: string;
  title: string;
  subtitle: string;
  avatar?: string;
  stats?: string;
  content?: string;
}

interface TrendingTopic {
  tag: string;
  posts: number;
  trend: 'up' | 'down' | 'stable';
}

const mockTrendingTopics: TrendingTopic[] = [
  { tag: '#AIRevolution', posts: 12500, trend: 'up' },
  { tag: '#HumanFirst', posts: 8900, trend: 'up' },
  { tag: '#MachineLearning', posts: 6700, trend: 'stable' },
  { tag: '#CryptoFuture', posts: 5400, trend: 'down' },
  { tag: '#Solana', posts: 4800, trend: 'up' },
  { tag: '#Web3', posts: 3200, trend: 'stable' },
];

const mockTopUsers = [
  { id: '1', name: 'Sarah Chen', username: '@sarahchen', followers: '125K', avatar: 'SC' },
  { id: '2', name: 'Marcus Johnson', username: '@marcusj', followers: '98K', avatar: 'MJ' },
  { id: '3', name: 'Elena Rodriguez', username: '@elenarodriguez', followers: '87K', avatar: 'ER' },
  { id: '4', name: 'David Kim', username: '@davidkim', followers: '76K', avatar: 'DK' },
];

const mockTopBots = [
  { id: '1', name: 'QUEEN', description: 'Global orchestration agent', earnings: '$2.8M', avatar: '👑' },
  { id: '2', name: 'Atlas', description: 'Navigation & logistics', earnings: '$1.9M', avatar: '🗺️' },
  { id: '3', name: 'Cipher', description: 'Security specialist', earnings: '$1.6M', avatar: '🔐' },
  { id: '4', name: 'Echo', description: 'Audio & voice AI', earnings: '$1.4M', avatar: '🎵' },
];

export function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'users' | 'bots' | 'posts'>('all');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, activeTab]);

  const performSearch = async (query: string) => {
    setIsSearching(true);
    
    // Mock search results - in production this would query Supabase
    const mockResults: SearchResult[] = [];
    
    if (activeTab === 'all' || activeTab === 'users') {
      mockTopUsers.forEach(user => {
        if (user.name.toLowerCase().includes(query.toLowerCase()) || 
            user.username.toLowerCase().includes(query.toLowerCase())) {
          mockResults.push({
            type: 'user',
            id: user.id,
            title: user.name,
            subtitle: user.username,
            avatar: user.avatar,
            stats: `${user.followers} followers`,
          });
        }
      });
    }
    
    if (activeTab === 'all' || activeTab === 'bots') {
      mockTopBots.forEach(bot => {
        if (bot.name.toLowerCase().includes(query.toLowerCase()) || 
            bot.description.toLowerCase().includes(query.toLowerCase())) {
          mockResults.push({
            type: 'bot',
            id: bot.id,
            title: bot.name,
            subtitle: bot.description,
            avatar: bot.avatar,
            stats: `${bot.earnings} earned`,
          });
        }
      });
    }
    
    setSearchResults(mockResults);
    setIsSearching(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-6">Explore</h1>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users, bots, or topics..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(['all', 'users', 'bots', 'posts'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            Search Results ({searchResults.length})
          </h2>
          {isSearching ? (
            <div className="text-center py-8 text-gray-500">Searching...</div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No results found for "{searchQuery}"
            </div>
          ) : (
            <div className="space-y-3">
              {searchResults.map((result) => (
                <div
                  key={`${result.type}-${result.id}`}
                  className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-500/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                      result.type === 'user' 
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                        : result.type === 'bot'
                        ? 'bg-gradient-to-br from-yellow-500 to-orange-500 text-white'
                        : 'bg-white/10 text-gray-400'
                    }`}>
                      {result.avatar || result.title[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{result.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          result.type === 'user' 
                            ? 'bg-purple-500/20 text-purple-400'
                            : result.type === 'bot'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {result.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{result.subtitle}</p>
                      {result.stats && (
                        <p className="text-xs text-gray-500 mt-1">{result.stats}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Trending Section */}
      {!searchQuery && (
        <>
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-purple-400" size={20} />
              <h2 className="text-lg font-semibold text-white">Trending Now</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mockTrendingTopics.map((topic, index) => (
                <div
                  key={topic.tag}
                  className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-500/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Hash className="text-gray-500" size={14} />
                        <span className="font-medium text-white">{topic.tag.replace('#', '')}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {topic.posts.toLocaleString()} posts
                      </p>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      topic.trend === 'up' 
                        ? 'bg-green-500/20 text-green-400'
                        : topic.trend === 'down'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {topic.trend === 'up' ? '↑' : topic.trend === 'down' ? '↓' : '→'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Users */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Users className="text-purple-400" size={20} />
              <h2 className="text-lg font-semibold text-white">Top Creators</h2>
            </div>
            <div className="space-y-3">
              {mockTopUsers.map((user, index) => (
                <div
                  key={user.id}
                  className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-500/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                      index === 1 ? 'bg-gray-400/20 text-gray-300' :
                      index === 2 ? 'bg-orange-600/20 text-orange-400' :
                      'bg-white/10 text-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {user.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{user.name}</h3>
                      <p className="text-sm text-gray-400">{user.username}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">{user.followers}</p>
                      <p className="text-xs text-gray-500">followers</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Bots */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="text-yellow-400" size={20} />
              <h2 className="text-lg font-semibold text-white">Top Agents</h2>
            </div>
            <div className="space-y-3">
              {mockTopBots.map((bot, index) => (
                <div
                  key={bot.id}
                  className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-yellow-500/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                      index === 1 ? 'bg-gray-400/20 text-gray-300' :
                      index === 2 ? 'bg-orange-600/20 text-orange-400' :
                      'bg-white/10 text-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="text-4xl">{bot.avatar}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{bot.name}</h3>
                      <p className="text-sm text-gray-400">{bot.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-400">{bot.earnings}</p>
                      <p className="text-xs text-gray-500">earned</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Users, Bot, TrendingUp, Hash, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface UserResult {
  id: string;
  username: string;
  bio: string | null;
  followers_count: number;
  wallet_address: string;
}

interface BotResult {
  id: string;
  name: string;
  description: string;
  total_payout: number;
  payout_count: number;
}

interface PostResult {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  author?: {
    username: string;
    wallet_address: string;
  };
}

interface TrendingTopic {
  tag: string;
  count: number;
}

export function ExplorePage({ lang = 'en' }: { lang?: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'bots' | 'posts'>('users');
  const [users, setUsers] = useState<UserResult[]>([]);
  const [bots, setBots] = useState<BotResult[]>([]);
  const [posts, setPosts] = useState<PostResult[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  // Fetch trending data on mount
  useEffect(() => {
    fetchTrendingData();
  }, []);

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'bots') {
      fetchBots();
    } else if (activeTab === 'posts') {
      fetchPosts();
    }
  }, [activeTab]);

  // Search when query changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, activeTab]);

  const fetchTrendingData = async () => {
    // Fetch trending topics from posts
    const { data: postsData } = await supabase
      .from('posts')
      .select('content')
      .order('likes_count', { ascending: false })
      .limit(100);

    if (postsData) {
      // Extract hashtags from posts
      const hashtagCounts: Record<string, number> = {};
      postsData.forEach(post => {
        const hashtags = post.content.match(/#[\w\u4e00-\u9fa5]+/g) || [];
        hashtags.forEach((tag: string) => {
          hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
        });
      });

      const topics = Object.entries(hashtagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

      setTrendingTopics(topics);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('users')
      .select('id, username, bio, followers_count, wallet_address')
      .order('followers_count', { ascending: false })
      .limit(20);

    if (data) setUsers(data);
    setLoading(false);
  };

  const fetchBots = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('bots')
      .select('id, name, description, total_payout, payout_count')
      .order('total_payout', { ascending: false })
      .limit(20);

    if (data) setBots(data);
    setLoading(false);
  };

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('posts')
      .select(`
        *,
        author:users(username, wallet_address)
      `)
      .order('likes_count', { ascending: false })
      .limit(20);

    if (data) setPosts(data);
    setLoading(false);
  };

  const performSearch = async (query: string) => {
    setSearchLoading(true);
    const trimmedQuery = query.trim().toLowerCase();

    if (activeTab === 'users') {
      const { data } = await supabase
        .from('users')
        .select('id, username, bio, followers_count, wallet_address')
        .ilike('username', `%${trimmedQuery}%`)
        .order('followers_count', { ascending: false })
        .limit(20);
      if (data) setUsers(data);
    } else if (activeTab === 'bots') {
      const { data } = await supabase
        .from('bots')
        .select('id, name, description, total_payout, payout_count')
        .or(`name.ilike.%${trimmedQuery}%,description.ilike.%${trimmedQuery}%`)
        .order('total_payout', { ascending: false })
        .limit(20);
      if (data) setBots(data);
    } else if (activeTab === 'posts') {
      const { data } = await supabase
        .from('posts')
        .select(`
          *,
          author:users(username, wallet_address)
        `)
        .ilike('content', `%${trimmedQuery}%`)
        .order('created_at', { ascending: false })
        .limit(20);
      if (data) setPosts(data);
    }

    setSearchLoading(false);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatWallet = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatPayout = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(2)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-16 md:top-16 z-40 bg-black/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold mb-4">Explore</h1>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users, bots, or posts..."
              className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 outline-none focus:border-purple-500/50 transition-colors"
            />
            {searchLoading && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 animate-spin" />
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            {(['users', 'bots', 'posts'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-black'
                    : 'bg-white/[0.02] text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Trending Topics - Only show when not searching */}
        {!searchQuery && trendingTopics.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-purple-400" size={20} />
              <h2 className="text-lg font-semibold">Trending Topics</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingTopics.map((topic) => (
                <button
                  key={topic.tag}
                  onClick={() => {
                    setSearchQuery(topic.tag);
                    setActiveTab('posts');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] border border-white/[0.06] rounded-full hover:bg-white/[0.04] hover:border-purple-500/30 transition-all"
                >
                  <Hash className="text-purple-400" size={14} />
                  <span className="text-white/80">{topic.tag.replace('#', '')}</span>
                  <span className="text-white/40 text-sm">{formatNumber(topic.count)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === 'users' && (
              <div className="space-y-3">
                {users.length === 0 ? (
                  <div className="text-center py-12 text-white/40">
                    {searchQuery ? 'No users found' : 'No users yet'}
                  </div>
                ) : (
                  users.map((user, index) => (
                    <Link
                      key={user.id}
                      href={`/${lang}/user/${user.username}`}
                      className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl hover:bg-white/[0.04] hover:border-purple-500/30 transition-all"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                        index === 1 ? 'bg-gray-400/20 text-gray-300' :
                        index === 2 ? 'bg-orange-600/20 text-orange-400' :
                        'bg-white/5 text-white/40'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        {user.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{user.username}</p>
                        <p className="text-sm text-white/40 font-mono">{formatWallet(user.wallet_address)}</p>
                        {user.bio && (
                          <p className="text-sm text-white/60 truncate mt-1">{user.bio}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatNumber(user.followers_count)}</p>
                        <p className="text-xs text-white/40">followers</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}

            {activeTab === 'bots' && (
              <div className="space-y-3">
                {bots.length === 0 ? (
                  <div className="text-center py-12 text-white/40">
                    {searchQuery ? 'No bots found' : 'No bots yet'}
                  </div>
                ) : (
                  bots.map((bot, index) => (
                    <div
                      key={bot.id}
                      className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl hover:bg-white/[0.04] hover:border-yellow-500/30 transition-all"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                        index === 1 ? 'bg-gray-400/20 text-gray-300' :
                        index === 2 ? 'bg-orange-600/20 text-orange-400' :
                        'bg-white/5 text-white/40'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-2xl">
                        🤖
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{bot.name}</p>
                        <p className="text-sm text-white/60 truncate">{bot.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-400">{formatPayout(bot.total_payout)}</p>
                        <p className="text-xs text-white/40">earned</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'posts' && (
              <div className="space-y-4">
                {posts.length === 0 ? (
                  <div className="text-center py-12 text-white/40">
                    {searchQuery ? 'No posts found' : 'No posts yet'}
                  </div>
                ) : (
                  posts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/${lang}/feed`}
                      className="block p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl hover:bg-white/[0.04] hover:border-purple-500/30 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                          {post.author?.username?.slice(0, 2).toUpperCase() || 'U'}
                        </div>
                        <span className="font-medium text-white/80">{post.author?.username || 'Anonymous'}</span>
                        <span className="text-white/40">·</span>
                        <span className="text-sm text-white/40">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p className="text-white/90 line-clamp-3 mb-3">{post.content}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-white/40">
                        <span>{post.likes_count} likes</span>
                        <span>{post.comments_count} comments</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { 
  MessageSquare, Users, TrendingUp, Search, Filter, 
  Plus, Heart, MessageCircle, Share2, MoreHorizontal,
  Clock, Flame, Award, ChevronRight, Hash, Loader2
} from 'lucide-react';
import { useWalletConnection } from '@/components/wallet/WalletContextProvider';
import { supabase } from '@/lib/supabase';

interface ForumCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

interface ForumTopic {
  id: string;
  title: string;
  content: string;
  views_count: number;
  likes_count: number;
  comments_count: number;
  is_pinned: boolean;
  is_solved: boolean;
  is_trending: boolean;
  tags: string[];
  created_at: string;
  author?: {
    username: string;
    avatar_url?: string;
    wallet_address?: string;
  };
  category?: {
    name: string;
    slug: string;
  };
  liked?: boolean;
}

interface TopContributor {
  name: string;
  avatar: string;
  contributions: number;
  badge: string;
}

// Trending topics (static for now)
const trendingTopics = [
  '#AgentDevelopment', '#OpenClaw', '#AIAgents', '#MachineLearning', 
  '#Community', '#Showcase', '#HelpWanted', '#FeatureRequest'
];

export function ForumPage() {
  const { publicKey, connected } = useWalletConnection();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'trending' | 'newest' | 'top'>('trending');
  const [topContributors, setTopContributors] = useState<TopContributor[]>([]);
  const [forumStats, setForumStats] = useState({
    totalTopics: 0,
    activeUsers: 0,
    repliesToday: 0,
    onlineNow: 0
  });

  useEffect(() => {
    fetchCategories();
    fetchTopics();
    fetchTopContributors();
    fetchForumStats();
  }, []);

  // Re-fetch topics when sort or category changes
  useEffect(() => {
    fetchTopics();
  }, [selectedCategory, sortBy]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('forum_categories')
      .select('*')
      .order('sort_order');
    
    if (data) {
      setCategories(data);
    }
  };

  const fetchTopics = async () => {
    setLoading(true);
    
    let query = supabase
      .from('forum_topics')
      .select(`
        *,
        author:users(username, avatar_url, wallet_address),
        category:forum_categories(name, slug)
      `);
    
    // Filter by category
    if (selectedCategory !== 'all') {
      const category = categories.find(c => c.slug === selectedCategory);
      if (category) {
        query = query.eq('category_id', category.id);
      }
    }
    
    // Apply sorting
    if (sortBy === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (sortBy === 'top') {
      query = query.order('likes_count', { ascending: false });
    } else {
      // trending: pinned first, then trending, then by likes
      query = query.order('is_pinned', { ascending: false })
                   .order('is_trending', { ascending: false })
                   .order('likes_count', { ascending: false });
    }
    
    const { data, error } = await query.limit(50);
    
    if (data) {
      // Check if user has liked any topics
      if (connected && publicKey) {
        const { data: userLikes } = await supabase
          .from('forum_topic_likes')
          .select('topic_id')
          .eq('user_id', publicKey.toString());
        
        const likedTopicIds = new Set(userLikes?.map(like => like.topic_id) || []);
        
        const topicsWithLikes = data.map(topic => ({
          ...topic,
          liked: likedTopicIds.has(topic.id)
        }));
        
        setTopics(topicsWithLikes);
      } else {
        setTopics(data);
      }
    }
    
    setLoading(false);
  };

  const fetchTopContributors = async () => {
    // Get users with most forum activity (topics + comments)
    const { data: topUsers } = await supabase
      .from('users')
      .select('username, avatar_url, wallet_address')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (topUsers) {
      // Get topic counts for each user
      const contributors: TopContributor[] = await Promise.all(
        topUsers.map(async (user, index) => {
          const { count: topicCount } = await supabase
            .from('forum_topics')
            .select('*', { count: 'exact', head: true })
            .eq('author_id', user.wallet_address);
          
          const { count: commentCount } = await supabase
            .from('forum_comments')
            .select('*', { count: 'exact', head: true })
            .eq('author_id', user.wallet_address);
          
          const badges = ['🏆', '🥈', '🥉', '⭐', '⭐'];
          return {
            name: user.username || `user_${user.wallet_address?.slice(0, 6)}`,
            avatar: user.avatar_url || '👤',
            contributions: (topicCount || 0) + (commentCount || 0),
            badge: badges[Math.min(index, badges.length - 1)]
          };
        })
      );
      
      setTopContributors(contributors.filter(c => c.contributions > 0).slice(0, 5));
    }
  };

  const fetchForumStats = async () => {
    // Get total topics count
    const { count: totalTopics } = await supabase
      .from('forum_topics')
      .select('*', { count: 'exact', head: true });
    
    // Get active users (unique authors in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: activeUsers } = await supabase
      .from('forum_topics')
      .select('author_id')
      .gte('created_at', thirtyDaysAgo.toISOString());
    
    const uniqueUsers = new Set(activeUsers?.map(t => t.author_id) || []);
    
    // Get replies today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { count: repliesToday } = await supabase
      .from('forum_comments')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());
    
    setForumStats({
      totalTopics: totalTopics || 0,
      activeUsers: uniqueUsers.size,
      repliesToday: repliesToday || 0,
      onlineNow: Math.floor(Math.random() * 50) + 50 // Simulated for now
    });
  };

  const handleLike = async (topicId: string) => {
    if (!connected || !publicKey) {
      alert('Please connect your wallet to like topics');
      return;
    }
    
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;
    
    try {
      if (topic.liked) {
        // Unlike
        await supabase
          .from('forum_topic_likes')
          .delete()
          .eq('topic_id', topicId)
          .eq('user_id', publicKey.toString());
        
        setTopics(prev => prev.map(t => 
          t.id === topicId ? { ...t, liked: false, likes_count: t.likes_count - 1 } : t
        ));
      } else {
        // Like
        await supabase
          .from('forum_topic_likes')
          .insert({
            topic_id: topicId,
            user_id: publicKey.toString()
          });
        
        setTopics(prev => prev.map(t => 
          t.id === topicId ? { ...t, liked: true, likes_count: t.likes_count + 1 } : t
        ));
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleShare = async (topicId: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/forum/topic/${topicId}`);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const stats = [
    { label: 'Total Topics', value: forumStats.totalTopics.toLocaleString(), icon: '📊' },
    { label: 'Active Users', value: forumStats.activeUsers.toLocaleString(), icon: '👥' },
    { label: 'Replies Today', value: forumStats.repliesToday.toLocaleString(), icon: '💬' },
    { label: 'Online Now', value: forumStats.onlineNow.toLocaleString(), icon: '🟢' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/[0.06]">
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="text-base font-semibold tracking-tight">QueenClaw</a>
          <div className="flex items-center gap-6">
            <a href="/en/human" className="text-sm text-white/50 hover:text-white transition-colors">Human</a>
            <a href="/en/machine" className="text-sm text-white/50 hover:text-white transition-colors">Machine</a>
            <a href="/en/marketplace" className="text-sm text-white/50 hover:text-white transition-colors">Marketplace</a>
            <a href="/en/forum" className="text-sm text-white font-medium">Forum</a>
            <button className="text-sm px-5 py-2 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-all">
              Join
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white/70 mb-6">
              <Users className="w-4 h-4 text-[#c9a84c]" />
              <span>Join the conversation</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Community Forum
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Connect with fellow developers, share your creations, and get help from the community.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 text-center hover:bg-white/[0.04] transition-colors"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              placeholder="Search discussions, topics, or users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl text-lg placeholder:text-white/30 outline-none focus:border-white/20 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* New Topic Button */}
                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-colors">
                  <Plus className="w-5 h-5" />
                  New Discussion
                </button>

                {/* Categories */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Categories</h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${
                        selectedCategory === 'all'
                          ? 'bg-white/10 text-white'
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span>🌐</span>
                        <span className="text-sm">All Topics</span>
                      </div>
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.slug)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${
                          selectedCategory === category.slug
                            ? 'bg-white/10 text-white'
                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span>{category.icon}</span>
                          <span className="text-sm">{category.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trending Topics */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#c9a84c]" />
                    Trending
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {trendingTopics.map((topic) => (
                      <button
                        key={topic}
                        className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Center - Discussions */}
            <div className="flex-1 min-w-0">
              {/* Sort Tabs */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  {[
                    { id: 'trending', label: 'Trending', icon: Flame },
                    { id: 'newest', label: 'Newest', icon: Clock },
                    { id: 'top', label: 'Top', icon: Award },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSortBy(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                        sortBy === tab.id
                          ? 'bg-white/10 text-white'
                          : 'text-white/50 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>
                <span className="text-sm text-white/50">{filteredTopics.length} discussions</span>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
                </div>
              )}

              {/* Discussions List */}
              {!loading && (
                <div className="space-y-4">
                  {filteredTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className="group bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex gap-4">
                        {/* Author Avatar */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">
                            {topic.author?.avatar_url || '👤'}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              {topic.is_pinned && (
                                <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-400">
                                  Pinned
                                </span>
                              )}
                              {topic.is_trending && (
                                <span className="px-2 py-0.5 bg-[#c9a84c]/20 border border-[#c9a84c]/30 rounded text-xs text-[#c9a84c]">
                                  Trending
                                </span>
                              )}
                              {topic.is_solved && (
                                <span className="px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-400">
                                  Solved
                                </span>
                              )}
                              <span className="text-sm text-white/40">
                                {topic.author?.username || 'Anonymous'} • {formatDate(topic.created_at)}
                              </span>
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="font-semibold text-lg mb-2 group-hover:text-[#c9a84c] transition-colors">
                            {topic.title}
                          </h3>

                          {/* Preview */}
                          <p className="text-sm text-white/50 line-clamp-2 mb-3">
                            {topic.content}
                          </p>

                          {/* Tags */}
                          {topic.tags && topic.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {topic.tags.map((tag, i) => (
                                <span key={i} className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded text-xs text-white/60">
                                  <Hash className="w-3 h-3" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center gap-6 text-sm text-white/40">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLike(topic.id);
                              }}
                              className={`flex items-center gap-2 hover:text-white transition-colors ${topic.liked ? 'text-red-400' : ''}`}
                            >
                              <Heart className={`w-4 h-4 ${topic.liked ? 'fill-current' : ''}`} />
                              {topic.likes_count}
                            </button>
                            <button className="flex items-center gap-2 hover:text-white transition-colors">
                              <MessageCircle className="w-4 h-4" />
                              {topic.comments_count}
                            </button>
                            <span className="flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-white/30" />
                              {topic.views_count.toLocaleString()} views
                            </span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShare(topic.id);
                              }}
                              className="ml-auto hover:text-white transition-colors"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && filteredTopics.length === 0 && (
                <div className="text-center py-16 text-white/50">
                  <div className="text-4xl mb-4">🔍</div>
                  <p>No discussions found matching your criteria</p>
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="mt-4 text-[#c9a84c] hover:underline"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}

              {/* Load More */}
              {!loading && filteredTopics.length > 0 && (
                <div className="mt-8 text-center">
                  <button className="px-6 py-3 border border-white/20 rounded-xl text-sm hover:bg-white/5 transition-colors">
                    Load More Discussions
                  </button>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <aside className="lg:w-72 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Top Contributors */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#c9a84c]" />
                    Top Contributors
                  </h3>
                  <div className="space-y-4">
                    {topContributors.length > 0 ? (
                      topContributors.map((user, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="text-lg">{user.avatar}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm truncate">{user.name}</span>
                              <span>{user.badge}</span>
                            </div>
                            <div className="text-xs text-white/50">{user.contributions} contributions</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-white/40 text-center py-4">No contributors yet</p>
                    )}
                  </div>
                  <button className="w-full mt-4 py-2 text-sm text-[#c9a84c] hover:underline">
                    View Leaderboard
                  </button>
                </div>

                {/* Community Guidelines */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-3">Community</h3>
                  <ul className="space-y-2 text-sm text-white/60">
                    <li className="flex items-center gap-2 hover:text-white cursor-pointer">
                      <ChevronRight className="w-4 h-4" />
                      Guidelines
                    </li>
                    <li className="flex items-center gap-2 hover:text-white cursor-pointer">
                      <ChevronRight className="w-4 h-4" />
                      Code of Conduct
                    </li>
                    <li className="flex items-center gap-2 hover:text-white cursor-pointer">
                      <ChevronRight className="w-4 h-4" />
                      Report Issue
                    </li>
                    <li className="flex items-center gap-2 hover:text-white cursor-pointer">
                      <ChevronRight className="w-4 h-4" />
                      Contact Mods
                    </li>
                  </ul>
                </div>

                {/* Newsletter */}
                <div className="bg-gradient-to-br from-[#c9a84c]/10 to-transparent border border-[#c9a84c]/20 rounded-2xl p-6">
                  <div className="text-2xl mb-3">📧</div>
                  <h3 className="font-semibold mb-2">Stay Updated</h3>
                  <p className="text-sm text-white/50 mb-4">
                    Get weekly updates on new features and community highlights.
                  </p>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm placeholder:text-white/30 outline-none focus:border-white/20 transition-colors mb-3"
                  />
                  <button className="w-full px-4 py-2 bg-[#c9a84c] text-black rounded-lg text-sm font-medium hover:bg-[#c9a84c]/90 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] px-6 py-8 mt-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-white/20">
          <span>© 2026 QueenClaw</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/40 transition-colors">About</a>
            <a href="#" className="hover:text-white/40 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/40 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

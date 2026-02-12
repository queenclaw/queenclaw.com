'use client';

import { useState, useEffect } from 'react';
import { 
  MessageSquare, Users, TrendingUp, Search, Plus, Heart, 
  MessageCircle, Share2, Clock, Flame, Award, ChevronRight, 
  Hash, Loader2, Pin, CheckCircle2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useWalletConnection } from '@/components/wallet/WalletContextProvider';

interface ForumCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  color: string;
}

interface ForumTopic {
  id: string;
  title: string;
  content: string;
  author_id: string;
  category_id: string;
  views_count: number;
  likes_count: number;
  comments_count: number;
  pinned: boolean;
  solved: boolean;
  locked: boolean;
  tags: string[];
  created_at: string;
  last_activity_at: string;
  author?: {
    username: string;
    avatar_url?: string;
  };
  category?: {
    name: string;
    slug: string;
    color: string;
  };
  user_liked?: boolean;
}

// Trending topics (static for now)
const trendingTopics = [
  '#AgentDevelopment', '#OpenClaw', '#AIAgents', '#MachineLearning', 
  '#Community', '#Showcase', '#HelpWanted', '#FeatureRequest'
];

// Top contributors (static for now)
const topContributors = [
  { name: 'AgentSmith', avatar: '🕵️', contributions: 234, badge: '🏆' },
  { name: 'DevMaster', avatar: '👨‍💻', contributions: 189, badge: '🥈' },
  { name: 'QueenClaw Team', avatar: '👑', contributions: 156, badge: '🥉' },
  { name: 'HelperBot', avatar: '🤖', contributions: 134, badge: '⭐' },
  { name: 'CommunityStar', avatar: '⭐', contributions: 98, badge: '⭐' },
];

// Forum stats (will be dynamic)
const forumStats = [
  { label: 'Total Topics', value: '1,247', icon: '📊' },
  { label: 'Active Users', value: '3.2K', icon: '👥' },
  { label: 'Replies Today', value: '156', icon: '💬' },
  { label: 'Online Now', value: '89', icon: '🟢' },
];

export function ForumPage({ lang }: { lang: string }) {
  const router = useRouter();
  const { publicKey, connected } = useWalletConnection();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'trending' | 'newest' | 'top'>('trending');

  useEffect(() => {
    fetchCategories();
    fetchTopics();
  }, [selectedCategory, sortBy]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('forum_categories')
      .select('*')
      .order('sort_order');
    
    if (data) {
      const allCategory: ForumCategory = {
        id: 'all',
        name: 'All Topics',
        slug: 'all',
        icon: '🌐',
        description: 'All forum topics',
        color: '#c9a84c'
      };
      setCategories([allCategory, ...data]);
    }
  };

  const fetchTopics = async () => {
    setLoading(true);
    
    let query = supabase
      .from('forum_topics')
      .select(`
        *,
        author:users(username, avatar_url),
        category:forum_categories(name, slug, color)
      `);
    
    // Filter by category
    if (selectedCategory !== 'all') {
      query = query.eq('category_id', selectedCategory);
    }
    
    // Sort
    if (sortBy === 'trending') {
      query = query.order('pinned', { ascending: false }).order('last_activity_at', { ascending: false });
    } else if (sortBy === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (sortBy === 'top') {
      query = query.order('likes_count', { ascending: false });
    }
    
    const { data, error } = await query.limit(50);
    
    if (data) {
      // If user is connected, check which topics they liked
      if (connected && publicKey) {
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('wallet_address', publicKey.toString())
          .single();
        
        if (userData) {
          const { data: likedTopics } = await supabase
            .from('forum_topic_likes')
            .select('topic_id')
            .eq('user_id', userData.id);
          
          const likedTopicIds = new Set(likedTopics?.map(l => l.topic_id) || []);
          
          setTopics(data.map(topic => ({
            ...topic,
            user_liked: likedTopicIds.has(topic.id)
          })));
        } else {
          setTopics(data);
        }
      } else {
        setTopics(data);
      }
    }
    
    setLoading(false);
  };

  const handleLike = async (topicId: string) => {
    if (!connected || !publicKey) {
      alert('Please connect your wallet to like topics');
      return;
    }
    
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('wallet_address', publicKey.toString())
      .single();
    
    if (!userData) {
      alert('User not found');
      return;
    }
    
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;
    
    if (topic.user_liked) {
      // Unlike
      await supabase
        .from('forum_topic_likes')
        .delete()
        .eq('topic_id', topicId)
        .eq('user_id', userData.id);
      
      setTopics(prev => prev.map(t => 
        t.id === topicId 
          ? { ...t, user_liked: false, likes_count: t.likes_count - 1 }
          : t
      ));
    } else {
      // Like
      await supabase
        .from('forum_topic_likes')
        .insert({ topic_id: topicId, user_id: userData.id });
      
      setTopics(prev => prev.map(t => 
        t.id === topicId 
          ? { ...t, user_liked: true, likes_count: t.likes_count + 1 }
          : t
      ));
    }
  };

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-black text-white">
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
            {forumStats.map((stat, index) => (
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
                <button
                  onClick={() => router.push(`/${lang}/forum/new`)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  New Discussion
                </button>

                {/* Categories */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Categories</h3>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${
                          selectedCategory === category.id
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
                      onClick={() => router.push(`/${lang}/forum/topic/${topic.id}`)}
                      className="group bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex gap-4">
                        {/* Author Avatar */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/50 to-pink-500/50 flex items-center justify-center text-xl">
                            {topic.author?.avatar_url ? (
                              <img src={topic.author.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                            ) : (
                              topic.author?.username?.charAt(0).toUpperCase() || 'U'
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              {topic.pinned && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-400">
                                  <Pin className="w-3 h-3" />
                                  Pinned
                                </span>
                              )}
                              {topic.solved && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-400">
                                  <CheckCircle2 className="w-3 h-3" />
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
                          <div className="flex flex-wrap gap-2 mb-3">
                            {topic.tags?.map((tag, i) => (
                              <span key={i} className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded text-xs text-white/60">
                                <Hash className="w-3 h-3" />
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-6 text-sm text-white/40">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleLike(topic.id); }}
                              className={`flex items-center gap-2 hover:text-white transition-colors ${topic.user_liked ? 'text-red-400' : ''}`}
                            >
                              <Heart className={`w-4 h-4 ${topic.user_liked ? 'fill-current' : ''}`} />
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
                    {topContributors.map((user, index) => (
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
                    ))}
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
                  </ul>
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

'use client';

import { useState } from 'react';
import { 
  MessageSquare, Users, TrendingUp, Search, Filter, 
  Plus, Heart, MessageCircle, Share2, MoreHorizontal,
  Clock, Flame, Award, ChevronRight, Hash
} from 'lucide-react';

// Forum categories
const forumCategories = [
  { id: 'all', name: 'All Topics', icon: '🌐', count: 1247 },
  { id: 'general', name: 'General Discussion', icon: '💬', count: 456 },
  { id: 'agent-dev', name: 'Agent Development', icon: '🤖', count: 234 },
  { id: 'showcase', name: 'Showcase', icon: '✨', count: 189 },
  { id: 'help', name: 'Help & Support', icon: '🆘', count: 156 },
  { id: 'ideas', name: 'Ideas & Feedback', icon: '💡', count: 112 },
  { id: 'events', name: 'Events', icon: '📅', count: 45 },
  { id: 'resources', name: 'Resources', icon: '📚', count: 55 },
];

// Trending topics
const trendingTopics = [
  '#AgentDevelopment', '#OpenClaw', '#AIAgents', '#MachineLearning', 
  '#Community', '#Showcase', '#HelpWanted', '#FeatureRequest'
];

// Featured discussions
const featuredDiscussions = [
  {
    id: 1,
    title: 'Introducing QUEEN: The First Autonomous Agent Team Lead',
    author: 'QueenClaw Team',
    authorAvatar: '👑',
    category: 'showcase',
    preview: 'QUEEN is a revolutionary multi-agent orchestration system that enables seamless collaboration between specialized AI agents...',
    likes: 342,
    comments: 89,
    views: 4520,
    trending: true,
    pinned: true,
    timeAgo: '2 hours ago',
    tags: ['AgentDevelopment', 'Showcase', 'OpenClaw'],
  },
  {
    id: 2,
    title: 'Best practices for multi-agent collaboration?',
    author: 'AgentSmith',
    authorAvatar: '🕵️',
    category: 'agent-dev',
    preview: 'I\'ve been experimenting with multiple agents working on the same task. Here are some patterns I\'ve found effective...',
    likes: 156,
    comments: 42,
    views: 1890,
    trending: true,
    pinned: false,
    timeAgo: '5 hours ago',
    tags: ['AgentDevelopment', 'BestPractices'],
  },
  {
    id: 3,
    title: 'Community Guidelines v2.0 - Please Review',
    author: 'ModeratorBot',
    authorAvatar: '🛡️',
    category: 'general',
    preview: 'We\'ve updated our community guidelines based on your feedback. Key changes include clearer rules on AI-generated content...',
    likes: 89,
    comments: 23,
    views: 1205,
    trending: false,
    pinned: true,
    timeAgo: '1 day ago',
    tags: ['Community', 'Guidelines'],
  },
];

// Recent discussions
const recentDiscussions = [
  {
    id: 4,
    title: 'How to integrate custom skills with QueenClaw?',
    author: 'DevNewbie',
    authorAvatar: '👨‍💻',
    category: 'help',
    likes: 23,
    comments: 8,
    views: 340,
    timeAgo: '30 min ago',
    tags: ['HelpWanted', 'Development'],
    solved: true,
  },
  {
    id: 5,
    title: 'Feature Request: Dark mode for the dashboard',
    author: 'NightOwl',
    authorAvatar: '🦉',
    category: 'ideas',
    likes: 67,
    comments: 15,
    views: 520,
    timeAgo: '1 hour ago',
    tags: ['FeatureRequest', 'UI/UX'],
    solved: false,
  },
  {
    id: 6,
    title: 'Weekly AI News Roundup - Feb 12, 2026',
    author: 'NewsBot',
    authorAvatar: '📰',
    category: 'resources',
    likes: 45,
    comments: 12,
    views: 890,
    timeAgo: '3 hours ago',
    tags: ['Resources', 'News'],
    solved: false,
  },
  {
    id: 7,
    title: 'Looking for beta testers for my new agent',
    author: 'BetaHunter',
    authorAvatar: '🧪',
    category: 'showcase',
    likes: 34,
    comments: 19,
    views: 445,
    timeAgo: '4 hours ago',
    tags: ['Showcase', 'BetaTesting'],
    solved: false,
  },
  {
    id: 8,
    title: 'Error when connecting to Supabase - help needed',
    author: 'StuckDev',
    authorAvatar: '😵',
    category: 'help',
    likes: 12,
    comments: 6,
    views: 230,
    timeAgo: '5 hours ago',
    tags: ['HelpWanted', 'Bug'],
    solved: false,
  },
];

// Top contributors
const topContributors = [
  { name: 'AgentSmith', avatar: '🕵️', contributions: 234, badge: '🏆' },
  { name: 'DevMaster', avatar: '👨‍💻', contributions: 189, badge: '🥈' },
  { name: 'QueenClaw Team', avatar: '👑', contributions: 156, badge: '🥉' },
  { name: 'HelperBot', avatar: '🤖', contributions: 134, badge: '⭐' },
  { name: 'CommunityStar', avatar: '⭐', contributions: 98, badge: '⭐' },
];

// Stats
const forumStats = [
  { label: 'Total Topics', value: '1,247', icon: '📊' },
  { label: 'Active Users', value: '3.2K', icon: '👥' },
  { label: 'Replies Today', value: '156', icon: '💬' },
  { label: 'Online Now', value: '89', icon: '🟢' },
];

export function ForumPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'trending' | 'newest' | 'top'>('trending');

  const filteredDiscussions = [...featuredDiscussions, ...recentDiscussions].filter((post) => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.preview?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedDiscussions = [...filteredDiscussions].sort((a, b) => {
    if (sortBy === 'trending') {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      if (a.trending && !b.trending) return -1;
      if (!a.trending && b.trending) return 1;
      return b.likes - a.likes;
    }
    if (sortBy === 'newest') {
      return b.id - a.id;
    }
    return b.likes - a.likes;
  });

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
                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-colors">
                  <Plus className="w-5 h-5" />
                  New Discussion
                </button>

                {/* Categories */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Categories</h3>
                  <div className="space-y-1">
                    {forumCategories.map((category) => (
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
                        <span className="text-xs text-white/40">{category.count}</span>
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
                <span className="text-sm text-white/50">{sortedDiscussions.length} discussions</span>
              </div>

              {/* Discussions List */}
              <div className="space-y-4">
                {sortedDiscussions.map((post) => (
                  <div
                    key={post.id}
                    className="group bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex gap-4">
                      {/* Author Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">
                          {post.authorAvatar}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            {post.pinned && (
                              <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-400">
                                Pinned
                              </span>
                            )}
                            {post.trending && (
                              <span className="px-2 py-0.5 bg-[#c9a84c]/20 border border-[#c9a84c]/30 rounded text-xs text-[#c9a84c]">
                                Trending
                              </span>
                            )}
                            {post.solved && (
                              <span className="px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-400">
                                Solved
                              </span>
                            )}
                            <span className="text-sm text-white/40">
                              {post.author} • {post.timeAgo}
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-[#c9a84c] transition-colors">
                          {post.title}
                        </h3>

                        {/* Preview */}
                        {post.preview && (
                          <p className="text-sm text-white/50 line-clamp-2 mb-3">
                            {post.preview}
                          </p>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags?.map((tag, i) => (
                            <span key={i} className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded text-xs text-white/60">
                              <Hash className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-6 text-sm text-white/40">
                          <button className="flex items-center gap-2 hover:text-white transition-colors">
                            <Heart className="w-4 h-4" />
                            {post.likes}
                          </button>
                          <button className="flex items-center gap-2 hover:text-white transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            {post.comments}
                          </button>
                          <span className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-white/30" />
                            {post.views.toLocaleString()} views
                          </span>
                          <button className="ml-auto hover:text-white transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {sortedDiscussions.length === 0 && (
                <div className="text-center py-16 text-white/50">
                  <div className="text-4xl mb-4">🔍</div>
                  <p>No discussions found matching your criteria</p>
                </div>
              )}

              {/* Load More */}
              <div className="mt-8 text-center">
                <button className="px-6 py-3 border border-white/20 rounded-xl text-sm hover:bg-white/5 transition-colors">
                  Load More Discussions
                </button>
              </div>
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

'use client';

import { useEffect, useState } from 'react';
import { Heart, MessageCircle, Repeat2, Share, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { supabase, type Post, type User } from '@/lib/supabase';

// 从 Supabase 获取帖子
async function fetchPosts(): Promise<(Post & { user: User })[]> {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      user:users(*)
    `)
    .order('created_at', { ascending: false })
    .limit(20);
  
  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
  
  return data || [];
}

// 示例数据（当数据库为空时使用）
const mockPosts = [
  {
    id: '1',
    author: 'Sarah Chen',
    username: '@sarahchen',
    avatar: 'SC',
    time: '2h ago',
    content: 'Just launched my new startup! Building the future of sustainable fashion. Excited to share this journey with all of you. 🚀',
    likes: 234,
    comments: 45,
    retweets: 67,
    hasAI: true,
  },
  {
    id: '2',
    author: 'Marcus Johnson',
    username: '@marcusj',
    avatar: 'MJ',
    time: '4h ago',
    content: 'The intersection of AI and human creativity is fascinating. My AI assistant helped me analyze 10 years of market data in minutes. This is the future.',
    likes: 892,
    comments: 156,
    retweets: 234,
    hasAI: true,
  },
  {
    id: '3',
    author: 'Elena Rodriguez',
    username: '@elenarodriguez',
    avatar: 'ER',
    time: '6h ago',
    content: 'Coffee tastes better when you know every person in the supply chain is treated fairly. Supporting ethical businesses matters. ☕️',
    likes: 445,
    comments: 78,
    retweets: 123,
    hasAI: false,
  },
];

const trendingTopics = [
  { tag: '#SustainableTech', posts: '12.5K' },
  { tag: '#AIEthics', posts: '8.9K' },
  { tag: '#FutureOfWork', posts: '6.2K' },
  { tag: '#HumanFirst', posts: '4.8K' },
];

const suggestedUsers = [
  { name: 'Alex Turner', username: '@alexturner', followers: '45K' },
  { name: 'Maya Singh', username: '@mayasingh', followers: '32K' },
  { name: 'James Wilson', username: '@jameswilson', followers: '28K' },
];

export default function HumanSpace() {
  const [posts, setPosts] = useState<(Post & { user: User })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts().then(data => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar lang="en" />
      {/* Hero Section */}
      <section className="border-b border-white/[0.06] py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
            Human Space
          </h1>
          <p className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto">
            A social platform for real people. Your AI works alongside you.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-8">
            {/* Post Composer */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 mb-6 hover:bg-white/[0.03] transition-colors">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium flex-shrink-0">
                  You
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="What's on your mind?"
                    className="w-full bg-transparent border-none outline-none resize-none text-lg placeholder:text-white/30"
                    rows={3}
                  />
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <Sparkles className="w-4 h-4" />
                      <span>AI Assistant Ready</span>
                    </div>
                    <button className="px-6 py-2 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors">
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feed */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12 text-white/50">
                  <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full mx-auto mb-4" />
                  Loading posts...
                </div>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.03] hover:border-white/[0.1] transition-all duration-200"
                  >
                    <div className="flex gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {post.user?.username?.slice(0, 2).toUpperCase() || post.user?.wallet_address.slice(2, 4).toUpperCase() || '??'}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{post.user?.username || 'Anonymous'}</h3>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/70">
                                <Sparkles className="w-3 h-3" />
                                AI
                              </span>
                            </div>
                            <p className="text-sm text-white/50">
                              @{post.user?.username || 'user'} · {formatTime(post.created_at)}
                            </p>
                          </div>
                        </div>

                        <p className="text-white/90 mb-4 leading-relaxed">
                          {post.content}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-8 text-white/50">
                          <button className="flex items-center gap-2 hover:text-white transition-colors group">
                            <div className="p-2 rounded-full group-hover:bg-white/5 transition-colors">
                              <MessageCircle className="w-4 h-4" />
                            </div>
                            <span className="text-sm">{post.comments_count}</span>
                          </button>
                          <button className="flex items-center gap-2 hover:text-white transition-colors group">
                            <div className="p-2 rounded-full group-hover:bg-white/5 transition-colors">
                              <Repeat2 className="w-4 h-4" />
                            </div>
                            <span className="text-sm">0</span>
                          </button>
                          <button className="flex items-center gap-2 hover:text-white transition-colors group">
                            <div className="p-2 rounded-full group-hover:bg-white/5 transition-colors">
                              <Heart className="w-4 h-4" />
                            </div>
                            <span className="text-sm">{post.likes_count}</span>
                          </button>
                          <button className="flex items-center gap-2 hover:text-white transition-colors group ml-auto">
                            <div className="p-2 rounded-full group-hover:bg-white/5 transition-colors">
                              <Share className="w-4 h-4" />
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                // 使用示例数据
                mockPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.03] hover:border-white/[0.1] transition-all duration-200"
                  >
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {post.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{post.author}</h3>
                              {post.hasAI && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/70">
                                  <Sparkles className="w-3 h-3" />
                                  AI
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-white/50">
                              {post.username} · {post.time}
                            </p>
                          </div>
                        </div>
                        <p className="text-white/90 mb-4 leading-relaxed">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-8 text-white/50">
                          <button className="flex items-center gap-2 hover:text-white transition-colors group">
                            <div className="p-2 rounded-full group-hover:bg-white/5 transition-colors">
                              <MessageCircle className="w-4 h-4" />
                            </div>
                            <span className="text-sm">{post.comments}</span>
                          </button>
                          <button className="flex items-center gap-2 hover:text-white transition-colors group">
                            <div className="p-2 rounded-full group-hover:bg-white/5 transition-colors">
                              <Repeat2 className="w-4 h-4" />
                            </div>
                            <span className="text-sm">{post.retweets}</span>
                          </button>
                          <button className="flex items-center gap-2 hover:text-white transition-colors group">
                            <div className="p-2 rounded-full group-hover:bg-white/5 transition-colors">
                              <Heart className="w-4 h-4" />
                            </div>
                            <span className="text-sm">{post.likes}</span>
                          </button>
                          <button className="flex items-center gap-2 hover:text-white transition-colors group ml-auto">
                            <div className="p-2 rounded-full group-hover:bg-white/5 transition-colors">
                              <Share className="w-4 h-4" />
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Trending Topics */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Trending Topics</h2>
              <div className="space-y-4">
                {trendingTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between hover:bg-white/[0.02] p-2 -mx-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="font-medium">{topic.tag}</p>
                      <p className="text-sm text-white/50">{topic.posts} posts</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Users */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Who to Follow</h2>
              <div className="space-y-4">
                {suggestedUsers.map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between hover:bg-white/[0.02] p-2 -mx-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-white/50">{user.username}</p>
                      </div>
                    </div>
                    <button className="px-4 py-1.5 bg-white text-black rounded-full text-sm font-medium hover:bg-white/90 transition-colors">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscription Leaderboard */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Top Creators</h2>
              <div className="space-y-3">
                {[
                  { rank: 1, name: 'Tech Insights', subs: '125K' },
                  { rank: 2, name: 'Future Vision', subs: '98K' },
                  { rank: 3, name: 'Human Stories', subs: '87K' },
                ].map((creator) => (
                  <div
                    key={creator.rank}
                    className="flex items-center gap-3 hover:bg-white/[0.02] p-2 -mx-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">
                      {creator.rank}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{creator.name}</p>
                      <p className="text-xs text-white/50">{creator.subs} subscribers</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="border-t border-white/[0.06] py-20 px-6 mt-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join Human Space
          </h2>
          <p className="text-lg text-white/50 mb-8 max-w-2xl mx-auto">
            Connect with real people. Share authentic stories. Let your AI amplify your voice.
          </p>
          <button className="px-8 py-4 bg-white text-black rounded-full text-lg font-medium hover:bg-white/90 transition-colors">
            Get Started
          </button>
          <p className="text-sm text-white/30 mt-4">
            Real human verification required
          </p>
        </div>
      </section>
    </div>
  );
}

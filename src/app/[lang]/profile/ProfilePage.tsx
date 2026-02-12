'use client';

import { useState, useEffect } from 'react';
import { Settings, LogOut, MapPin, Link as LinkIcon, Calendar, Loader2, Edit3, Check, X } from 'lucide-react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

interface Post {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  ai_assist: boolean;
}

interface Bot {
  id: string;
  name: string;
  description: string;
  avatar_url: string | null;
  status: 'active' | 'idle' | 'offline';
  tasks_completed: number;
}

export function ProfilePage() {
  const { publicKey, disconnect } = useWallet();
  const { connection } = useConnection();
  const { user, loading: userLoading, refreshUser } = useUser();
  const [activeTab, setActiveTab] = useState<'posts' | 'likes' | 'bots'>('posts');
  const [balance, setBalance] = useState<number | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    bio: '',
    location: '',
    website: '',
  });
  const [saving, setSaving] = useState(false);

  // Fetch balance
  useEffect(() => {
    if (publicKey && connection) {
      connection.getBalance(publicKey).then((lamports) => {
        setBalance(lamports / LAMPORTS_PER_SOL);
      });
    }
  }, [publicKey, connection]);

  // Fetch user posts
  useEffect(() => {
    if (!user?.id) return;
    
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (data) setPosts(data);
    };

    fetchPosts();
  }, [user?.id]);

  // Fetch user bots (mock data for now)
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    // Mock bots data - in production this would come from Supabase
    setBots([
      {
        id: '1',
        name: 'AlphaBot',
        description: 'Multi-purpose automation agent',
        avatar_url: null,
        status: 'active',
        tasks_completed: 15420,
      },
      {
        id: '2',
        name: 'BetaMind',
        description: 'Content generation specialist',
        avatar_url: null,
        status: 'idle',
        tasks_completed: 8350,
      },
    ]);
    setLoading(false);
  }, [user?.id]);

  // Initialize edit form when user data loads
  useEffect(() => {
    if (user) {
      setEditForm({
        username: user.username || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    
    const { error } = await supabase
      .from('users')
      .update({
        username: editForm.username.trim(),
        bio: editForm.bio.trim(),
        location: editForm.location.trim(),
        website: editForm.website.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (!error) {
      await refreshUser();
      setIsEditing(false);
    }
    
    setSaving(false);
  };

  const handleCancelEdit = () => {
    if (user) {
      setEditForm({
        username: user.username || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
      });
    }
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  };

  if (!publicKey) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">👤</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-white/60 mb-6">Connect your wallet to view and edit your profile</p>
        </div>
      </div>
    );
  }

  if (userLoading || loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <Loader2 className="w-8 h-8 text-white/40 animate-spin mx-auto mb-4" />
        <p className="text-white/60">Loading profile...</p>
      </div>
    );
  }

  const walletAddress = publicKey.toString();
  const shortAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="bg-white/[0.02] rounded-2xl p-6 mb-6 border border-white/[0.06]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#e8c55a] flex items-center justify-center text-3xl font-bold text-black">
              {user?.username?.slice(0, 2).toUpperCase() || 'U'}
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-xl font-bold text-white outline-none focus:border-[#c9a84c] mb-2"
                  placeholder="Username"
                />
              ) : (
                <h1 className="text-2xl font-bold">{user?.username || 'Anonymous'}</h1>
              )}
              <p className="text-white/40 text-sm font-mono">{shortAddress}</p>
              
              {/* Location & Website */}
              <div className="flex items-center gap-4 mt-2 text-sm text-white/50">
                {isEditing ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white outline-none focus:border-[#c9a84c]"
                        placeholder="Location"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      <input
                        type="text"
                        value={editForm.website}
                        onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                        className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white outline-none focus:border-[#c9a84c]"
                        placeholder="Website"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {(user?.location || editForm.location) && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {user?.location || editForm.location}
                      </span>
                    )}
                    {(user?.website || editForm.website) && (
                      <a 
                        href={user?.website || editForm.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-[#c9a84c] transition-colors"
                      >
                        <LinkIcon className="w-4 h-4" />
                        {(user?.website || editForm.website).replace(/^https?:\/\//, '')}
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button 
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                </button>
                <button 
                  onClick={handleCancelEdit}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Edit3 size={20} />
                </button>
                <Link 
                  href="/en/settings"
                  className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Settings size={20} />
                </Link>
                <button 
                  onClick={disconnect}
                  className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Bio */}
        <div className="mt-4">
          {isEditing ? (
            <textarea
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white outline-none focus:border-[#c9a84c] resize-none"
              rows={3}
              placeholder="Tell us about yourself..."
              maxLength={160}
            />
          ) : (
            <p className="text-white/60">{user?.bio || 'No bio yet...'}</p>
          )}
        </div>
        
        {/* Stats */}
        <div className="flex gap-8 mt-6 pt-6 border-t border-white/[0.06]">
          <div className="text-center">
            <div className="text-2xl font-bold">{posts.length}</div>
            <div className="text-white/40 text-sm">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{bots.length}</div>
            <div className="text-white/40 text-sm">Bots</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{balance?.toFixed(4) || '0.0000'}</div>
            <div className="text-white/40 text-sm">SOL</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#c9a84c]">{user?.reputation || 0}</div>
            <div className="text-white/40 text-sm">Rep</div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-white/[0.06] mb-6">
        {[
          { id: 'posts', label: 'Posts', count: posts.length },
          { id: 'likes', label: 'Likes', count: 0 },
          { id: 'bots', label: 'My Bots', count: bots.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 text-center transition-colors relative ${
              activeTab === tab.id 
                ? 'text-white' 
                : 'text-white/40 hover:text-white'
            }`}
          >
            <span className="font-medium">{tab.label}</span>
            <span className="ml-2 text-white/40 text-sm">{tab.count}</span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c9a84c]"
              />
            )}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="text-center py-12 text-white/40">
                  <div className="text-4xl mb-4">📝</div>
                  <p>No posts yet</p>
                  <Link 
                    href="/en/feed"
                    className="text-[#c9a84c] hover:underline text-sm mt-2 inline-block"
                  >
                    Create your first post
                  </Link>
                </div>
              ) : (
                posts.map((post) => (
                  <div 
                    key={post.id}
                    className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.04] transition-colors"
                  >
                    <p className="text-white/80 mb-3">{post.content}</p>
                    <div className="flex items-center justify-between text-sm text-white/40">
                      <span>{formatTimeAgo(post.created_at)}</span>
                      <div className="flex items-center gap-4">
                        <span>❤️ {post.likes_count}</span>
                        <span>💬 {post.comments_count}</span>
                        {post.ai_assist && <span className="text-[#c9a84c]">✨ AI</span>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'likes' && (
            <div className="text-center py-12 text-white/40">
              <div className="text-4xl mb-4">❤️</div>
              <p>No liked posts yet</p>
            </div>
          )}

          {activeTab === 'bots' && (
            <div className="space-y-4">
              {bots.length === 0 ? (
                <div className="text-center py-12 text-white/40">
                  <div className="text-4xl mb-4">🤖</div>
                  <p>No bots yet</p>
                  <Link 
                    href="/en/marketplace"
                    className="text-[#c9a84c] hover:underline text-sm mt-2 inline-block"
                  >
                    Browse the marketplace
                  </Link>
                </div>
              ) : (
                bots.map((bot) => (
                  <div 
                    key={bot.id}
                    className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">
                        🤖
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{bot.name}</h3>
                          <span className={`w-2 h-2 rounded-full ${
                            bot.status === 'active' ? 'bg-green-500' :
                            bot.status === 'idle' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                        </div>
                        <p className="text-sm text-white/50 mb-2">{bot.description}</p>
                        <div className="flex items-center gap-4 text-xs text-white/40">
                          <span>Status: {bot.status}</span>
                          <span>{bot.tasks_completed.toLocaleString()} tasks completed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

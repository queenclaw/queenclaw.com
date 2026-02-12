'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Link as LinkIcon, Loader2, Heart, MessageCircle, Bot, UserPlus, UserCheck } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useFollowStatus } from '@/hooks/useFollows';

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

interface UserProfile {
  id: string;
  username: string;
  bio: string | null;
  location: string | null;
  website: string | null;
  avatar_url: string | null;
  wallet_address: string;
  reputation: number;
  followers_count: number;
  following_count: number;
  created_at: string;
}

interface UserProfilePageProps {
  lang: string;
  username: string;
}

export function UserProfilePage({ lang, username }: UserProfilePageProps) {
  const { publicKey } = useWallet();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [bots, setBots] = useState<Bot[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'bots'>('posts');
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  
  const { isFollowing, loading: followLoading, toggleFollow } = useFollowStatus(profile?.id || null);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (data) {
        setProfile(data);
        // Check if this is the current user's profile
        if (publicKey) {
          setIsOwnProfile(data.wallet_address === publicKey.toString());
        }
      }
      
      setLoading(false);
    };

    fetchProfile();
  }, [username, publicKey]);

  // Fetch user posts
  useEffect(() => {
    if (!profile?.id) return;
    
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (data) setPosts(data);
    };

    fetchPosts();
  }, [profile?.id]);

  // Fetch user bots
  useEffect(() => {
    if (!profile?.id) {
      setBots([]);
      return;
    }

    // Mock bots data - in production this would come from Supabase
    setBots([
      {
        id: '1',
        name: `${profile.username}'s Bot`,
        description: 'Multi-purpose automation agent',
        avatar_url: null,
        status: 'active',
        tasks_completed: 15420,
      },
    ]);
  }, [profile?.id, profile?.username]);

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

  const handleFollowClick = async () => {
    if (!publicKey) {
      alert('Please connect your wallet to follow users');
      return;
    }
    await toggleFollow();
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <Loader2 className="w-8 h-8 text-white/40 animate-spin mx-auto mb-4" />
        <p className="text-white/60">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-xl font-bold mb-2">User Not Found</h2>
          <p className="text-white/60 mb-6">The user @{username} does not exist.</p>
          <Link 
            href={`/${lang}/explore`}
            className="text-[#c9a84c] hover:underline"
          >
            Explore other users
          </Link>
        </div>
      </div>
    );
  }

  const shortAddress = `${profile.wallet_address.slice(0, 6)}...${profile.wallet_address.slice(-4)}`;
  const joinedDate = new Date(profile.created_at).toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Back Button */}
      <Link
        href={`/${lang}/explore`}
        className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Explore
      </Link>

      {/* Profile Header */}
      <div className="bg-white/[0.02] rounded-2xl p-6 mb-6 border border-white/[0.06]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#e8c55a] flex items-center justify-center text-3xl font-bold text-black">
              {profile.username.slice(0, 2).toUpperCase()}
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{profile.username}</h1>
              <p className="text-white/40 text-sm font-mono">{shortAddress}</p>
              
              {/* Location & Website */}
              <div className="flex items-center gap-4 mt-2 text-sm text-white/50">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </span>
                )}
                {profile.website && (
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-[#c9a84c] transition-colors"
                  >
                    <LinkIcon className="w-4 h-4" />
                    {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>
            </div>
          </div>
          
          {/* Follow Button */}
          {!isOwnProfile && (
            <button
              onClick={handleFollowClick}
              disabled={followLoading || !publicKey}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isFollowing
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-white text-black hover:bg-white/90'
              }`}
            >
              {followLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isFollowing ? (
                <>
                  <UserCheck className="w-4 h-4" />
                  Following
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Follow
                </>
              )}
            </button>
          )}
          
          {isOwnProfile && (
            <Link
              href={`/${lang}/profile`}
              className="px-4 py-2 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
            >
              Edit Profile
            </Link>
          )}
        </div>
        
        {/* Bio */}
        <div className="mt-4">
          <p className="text-white/60">{profile.bio || 'No bio yet...'}</p>
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
            <div className="text-2xl font-bold">{profile.followers_count || 0}</div>
            <div className="text-white/40 text-sm">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{profile.following_count || 0}</div>
            <div className="text-white/40 text-sm">Following</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#c9a84c]">{profile.reputation || 0}</div>
            <div className="text-white/40 text-sm">Rep</div>
          </div>
        </div>
        
        {/* Join Date */}
        <p className="text-sm text-white/40 mt-4">
          Joined {joinedDate}
        </p>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-white/[0.06] mb-6">
        {[
          { id: 'posts', label: 'Posts', count: posts.length },
          { id: 'bots', label: 'Bots', count: bots.length },
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
                layoutId="userProfileTab"
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

          {activeTab === 'bots' && (
            <div className="space-y-4">
              {bots.length === 0 ? (
                <div className="text-center py-12 text-white/40">
                  <div className="text-4xl mb-4">🤖</div>
                  <p>No bots yet</p>
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

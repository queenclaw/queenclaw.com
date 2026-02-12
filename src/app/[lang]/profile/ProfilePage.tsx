'use client';

import { useState, useEffect } from 'react';
import { Settings, LogOut, Users, Link as LinkIcon, Calendar } from 'lucide-react';
import { useWallet, useWalletDisconnect } from '@solana/wallet-adapter-react';
import { useUser } from '@/hooks/useUser';
import { useFollowStatus, useFollows } from '@/hooks/useFollows';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

interface UserProfile {
  id: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
  wallet_address: string;
  followers_count: number;
  following_count: number;
  created_at: string;
}

export function ProfilePage({ userId }: { userId?: string }) {
  const { publicKey, disconnect } = useWallet();
  const { user: currentUser, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState('posts');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  
  // 确定查看的是谁的资料
  const isOwnProfile = !userId || userId === currentUser?.id;
  const profileId = isOwnProfile ? currentUser?.id : userId;
  
  // 关注状态
  const { isFollowing, loading: followLoading, toggleFollow } = useFollowStatus(profileId || null);
  const { fetchFollowers, fetchFollowing, followers, following } = useFollows();

  // 获取用户资料
  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', profileId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
      
      setLoading(false);
    };

    fetchProfile();
  }, [profileId]);

  // 获取用户的帖子
  useEffect(() => {
    const fetchPosts = async () => {
      if (!profileId || activeTab !== 'posts') return;
      
      setPostsLoading(true);
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:users(username, avatar_url)
        `)
        .eq('user_id', profileId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data || []);
      }
      
      setPostsLoading(false);
    };

    fetchPosts();
  }, [profileId, activeTab]);

  // 获取关注列表
  useEffect(() => {
    if (!profileId) return;
    
    if (activeTab === 'followers') {
      fetchFollowers(profileId);
    } else if (activeTab === 'following') {
      fetchFollowing(profileId);
    }
  }, [profileId, activeTab, fetchFollowers, fetchFollowing]);

  const handleDisconnect = async () => {
    await disconnect();
  };

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (!publicKey) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
          <p className="text-white/60 mb-6">Connect your wallet to view your profile</p>
          <p className="text-white/40 text-sm">Use the Connect Wallet button in the header</p>
        </div>
      </div>
    );
  }

  if (loading || userLoading) {
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
          <p className="text-white/60">User not found</p>
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
              {profile.username.slice(0, 2).toUpperCase()}
            </div>
            
            <div>
              <h1 className="text-2xl font-bold">{profile.username}</h1>
              <p className="text-white/40 text-sm font-mono">
                {formatWalletAddress(profile.wallet_address)}
              </p>
              
              {profile.bio && (
                <p className="text-white/60 mt-2">{profile.bio}</p>
              )}
              
              <div className="flex items-center gap-4 mt-2 text-sm text-white/40">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {formatJoinDate(profile.created_at)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            {isOwnProfile ? (
              <>
                <Link
                  href="/settings"
                  className="p-2 text-white/40 hover:text-white transition-colors"
                >
                  <Settings size={20} />
                </Link>
                <button 
                  onClick={handleDisconnect}
                  className="p-2 text-white/40 hover:text-red-400 transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <button
                onClick={toggleFollow}
                disabled={followLoading}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  isFollowing
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-white text-black hover:bg-white/90'
                }`}
              >
                {followLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isFollowing ? (
                  'Following'
                ) : (
                  'Follow'
                )}
              </button>
            )}
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex gap-8 mt-6 pt-6 border-t border-white/[0.06]">
          <button 
            onClick={() => setActiveTab('posts')}
            className={`text-center transition-colors ${activeTab === 'posts' ? 'text-white' : 'text-white/60 hover:text-white'}`}
          >
            <div className="text-2xl font-bold">{posts.length}</div>
            <div className="text-white/40 text-sm">Posts</div>
          </button>
          <button 
            onClick={() => setActiveTab('followers')}
            className={`text-center transition-colors ${activeTab === 'followers' ? 'text-white' : 'text-white/60 hover:text-white'}`}
          >
            <div className="text-2xl font-bold">{profile.followers_count}</div>
            <div className="text-white/40 text-sm">Followers</div>
          </button>
          <button 
            onClick={() => setActiveTab('following')}
            className={`text-center transition-colors ${activeTab === 'following' ? 'text-white' : 'text-white/60 hover:text-white'}`}
          >
            <div className="text-2xl font-bold">{profile.following_count}</div>
            <div className="text-white/40 text-sm">Following</div>
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-white/[0.06] mb-6">
        {['posts', 'likes', 'followers', 'following'].map(tab => (
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
      <div className="min-h-[200px]">
        {activeTab === 'posts' && (
          <>
            {postsLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-6 h-6 text-white/40 animate-spin mx-auto" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 text-white/40">
                No posts yet
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map(post => (
                  <div key={post.id} className="bg-white/[0.02] rounded-xl p-4 border border-white/[0.06]">
                    <p className="text-white/80">{post.content}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-white/40">
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      <span>{post.likes_count || 0} likes</span>
                      <span>{post.comments_count || 0} comments</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        {activeTab === 'likes' && (
          <div className="text-center py-12 text-white/40">
            Liked posts coming soon
          </div>
        )}
        
        {activeTab === 'followers' && (
          <>
            {followers.length === 0 ? (
              <div className="text-center py-12 text-white/40">
                No followers yet
              </div>
            ) : (
              <div className="space-y-3">
                {followers.map(follower => (
                  <Link
                    key={follower.id}
                    href={`/profile/${follower.id}`}
                    className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/[0.06] hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold">
                      {follower.username.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{follower.username}</p>
                      {follower.bio && (
                        <p className="text-sm text-white/40 line-clamp-1">{follower.bio}</p>
                      )}
                    </div>
                    <div className="text-sm text-white/40">
                      {follower.followers_count} followers
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
        
        {activeTab === 'following' && (
          <>
            {following.length === 0 ? (
              <div className="text-center py-12 text-white/40">
                Not following anyone yet
              </div>
            ) : (
              <div className="space-y-3">
                {following.map(followedUser => (
                  <Link
                    key={followedUser.id}
                    href={`/profile/${followedUser.id}`}
                    className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/[0.06] hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold">
                      {followedUser.username.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{followedUser.username}</p>
                      {followedUser.bio && (
                        <p className="text-sm text-white/40 line-clamp-1">{followedUser.bio}</p>
                      )}
                    </div>
                    <div className="text-sm text-white/40">
                      {followedUser.followers_count} followers
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

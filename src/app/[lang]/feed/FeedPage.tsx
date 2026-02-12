'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { PostCard } from './PostCard';
import { CreatePost } from './CreatePost';
import { Loader2, RefreshCw } from 'lucide-react';

interface Post {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  has_ai?: boolean;
  author?: {
    username: string;
    avatar_url?: string;
    wallet_address?: string;
  };
}

export function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = useCallback(async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:users(username, avatar_url, wallet_address)
      `)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching posts:', error);
    } else if (data) {
      setPosts(data);
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchPosts();
    
    // Real-time subscription
    const subscription = supabase
      .channel('posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, (payload) => {
        // Fetch the new post with author info
        supabase
          .from('posts')
          .select(`
            *,
            author:users(username, avatar_url, wallet_address)
          `)
          .eq('id', payload.new.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setPosts(prev => [data, ...prev]);
            }
          });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'posts' }, (payload) => {
        setPosts(prev => prev.map(post => 
          post.id === payload.new.id ? { ...post, ...payload.new } : post
        ));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'posts' }, (payload) => {
        setPosts(prev => prev.filter(post => post.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchPosts]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const handlePostCreated = () => {
    // New posts will be added via real-time subscription
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-16 md:top-16 z-40 bg-black/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">Feed</h1>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <CreatePost onPostCreated={handlePostCreated} />
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-white/60 mb-2">No posts yet</p>
            <p className="text-white/40 text-sm">Be the first to share something!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <PostCard key={post.id} post={post} onUpdate={fetchPosts} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

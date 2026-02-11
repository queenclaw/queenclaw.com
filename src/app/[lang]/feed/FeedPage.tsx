'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PostCard } from './PostCard';
import { CreatePost } from './CreatePost';

export function FeedPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    
    // Real-time subscription
    const subscription = supabase
      .channel('posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, (payload) => {
        setPosts(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:users(username, avatar_url, wallet_address)
      `)
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) setPosts(data);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <CreatePost />
      
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No posts yet. Be the first!</div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

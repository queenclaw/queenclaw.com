'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { PostCard } from './PostCard';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function PostFeed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    
    // Real-time subscription
    const subscription = supabase
      .channel('posts')
      .on('INSERT', (payload) => {
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

  if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

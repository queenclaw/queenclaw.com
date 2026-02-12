'use client';

import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useWalletConnection } from '@/components/wallet/WalletContextProvider';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  author: {
    username: string;
    avatar_url: string | null;
  };
}

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { publicKey, connected } = useWalletConnection();
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
    
    // Subscribe to new comments
    const subscription = supabase
      .channel(`comments:${postId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'comments',
        filter: `post_id=eq.${postId}`
      }, (payload) => {
        // Fetch the complete comment with author info
        fetchComments();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [postId]);

  const fetchComments = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        author:users(username, avatar_url)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
    } else if (data) {
      setComments(data);
    }
    setFetching(false);
  };

  const handleSubmit = async () => {
    if (!comment.trim() || !connected || !publicKey) {
      setError('Please connect your wallet first');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const walletAddress = publicKey.toString();
      
      // Get or create user
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('wallet_address', walletAddress)
        .single();

      let userId;
      if (userError || !userData) {
        // Create new user
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            wallet_address: walletAddress,
            username: `user_${walletAddress.slice(0, 8)}`,
          })
          .select('id')
          .single();
        
        if (createError) throw createError;
        userId = newUser?.id;
      } else {
        userId = userData.id;
      }

      // Create comment
      const { error: commentError } = await supabase
        .from('comments')
        .insert({
          content: comment.trim(),
          post_id: postId,
          user_id: userId,
          created_at: new Date().toISOString(),
        });

      if (commentError) throw commentError;

      setComment('');
      // Refresh comments
      fetchComments();
      
    } catch (err: any) {
      console.error('Failed to create comment:', err);
      setError(err.message || 'Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-white/10">
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
      
      {connected ? (
        <div className="flex gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {publicKey?.toString().slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-white/5 rounded-full px-4 py-2 text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-purple-500"
              maxLength={280}
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !comment.trim()}
              className="p-2 bg-white text-black rounded-full disabled:opacity-50 hover:bg-white/90 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-4 p-4 bg-white/[0.02] rounded-xl text-center">
          <p className="text-white/50 mb-2">Connect wallet to comment</p>
        </div>
      )}
      
      <div className="space-y-3">
        {fetching ? (
          <p className="text-white/40 text-sm">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-white/40 text-sm">No comments yet</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {c.author?.username?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{c.author?.username || 'Unknown'}</span>
                  <span className="text-white/40 text-xs">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-white/70 text-sm mt-1">{c.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

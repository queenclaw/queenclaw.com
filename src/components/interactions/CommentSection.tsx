'use client';

import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/hooks/useUser';

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
  const { publicKey } = useWallet();
  const { user } = useUser();
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        author:users(username, avatar_url)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (data) setComments(data);
    setFetching(false);
  };

  const handleSubmit = async () => {
    if (!comment.trim() || !publicKey || !user) return;
    
    setLoading(true);
    
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        content: comment.trim(),
      })
      .select(`
        *,
        author:users(username, avatar_url)
      `)
      .single();

    if (error) {
      console.error('Failed to create comment:', error);
    } else if (data) {
      setComments([...comments, data]);
      setComment('');
    }
    
    setLoading(false);
  };

  return (
    <div className="mt-4 pt-4 border-t border-white/10">
      {publicKey && (
        <div className="flex gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0" />
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-white/5 rounded-full px-4 py-2 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !comment.trim()}
              className="p-2 bg-purple-500 rounded-full text-white disabled:opacity-50 hover:bg-purple-600 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {fetching ? (
          <p className="text-gray-500 text-sm">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 text-sm">No comments yet</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{c.author?.username || 'Unknown'}</span>
                  <span className="text-gray-500 text-xs">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mt-1">{c.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

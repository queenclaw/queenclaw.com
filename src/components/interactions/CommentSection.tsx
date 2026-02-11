'use client';

import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';

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
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [fetching, setFetching] = useState(true);
  const [walletConnected, setWalletConnected] = useState(false);

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
    if (!comment.trim() || !walletConnected) return;
    
    setLoading(true);
    
    // Mock submission
    const newComment: Comment = {
      id: Date.now().toString(),
      content: comment.trim(),
      created_at: new Date().toISOString(),
      author: {
        username: 'user_' + Math.random().toString(36).substr(2, 8),
        avatar_url: null,
      },
    };
    
    setComments([...comments, newComment]);
    setComment('');
    setLoading(false);
  };

  return (
    <div className="mt-4 pt-4 border-t border-white/10">
      {walletConnected ? (
        <div className="flex gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#e8c55a] flex-shrink-0" />
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-white/5 rounded-full px-4 py-2 text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-[#c9a84c]"
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !comment.trim()}
              className="p-2 bg-[#c9a84c] rounded-full text-black disabled:opacity-50 hover:bg-[#e8c55a] transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-4 p-4 bg-white/[0.02] rounded-xl text-center">
          <p className="text-white/50 mb-2">Connect wallet to comment</p>
          <button 
            onClick={() => setWalletConnected(true)}
            className="px-4 py-2 bg-white text-black rounded-full text-sm font-medium"
          >
            Connect
          </button>
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
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#e8c55a] flex-shrink-0" />
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

'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { publicKey } = useWallet();
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim() || !publicKey) return;
    setLoading(true);
    // TODO: Submit to Supabase
    setComment('');
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
        <p className="text-gray-500 text-sm">No comments yet</p>
      </div>
    </div>
  );
}

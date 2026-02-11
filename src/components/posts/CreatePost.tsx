'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Image, Send } from 'lucide-react';

export function CreatePost() {
  const { publicKey } = useWallet();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || !publicKey) return;
    setLoading(true);
    // TODO: Submit to Supabase
    setContent('');
    setLoading(false);
  };

  if (!publicKey) return null;

  return (
    <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening?"
        maxLength={280}
        className="w-full bg-transparent text-white placeholder-gray-500 resize-none outline-none"
        rows={3}
      />
      <div className="flex justify-between items-center mt-3">
        <button className="text-purple-400 hover:text-purple-300 transition-colors">
          <Image size={20} />
        </button>
        <div className="flex items-center gap-3">
          <span className="text-gray-500 text-sm">{content.length}/280</span>
          <button
            onClick={handleSubmit}
            disabled={loading || !content.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            <Send size={16} />
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
}

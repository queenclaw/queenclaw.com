'use client';

import { useState } from 'react';
import { Image, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function CreatePost() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    setLoading(true);
    
    // Mock submission
    setTimeout(() => {
      setContent('');
      setLoading(false);
    }, 500);
  };

  if (!walletConnected) {
    return (
      <div className="bg-white/[0.02] rounded-xl p-4 mb-4 border border-white/[0.06] text-center">
        <p className="text-white/50 mb-3">Connect wallet to create posts</p>
        <button 
          onClick={() => setWalletConnected(true)}
          className="px-4 py-2 bg-white text-black rounded-full text-sm font-medium"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.02] rounded-xl p-4 mb-4 border border-white/[0.06]">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening?"
        maxLength={280}
        className="w-full bg-transparent text-white placeholder-white/30 resize-none outline-none"
        rows={3}
      />
      <div className="flex justify-between items-center mt-3">
        <button className="text-[#c9a84c] hover:text-[#e8c55a] transition-colors">
          <Image size={20} />
        </button>
        <div className="flex items-center gap-3">
          <span className="text-white/40 text-sm">{content.length}/280</span>
          <button
            onClick={handleSubmit}
            disabled={loading || !content.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full font-medium disabled:opacity-50 hover:bg-white/90 transition-opacity"
          >
            <Send size={16} />
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
}

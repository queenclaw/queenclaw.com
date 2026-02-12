'use client';

import { useState } from 'react';
import { Image, Smile, Send, Loader2, Sparkles } from 'lucide-react';
import { useWalletConnection } from '@/components/wallet/WalletContextProvider';
import { supabase } from '@/lib/supabase';

interface CreatePostProps {
  onPostCreated?: () => void;
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const { publicKey, connected } = useWalletConnection();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [useAI, setUseAI] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    if (!connected || !publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    setError('');

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

      // Create post
      const { error: postError } = await supabase
        .from('posts')
        .insert({
          content: content.trim(),
          author_id: userId,
          has_ai: useAI,
          created_at: new Date().toISOString(),
        });

      if (postError) throw postError;

      // Clear form
      setContent('');
      setUseAI(false);
      
      // Notify parent
      onPostCreated?.();
      
    } catch (err: any) {
      console.error('Failed to create post:', err);
      setError(err.message || 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!connected) {
    return (
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 mb-6">
        <div className="text-center py-4">
          <p className="text-white/60 mb-4">Connect your wallet to start posting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 mb-6">
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
      
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-medium flex-shrink-0">
          {publicKey?.toString().slice(0, 2).toUpperCase()}
        </div>
        
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full bg-transparent border-none outline-none resize-none text-white placeholder:text-white/30 min-h-[80px]"
            rows={3}
            maxLength={500}
            disabled={isSubmitting}
          />
          
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-2">
              <button 
                className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
                disabled={isSubmitting}
                title="Add image (coming soon)"
              >
                <Image className="w-4 h-4" />
              </button>
              <button 
                className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
                disabled={isSubmitting}
                title="Add emoji (coming soon)"
              >
                <Smile className="w-4 h-4" />
              </button>
              
              {/* AI Assist Toggle */}
              <button
                onClick={() => setUseAI(!useAI)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  useAI 
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
                disabled={isSubmitting}
              >
                <Sparkles className="w-3 h-3" />
                AI Assist
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/40">
                {content.length}/500
              </span>
              <button
                onClick={handleSubmit}
                disabled={!content.trim() || isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Post
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useWallet } from '@solana/wallet-adapter-react';
import { useUser } from '@/hooks/useUser';

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  hasLiked: boolean;
}

export function LikeButton({ postId, initialLikes, hasLiked }: LikeButtonProps) {
  const { publicKey } = useWallet();
  const { user } = useUser();
  const [liked, setLiked] = useState(hasLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [animating, setAnimating] = useState(false);

  const handleLike = async () => {
    if (!publicKey || !user) return;
    
    // Optimistic update
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes(newLiked ? likes + 1 : likes - 1);
    setAnimating(true);
    
    if (newLiked) {
      // Add like
      const { error } = await supabase
        .from('post_likes')
        .insert({ post_id: postId, user_id: user.id });
      
      if (error) {
        // Revert on error
        setLiked(false);
        setLikes(likes);
      }
    } else {
      // Remove like
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);
      
      if (error) {
        // Revert on error
        setLiked(true);
        setLikes(likes);
      }
    }
    
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <button
      onClick={handleLike}
      disabled={!publicKey}
      className={`flex items-center gap-1 transition-all ${
        liked ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'
      } ${animating ? 'scale-125' : 'scale-100'} ${!publicKey ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Heart className={liked ? 'fill-current' : ''} size={18} />
      <span className="text-sm">{likes}</span>
    </button>
  );
}

'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  hasLiked: boolean;
}

export function LikeButton({ postId, initialLikes, hasLiked }: LikeButtonProps) {
  const [liked, setLiked] = useState(hasLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [animating, setAnimating] = useState(false);

  const handleLike = async () => {
    // Optimistic update
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes(newLiked ? likes + 1 : likes - 1);
    setAnimating(true);
    
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-1 transition-all ${
        liked ? 'text-red-400' : 'text-white/50 hover:text-red-400'
      } ${animating ? 'scale-125' : 'scale-100'}`}
    >
      <Heart className={liked ? 'fill-current' : ''} size={18} />
      <span className="text-sm">{likes}</span>
    </button>
  );
}

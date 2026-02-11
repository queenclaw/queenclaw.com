'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';

interface Post {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  author?: {
    username: string;
    avatar_url?: string;
    wallet_address?: string;
  };
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);

  const handleLike = () => {
    if (liked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <article className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 hover:bg-white/[0.04] transition-colors">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium flex-shrink-0">
          {post.author?.avatar_url ? (
            <img src={post.author.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            post.author?.username?.charAt(0).toUpperCase() || 'U'
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{post.author?.username || 'Anonymous'}</span>
              <span className="text-white/40">@</span>
              <span className="text-white/40 text-sm">{formatDate(post.created_at)}</span>
            </div>
            <button className="text-white/40 hover:text-white">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <p className="text-white/90 mb-3 whitespace-pre-wrap">{post.content}</p>

          {/* Actions */}
          <div className="flex items-center gap-6 text-white/50">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-2 hover:text-white transition-colors ${liked ? 'text-red-400' : ''}`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              <span className="text-sm">{likesCount}</span>
            </button>
            
            <button className="flex items-center gap-2 hover:text-white transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">0</span>
            </button>
            
            <button className="flex items-center gap-2 hover:text-white transition-colors">
              <Share className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

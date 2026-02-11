'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { LikeButton } from '../interactions/LikeButton';

interface PostCardProps {
  id: string;
  author: {
    username: string;
    avatar_url?: string;
    wallet_address: string;
  };
  content: string;
  media_urls?: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
}

export function PostCard({ post }: { post: PostCardProps }) {
  return (
    <article className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10 hover:border-purple-500/30 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
          {post.author.username?.[0]?.toUpperCase() || '?'}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-white">{post.author.username || 'Anonymous'}</span>
            <span className="text-gray-500 text-sm">
              {new Date(post.created_at).toLocaleDateString()}
            </span>
          </div>
          
          <p className="text-gray-200 mb-3">{post.content}</p>
          
          {post.media_urls && post.media_urls.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              {post.media_urls.map((url, i) => (
                <img key={i} src={url} alt="" className="rounded-lg max-h-64 object-cover" />
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-6 text-gray-500">
            <LikeButton postId={post.id} initialLikes={post.likes_count} hasLiked={false} />
            
            <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
              <MessageCircle size={18} />
              <span className="text-sm">{post.comments_count}</span>
            </button>
            
            <button className="flex items-center gap-1 hover:text-green-400 transition-colors">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal, Sparkles, Loader2 } from 'lucide-react';
import { useWalletConnection } from '@/components/wallet/WalletContextProvider';
import { supabase } from '@/lib/supabase';

interface Post {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  has_ai?: boolean;
  author?: {
    username: string;
    avatar_url?: string;
    wallet_address?: string;
  };
}

interface PostCardProps {
  post: Post;
  onUpdate?: () => void;
}

export function PostCard({ post, onUpdate }: PostCardProps) {
  const { publicKey, connected } = useWalletConnection();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Check if user has liked this post
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!connected || !publicKey) return;
      
      const { data } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', post.id)
        .eq('wallet_address', publicKey.toString())
        .single();
      
      setLiked(!!data);
    };
    
    checkLikeStatus();
  }, [post.id, publicKey, connected]);

  // Fetch comments when expanded
  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select(`
        *,
        author:users(username, avatar_url)
      `)
      .eq('post_id', post.id)
      .order('created_at', { ascending: true });
    
    if (data) setComments(data);
  };

  const handleLike = async () => {
    if (!connected || !publicKey) {
      alert('Please connect your wallet to like posts');
      return;
    }
    
    if (isLiking) return;
    
    setIsLiking(true);
    const walletAddress = publicKey.toString();
    
    try {
      if (liked) {
        // Unlike
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('wallet_address', walletAddress);
        
        setLikesCount(prev => prev - 1);
        setLiked(false);
      } else {
        // Like
        await supabase
          .from('post_likes')
          .insert({
            post_id: post.id,
            wallet_address: walletAddress,
          });
        
        setLikesCount(prev => prev + 1);
        setLiked(true);
      }
      
      onUpdate?.();
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !connected || !publicKey) return;
    
    setIsSubmittingComment(true);
    
    try {
      // Get user ID
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('wallet_address', publicKey.toString())
        .single();
      
      if (!userData) {
        alert('User not found. Please try again.');
        return;
      }
      
      await supabase
        .from('comments')
        .insert({
          post_id: post.id,
          content: newComment.trim(),
          author_id: userData.id,
        });
      
      setNewComment('');
      fetchComments();
      onUpdate?.();
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  return (
    <article className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 hover:bg-white/[0.04] transition-colors">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/50 to-pink-500/50 flex items-center justify-center text-sm font-medium flex-shrink-0">
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
              {post.has_ai && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-400">
                  <Sparkles className="w-3 h-3" />
                  AI
                </span>
              )}
              <span className="text-white/40">·</span>
              <span className="text-white/40 text-sm">{formatDate(post.created_at)}</span>
            </div>
            <button className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <p className="text-white/90 mb-3 whitespace-pre-wrap">{post.content}</p>

          {/* Actions */}
          <div className="flex items-center gap-6 text-white/50">
            <button 
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-2 hover:text-white transition-colors disabled:opacity-50 ${liked ? 'text-red-400' : ''}`}
            >
              {isLiking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              )}
              <span className="text-sm">{likesCount}</span>
            </button>
            
            <button 
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center gap-2 hover:text-white transition-colors ${showComments ? 'text-blue-400' : ''}`}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{comments.length || 0}</span>
            </button>
            
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Share className="w-4 h-4" />
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              {/* Comment List */}
              <div className="space-y-3 mb-4">
                {comments.length === 0 ? (
                  <p className="text-white/40 text-sm text-center py-4">No comments yet. Be the first!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs flex-shrink-0">
                        {comment.author?.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 bg-white/[0.03] rounded-xl rounded-tl-none px-3 py-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{comment.author?.username || 'Anonymous'}</span>
                          <span className="text-white/40 text-xs">{formatDate(comment.created_at)}</span>
                        </div>
                        <p className="text-sm text-white/80">{comment.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment */}
              {connected ? (
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs flex-shrink-0">
                    {publicKey?.toString().slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-full px-4 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-500/50"
                      maxLength={280}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
                    />
                    <button
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim() || isSubmittingComment}
                      className="px-4 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
                    >
                      {isSubmittingComment ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Reply'
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-white/40 text-sm text-center">Connect your wallet to comment</p>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

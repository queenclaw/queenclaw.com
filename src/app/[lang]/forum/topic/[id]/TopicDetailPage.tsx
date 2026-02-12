'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Pin,
  CheckCircle2,
  Lock,
  Clock,
  Eye,
  Send,
  Loader2,
  MoreHorizontal,
  Hash,
  Flag,
  Bookmark,
  Trophy,
  Award,
  Flame
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useWalletConnection } from '@/components/wallet/WalletContextProvider';

interface Topic {
  id: string;
  title: string;
  content: string;
  author_id: string;
  category_id: string;
  views_count: number;
  likes_count: number;
  comments_count: number;
  pinned: boolean;
  solved: boolean;
  locked: boolean;
  tags: string[];
  created_at: string;
  last_activity_at: string;
  author?: {
    username: string;
    avatar_url?: string;
    wallet_address?: string;
  };
  category?: {
    name: string;
    slug: string;
    color: string;
    icon: string;
  };
  user_liked?: boolean;
}

interface Reply {
  id: string;
  content: string;
  author_id: string;
  topic_id: string;
  likes_count: number;
  is_solution: boolean;
  created_at: string;
  author?: {
    username: string;
    avatar_url?: string;
    wallet_address?: string;
  };
  user_liked?: boolean;
}

interface TopicDetailPageProps {
  lang: string;
  topicId: string;
}

export function TopicDetailPage({ lang, topicId }: TopicDetailPageProps) {
  const router = useRouter();
  const { publicKey, connected } = useWalletConnection();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Fetch topic and replies
  const fetchTopicData = useCallback(async () => {
    try {
      // Fetch topic
      const { data: topicData, error: topicError } = await supabase
        .from('forum_topics')
        .select(`
          *,
          author:users(username, avatar_url, wallet_address),
          category:forum_categories(name, slug, color, icon)
        `)
        .eq('id', topicId)
        .single();

      if (topicError || !topicData) {
        console.error('Error fetching topic:', topicError);
        return;
      }

      setTopic(topicData);

      // Check if user liked the topic
      if (connected && publicKey) {
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('wallet_address', publicKey.toString())
          .single();

        if (userData) {
          const { data: likeData } = await supabase
            .from('forum_topic_likes')
            .select('id')
            .eq('topic_id', topicId)
            .eq('user_id', userData.id)
            .single();

          setTopic(prev => prev ? { ...prev, user_liked: !!likeData } : null);
        }
      }

      // Fetch replies
      const { data: repliesData, error: repliesError } = await supabase
        .from('forum_replies')
        .select(`
          *,
          author:users(username, avatar_url, wallet_address)
        `)
        .eq('topic_id', topicId)
        .order('created_at', { ascending: true });

      if (repliesError) {
        console.error('Error fetching replies:', repliesError);
      } else {
        // Check which replies user liked
        if (connected && publicKey && repliesData) {
          const { data: userData } = await supabase
            .from('users')
            .select('id')
            .eq('wallet_address', publicKey.toString())
            .single();

          if (userData) {
            const { data: likedReplies } = await supabase
              .from('forum_reply_likes')
              .select('reply_id')
              .eq('user_id', userData.id)
              .in('reply_id', repliesData.map(r => r.id));

            const likedReplyIds = new Set(likedReplies?.map(l => l.reply_id) || []);
            
            setReplies(repliesData.map(reply => ({
              ...reply,
              user_liked: likedReplyIds.has(reply.id)
            })));
          } else {
            setReplies(repliesData);
          }
        } else {
          setReplies(repliesData || []);
        }
      }

      // Increment view count
      await supabase
        .from('forum_topics')
        .update({ views_count: (topicData.views_count || 0) + 1 })
        .eq('id', topicId);

    } catch (error) {
      console.error('Error fetching topic data:', error);
    } finally {
      setLoading(false);
    }
  }, [topicId, connected, publicKey]);

  useEffect(() => {
    fetchTopicData();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`topic:${topicId}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'forum_replies', filter: `topic_id=eq.${topicId}` },
        async (payload) => {
          // Fetch the new reply with author info
          const { data } = await supabase
            .from('forum_replies')
            .select(`
              *,
              author:users(username, avatar_url, wallet_address)
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            setReplies(prev => [...prev, data]);
            // Update reply count
            setTopic(prev => prev ? { ...prev, comments_count: (prev.comments_count || 0) + 1 } : null);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [topicId, fetchTopicData]);

  const handleLikeTopic = async () => {
    if (!connected || !publicKey) {
      alert('Please connect your wallet to like topics');
      return;
    }

    if (isLiking || !topic) return;

    setIsLiking(true);

    try {
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('wallet_address', publicKey.toString())
        .single();

      if (!userData) {
        alert('User not found');
        return;
      }

      if (topic.user_liked) {
        // Unlike
        await supabase
          .from('forum_topic_likes')
          .delete()
          .eq('topic_id', topicId)
          .eq('user_id', userData.id);

        setTopic(prev => prev ? {
          ...prev,
          user_liked: false,
          likes_count: (prev.likes_count || 0) - 1
        } : null);
      } else {
        // Like
        await supabase
          .from('forum_topic_likes')
          .insert({ topic_id: topicId, user_id: userData.id });

        setTopic(prev => prev ? {
          ...prev,
          user_liked: true,
          likes_count: (prev.likes_count || 0) + 1
        } : null);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleLikeReply = async (replyId: string) => {
    if (!connected || !publicKey) {
      alert('Please connect your wallet to like replies');
      return;
    }

    try {
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('wallet_address', publicKey.toString())
        .single();

      if (!userData) return;

      const reply = replies.find(r => r.id === replyId);
      if (!reply) return;

      if (reply.user_liked) {
        // Unlike
        await supabase
          .from('forum_reply_likes')
          .delete()
          .eq('reply_id', replyId)
          .eq('user_id', userData.id);

        setReplies(prev => prev.map(r => 
          r.id === replyId 
            ? { ...r, user_liked: false, likes_count: (r.likes_count || 0) - 1 }
            : r
        ));
      } else {
        // Like
        await supabase
          .from('forum_reply_likes')
          .insert({ reply_id: replyId, user_id: userData.id });

        setReplies(prev => prev.map(r => 
          r.id === replyId 
            ? { ...r, user_liked: true, likes_count: (r.likes_count || 0) + 1 }
            : r
        ));
      }
    } catch (error) {
      console.error('Error toggling reply like:', error);
    }
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim() || !connected || !publicKey) return;

    if (topic?.locked) {
      alert('This topic is locked');
      return;
    }

    setIsSubmittingReply(true);

    try {
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('wallet_address', publicKey.toString())
        .single();

      if (!userData) {
        alert('User not found');
        return;
      }

      const { error } = await supabase
        .from('forum_replies')
        .insert({
          topic_id: topicId,
          content: replyContent.trim(),
          author_id: userData.id,
        });

      if (error) {
        console.error('Error submitting reply:', error);
        alert('Failed to submit reply');
      } else {
        setReplyContent('');
        // Real-time subscription will add the reply
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${lang}/forum/topic/${topicId}`);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-2">Topic Not Found</h1>
          <p className="text-white/60 mb-6">The topic you're looking for doesn't exist or has been removed.</p>
          <Link
            href={`/${lang}/forum`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Forum
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor = connected && publicKey && topic.author?.wallet_address === publicKey.toString();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Link
              href={`/${lang}/forum`}
              className="p-2 -ml-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="font-semibold truncate">{topic.title}</h1>
              <p className="text-sm text-white/40">
                {topic.category?.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked ? 'text-yellow-400 bg-yellow-400/10' : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Topic Card */}
        <article className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden mb-6">
          {/* Topic Header */}
          <div className="p-6 border-b border-white/[0.06]">
            <div className="flex items-start gap-4">
              {/* Author Avatar */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/50 to-pink-500/50 flex items-center justify-center text-lg font-bold">
                  {topic.author?.avatar_url ? (
                    <img 
                      src={topic.author.avatar_url} 
                      alt="" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    topic.author?.username?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                {/* Meta */}
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  {topic.pinned && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-400">
                      <Pin className="w-3 h-3" />
                      Pinned
                    </span>
                  )}
                  {topic.solved && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-400">
                      <CheckCircle2 className="w-3 h-3" />
                      Solved
                    </span>
                  )}
                  {topic.locked && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/20 border border-red-500/30 rounded text-xs text-red-400">
                      <Lock className="w-3 h-3" />
                      Locked
                    </span>
                  )}
                  <span className="text-sm text-white/40">
                    {topic.author?.username || 'Anonymous'}
                  </span>
                  <span className="text-white/30">·</span>
                  <span className="text-sm text-white/40 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(topic.created_at)}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold mb-4">{topic.title}</h1>

                {/* Content */}
                <div className="prose prose-invert max-w-none mb-4">
                  <p className="text-white/80 whitespace-pre-wrap">{topic.content}</p>
                </div>

                {/* Tags */}
                {topic.tags && topic.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {topic.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-white/5 rounded-full text-sm text-white/60"
                      >
                        <Hash className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Category Badge */}
                {topic.category && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg">{topic.category.icon}</span>
                    <span 
                      className="text-sm px-3 py-1 rounded-full"
                      style={{ 
                        backgroundColor: `${topic.category.color}20`,
                        color: topic.category.color 
                      }}
                    >
                      {topic.category.name}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-6 pt-4 border-t border-white/[0.06]">
                  <button
                    onClick={handleLikeTopic}
                    disabled={isLiking}
                    className={`flex items-center gap-2 transition-colors disabled:opacity-50 ${
                      topic.user_liked ? 'text-red-400' : 'text-white/50 hover:text-red-400'
                    }`}
                  >
                    {isLiking ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Heart className={`w-5 h-5 ${topic.user_liked ? 'fill-current' : ''}`} />
                    )}
                    <span>{topic.likes_count || 0}</span>
                  </button>

                  <button className="flex items-center gap-2 text-white/50 hover:text-blue-400 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span>{topic.comments_count || 0}</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>

                  <div className="flex items-center gap-2 text-white/40 ml-auto">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">{topic.views_count || 0} views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Replies Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-white/60" />
            {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
          </h2>

          {replies.length === 0 ? (
            <div className="text-center py-12 bg-white/[0.02] rounded-2xl border border-white/[0.06]">
              <div className="text-4xl mb-4">💬</div>
              <p className="text-white/60 mb-2">No replies yet</p>
              <p className="text-white/40 text-sm">Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {replies.map((reply, index) => (
                <div
                  key={reply.id}
                  className={`bg-white/[0.02] border rounded-2xl p-6 ${
                    reply.is_solution 
                      ? 'border-green-500/30 bg-green-500/5' 
                      : 'border-white/[0.06]'
                  }`}
                >
                  {/* Solution Badge */}
                  {reply.is_solution && (
                    <div className="flex items-center gap-2 mb-4 text-green-400">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-medium">Marked as Solution</span>
                    </div>
                  )}

                  <div className="flex gap-4">
                    {/* Author Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/50 to-pink-500/50 flex items-center justify-center text-sm font-bold">
                        {reply.author?.avatar_url ? (
                          <img 
                            src={reply.author.avatar_url} 
                            alt="" 
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          reply.author?.username?.charAt(0).toUpperCase() || 'U'
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Meta */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{reply.author?.username || 'Anonymous'}</span>
                        {index === 0 && (
                          <span className="px-2 py-0.5 bg-purple-500/20 rounded text-xs text-purple-400">
                            OP
                          </span>
                        )}
                        <span className="text-white/30">·</span>
                        <span className="text-sm text-white/40">
                          {formatTimeAgo(reply.created_at)}
                        </span>
                      </div>

                      {/* Content */}
                      <p className="text-white/80 whitespace-pre-wrap mb-4">{reply.content}</p>

                      {/* Actions */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleLikeReply(reply.id)}
                          className={`flex items-center gap-1.5 text-sm transition-colors ${
                            reply.user_liked ? 'text-red-400' : 'text-white/40 hover:text-red-400'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${reply.user_liked ? 'fill-current' : ''}`} />
                          <span>{reply.likes_count || 0}</span>
                        </button>

                        <button className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors">
                          <Flag className="w-4 h-4" />
                          <span>Report</span>
                        </button>

                        {isAuthor && !reply.is_solution && (
                          <button className="flex items-center gap-1.5 text-sm text-green-400 hover:text-green-300 transition-colors ml-auto">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Mark as Solution</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reply Form */}
        {!topic.locked ? (
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Add a Reply</h3>
            
            {connected ? (
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold">
                    {publicKey?.toString().slice(0, 2).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-purple-500/50 resize-none min-h-[120px] mb-4"
                    maxLength={2000}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/40">
                      {replyContent.length}/2000
                    </span>
                    <button
                      onClick={handleSubmitReply}
                      disabled={!replyContent.trim() || isSubmittingReply}
                      className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
                    >
                      {isSubmittingReply ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Post Reply
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-white/60 mb-4">Connect your wallet to reply</p>
                <p className="text-white/40 text-sm">Use the Connect Wallet button in the header</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 text-center">
            <Lock className="w-8 h-8 text-white/40 mx-auto mb-3" />
            <p className="text-white/60">This topic is locked</p>
            <p className="text-white/40 text-sm">No new replies can be added</p>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useWalletConnection } from '@/components/wallet/WalletContextProvider';
import { 
  ArrowLeft, 
  Plus, 
  Loader2, 
  Hash, 
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import Link from 'next/link';

interface ForumCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  color: string;
}

interface CreateTopicPageProps {
  lang: string;
}

export function CreateTopicPage({ lang }: CreateTopicPageProps) {
  const router = useRouter();
  const { publicKey, connected } = useWalletConnection();
  
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  // Error state
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    category?: string;
  }>({});
  
  // Success state
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdTopicId, setCreatedTopicId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('forum_categories')
      .select('*')
      .order('sort_order');
    
    if (data) {
      setCategories(data);
      if (data.length > 0) {
        setSelectedCategory(data[0].id);
      }
    }
    setLoading(false);
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }
    
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    } else if (content.length < 20) {
      newErrors.content = 'Content must be at least 20 characters';
    } else if (content.length > 10000) {
      newErrors.content = 'Content must be less than 10,000 characters';
    }
    
    if (!selectedCategory) {
      newErrors.category = 'Please select a category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected || !publicKey) {
      alert('Please connect your wallet to create a topic');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
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

      // Create topic
      const { data: topic, error: topicError } = await supabase
        .from('forum_topics')
        .insert({
          title: title.trim(),
          content: content.trim(),
          author_id: userId,
          category_id: selectedCategory,
          tags: tags.length > 0 ? tags : null,
          views_count: 0,
          likes_count: 0,
          comments_count: 0,
          pinned: false,
          solved: false,
          locked: false,
        })
        .select('id')
        .single();

      if (topicError) throw topicError;
      
      setCreatedTopicId(topic.id);
      setShowSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push(`/${lang}/forum/topic/${topic.id}`);
      }, 2000);
      
    } catch (err: any) {
      console.error('Failed to create topic:', err);
      alert(err.message || 'Failed to create topic. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().replace(/^#/, '');
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-black text-white pt-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center py-20">
            <AlertCircle className="w-16 h-16 text-white/20 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
            <p className="text-white/50 mb-8">
              Please connect your Solana wallet to create a new discussion.
            </p>
            <Link
              href={`/${lang}/forum`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Forum
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-black text-white pt-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Discussion Created!</h1>
            <p className="text-white/50 mb-8">
              Your topic has been posted successfully. Redirecting...
            </p>
            {createdTopicId && (
              <Link
                href={`/${lang}/forum/topic/${createdTopicId}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-colors"
              >
                View Discussion
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/${lang}/forum`}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <h1 className="text-2xl font-bold">Create New Discussion</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-3">
              Category <span className="text-red-400">*</span>
            </label>
            {loading ? (
              <div className="flex items-center gap-2 text-white/40">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading categories...
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                      selectedCategory === category.id
                        ? 'bg-white/10 border-white/30'
                        : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/5 hover:border-white/10'
                    }`}
                  >
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{category.name}</div>
                      <div className="text-xs text-white/40 line-clamp-1">
                        {category.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {errors.category && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.category}
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-3">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your discussion about?"
              className={`w-full px-4 py-3 bg-white/[0.02] border rounded-xl text-white placeholder:text-white/30 outline-none transition-colors ${
                errors.title
                  ? 'border-red-500/50 focus:border-red-500'
                  : 'border-white/[0.06] focus:border-white/20'
              }`}
              maxLength={200}
            />
            <div className="flex items-center justify-between mt-2">
              {errors.title ? (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.title}
                </p>
              ) : (
                <span />
              )}
              <span className="text-xs text-white/40">
                {title.length}/200
              </span>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-3">
              Content <span className="text-red-400">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your topic in detail. You can use markdown formatting."
              rows={12}
              className={`w-full px-4 py-3 bg-white/[0.02] border rounded-xl text-white placeholder:text-white/30 outline-none resize-none transition-colors ${
                errors.content
                  ? 'border-red-500/50 focus:border-red-500'
                  : 'border-white/[0.06] focus:border-white/20'
              }`}
              maxLength={10000}
            />
            <div className="flex items-center justify-between mt-2">
              {errors.content ? (
                <p className="text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.content}
                </p>
              ) : (
                <span />
              )}
              <span className="text-xs text-white/40">
                {content.length}/10,000
              </span>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-3">
              Tags <span className="text-white/40">(optional, max 5)</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Add tags..."
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.02] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors"
                  disabled={tags.length >= 5}
                />
              </div>
              <button
                type="button"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || tags.length >= 5}
                className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white/70"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 p-0.5 hover:bg-white/10 rounded transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/[0.06]">
            <Link
              href={`/${lang}/forum`}
              className="px-6 py-3 text-white/70 hover:text-white transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting || loading}
              className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Discussion
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

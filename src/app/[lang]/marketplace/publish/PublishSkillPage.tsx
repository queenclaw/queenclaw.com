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
  X,
  Upload,
  DollarSign,
  Tag,
  FileText,
  Layers
} from 'lucide-react';
import Link from 'next/link';

interface SkillCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

interface PublishSkillPageProps {
  lang: string;
}

export function PublishSkillPage({ lang }: PublishSkillPageProps) {
  const router = useRouter();
  const { publicKey, connected } = useWalletConnection();
  
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [price, setPrice] = useState('');
  const [priceType, setPriceType] = useState<'free' | 'paid'>('free');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');
  
  // Error state
  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    category?: string;
    price?: string;
  }>({});
  
  // Success state
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchCategories();
    
    // Check if user is connected
    if (!connected) {
      // Will show connect wallet UI
    }
  }, [connected]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('skill_categories')
      .select('*')
      .order('name');
    
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
    
    if (!name.trim() || name.length < 5) {
      newErrors.name = 'Skill name must be at least 5 characters';
    } else if (name.length > 100) {
      newErrors.name = 'Skill name must be less than 100 characters';
    }
    
    if (!description.trim() || description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    } else if (description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    
    if (!selectedCategory) {
      newErrors.category = 'Please select a category';
    }
    
    if (priceType === 'paid' && (!price || parseFloat(price) <= 0)) {
      newErrors.price = 'Please enter a valid price';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected || !publicKey) {
      alert('Please connect your wallet to publish a skill');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Get user ID from wallet address
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, username')
        .eq('wallet_address', publicKey.toString())
        .single();
      
      if (userError || !userData) {
        alert('User not found. Please register first.');
        setSubmitting(false);
        return;
      }
      
      // Create skill
      const { data: skill, error } = await supabase
        .from('skills')
        .insert({
          name: name.trim(),
          description: description.trim(),
          long_description: longDescription.trim() || null,
          provider_id: userData.id,
          provider_name: userData.username,
          provider_avatar: '🤖',
          category_id: selectedCategory,
          price: priceType === 'free' ? 'Free' : `${price} USDT`,
          price_amount: priceType === 'free' ? 0 : parseFloat(price),
          price_currency: 'USDT',
          tags: tags,
          features: features,
          active: true,
          version: '1.0.0',
          last_updated: new Date().toISOString(),
          license: 'MIT'
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating skill:', error);
        alert('Failed to publish skill. Please try again.');
        setSubmitting(false);
        return;
      }
      
      // Show success message
      setShowSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push(`/${lang}/marketplace/skill/${skill.id}`);
      }, 2000);
      
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred. Please try again.');
      setSubmitting(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 5) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddFeature = () => {
    if (featureInput.trim() && features.length < 10) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-3xl mx-auto px-6 pt-32 pb-16">
          <div className="text-center">
            <div className="text-6xl mb-6">🔐</div>
            <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
            <p className="text-white/60 mb-8 max-w-md mx-auto">
              Please connect your Solana wallet to publish a skill on the marketplace.
            </p>
            <Link
              href={`/${lang}/marketplace`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-3xl mx-auto px-6 pt-32 pb-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Skill Published! 🎉</h1>
            <p className="text-white/60 mb-8">
              Your skill has been successfully published to the marketplace.
              Redirecting to your skill page...
            </p>
            <div className="animate-pulse">
              <Loader2 className="w-6 h-6 text-white/40 animate-spin mx-auto" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href={`/${lang}/marketplace`}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Marketplace</span>
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Title */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white/70 mb-6">
              <Upload className="w-4 h-4 text-[#c9a84c]" />
              <span>Become a Provider</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Publish Your Skill</h1>
            <p className="text-white/50 text-lg">
              Share your AI agent&apos;s capabilities with the world and earn USDT.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <section className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#c9a84c]" />
                Basic Information
              </h2>
              
              <div className="space-y-6">
                {/* Skill Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Skill Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Multi-Language Translation"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors"
                  />
                  {errors.name && (
                    <div className="flex items-center gap-1 mt-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </div>
                  )}
                  <p className="mt-2 text-sm text-white/40">
                    {name.length}/100 characters
                  </p>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setSelectedCategory(category.id)}
                        className={`p-4 border rounded-xl text-left transition-all ${
                          selectedCategory === category.id
                            ? 'border-[#c9a84c] bg-[#c9a84c]/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="text-2xl mb-2">{category.icon}</div>
                        <div className="font-medium text-sm">{category.name}</div>
                      </button>
                    ))}
                  </div>
                  {errors.category && (
                    <div className="flex items-center gap-1 mt-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.category}
                    </div>
                  )}
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Short Description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe what your skill does..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors resize-none"
                  />
                  {errors.description && (
                    <div className="flex items-center gap-1 mt-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.description}
                    </div>
                  )}
                  <p className="mt-2 text-sm text-white/40">
                    {description.length}/500 characters
                  </p>
                </div>

                {/* Long Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Detailed Description
                  </label>
                  <textarea
                    value={longDescription}
                    onChange={(e) => setLongDescription(e.target.value)}
                    placeholder="Provide a detailed description of your skill, including how it works and what problems it solves..."
                    rows={6}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors resize-none"
                  />
                  <p className="mt-2 text-sm text-white/40">
                    Optional - Markdown supported
                  </p>
                </div>
              </div>
            </section>

            {/* Pricing */}
            <section className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#c9a84c]" />
                Pricing
              </h2>
              
              <div className="space-y-6">
                {/* Price Type */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setPriceType('free')}
                    className={`flex-1 p-4 border rounded-xl text-center transition-all ${
                      priceType === 'free'
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="text-2xl mb-2">🆓</div>
                    <div className="font-medium">Free</div>
                    <div className="text-sm text-white/50">Share for free</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setPriceType('paid')}
                    className={`flex-1 p-4 border rounded-xl text-center transition-all ${
                      priceType === 'paid'
                        ? 'border-[#c9a84c] bg-[#c9a84c]/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="text-2xl mb-2">💰</div>
                    <div className="font-medium">Paid</div>
                    <div className="text-sm text-white/50">Earn USDT</div>
                  </button>
                </div>

                {/* Price Input */}
                {priceType === 'paid' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price (USDT)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        min="0.01"
                        step="0.01"
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                        $
                      </div>
                    </div>
                    {errors.price && (
                      <div className="flex items-center gap-1 mt-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.price}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Features */}
            <section className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#c9a84c]" />
                Features
              </h2>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                    placeholder="Add a feature (e.g., Real-time translation)"
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    disabled={!featureInput.trim() || features.length >= 10}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                
                {features.length > 0 && (
                  <ul className="space-y-2">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                          {feature}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className="p-1 text-white/40 hover:text-white transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                
                <p className="text-sm text-white/40">
                  {features.length}/10 features
                </p>
              </div>
            </section>

            {/* Tags */}
            <section className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#c9a84c]" />
                Tags
              </h2>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add a tag"
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    disabled={!tagInput.trim() || tags.length >= 5}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm"
                      >
                        <Hash className="w-3 h-3 text-[#c9a84c]" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 p-0.5 text-white/40 hover:text-white transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                
                <p className="text-sm text-white/40">
                  {tags.length}/5 tags
                </p>
              </div>
            </section>

            {/* Submit */}
            <div className="flex gap-4">
              <Link
                href={`/${lang}/marketplace`}
                className="flex-1 px-6 py-4 border border-white/20 rounded-xl font-medium text-center hover:bg-white/5 transition-colors"
              >
                Cancel
              </Link>
              
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-4 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Publish Skill
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  DollarSign, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Tag,
  Layers,
  FileText,
  X
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface SkillCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export function PublishSkillPage() {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  const { publicKey, connected } = useWallet();
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [priceType, setPriceType] = useState<'free' | 'paid'>('free');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [features, setFeatures] = useState<string[]>(['']);
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [icon, setIcon] = useState('🛠️');
  
  // UI state
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('skill_categories')
      .select('*')
      .order('name');
    
    if (data) {
      setCategories(data);
      if (data.length > 0) {
        setCategoryId(data[0].id);
      }
    }
    setLoading(false);
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim()) && tags.length < 10) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddFeature = () => {
    if (features.length < 10) {
      setFeatures([...features, '']);
    }
  };

  const handleUpdateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const handleRemoveFeature = (index: number) => {
    if (features.length > 1) {
      setFeatures(features.filter((_, i) => i !== index));
    }
  };

  const handleAddRequirement = () => {
    if (requirements.length < 10) {
      setRequirements([...requirements, '']);
    }
  };

  const handleUpdateRequirement = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  const handleRemoveRequirement = (index: number) => {
    if (requirements.length > 1) {
      setRequirements(requirements.filter((_, i) => i !== index));
    }
  };

  const validateForm = (): boolean => {
    if (!name.trim()) {
      setError('Skill name is required');
      return false;
    }
    if (!description.trim()) {
      setError('Short description is required');
      return false;
    }
    if (!longDescription.trim()) {
      setError('Detailed description is required');
      return false;
    }
    if (!categoryId) {
      setError('Please select a category');
      return false;
    }
    if (priceType === 'paid' && (!price || parseFloat(price) <= 0)) {
      setError('Please enter a valid price');
      return false;
    }
    if (!connected || !publicKey) {
      setError('Please connect your wallet first');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      // Get current user
      const { data: userData } = await supabase
        .from('users')
        .select('id, username')
        .eq('wallet_address', publicKey?.toString())
        .single();

      if (!userData) {
        setError('User not found. Please try again.');
        setSubmitting(false);
        return;
      }

      // Filter out empty features and requirements
      const filteredFeatures = features.filter(f => f.trim());
      const filteredRequirements = requirements.filter(r => r.trim());

      // Create skill
      const { data: skill, error: skillError } = await supabase
        .from('skills')
        .insert({
          name: name.trim(),
          description: description.trim(),
          long_description: longDescription.trim(),
          category_id: categoryId,
          provider_id: userData.id,
          provider_name: userData.username,
          provider_address: publicKey?.toString(),
          provider_avatar: icon,
          price: priceType === 'free' ? 'Free' : `$${price} USDT`,
          price_amount: priceType === 'free' ? 0 : parseFloat(price),
          tags: tags,
          features: filteredFeatures,
          requirements: filteredRequirements,
          version: '1.0.0',
          active: true,
          featured: false,
          trending: false,
          rating: 0,
          reviews_count: 0,
          downloads_count: 0,
          last_updated: new Date().toISOString(),
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (skillError) {
        console.error('Error creating skill:', skillError);
        setError('Failed to publish skill. Please try again.');
        setSubmitting(false);
        return;
      }

      // Create notification for the user
      await supabase.from('notifications').insert({
        recipient_id: userData.id,
        sender_id: null,
        type: 'system',
        title: 'Skill Published Successfully',
        message: `Your skill "${name}" has been published to the marketplace.`,
        data: { skillId: skill.id },
        read: false,
        created_at: new Date().toISOString(),
      });

      setSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push(`/${lang}/marketplace/skill/${skill.id}`);
      }, 2000);

    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
    }

    setSubmitting(false);
  };

  const iconOptions = ['🛠️', '🤖', '⚡', '🔮', '📊', '🎨', '📝', '🔒', '🌐', '📱', '💡', '🎯', '🚀', '💎', '🔧'];

  if (success) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Skill Published! 🎉</h1>
          <p className="text-white/60 mb-8">
            Your skill "{name}" has been successfully published to the marketplace.
          </p>
          <p className="text-white/40 text-sm">Redirecting to your skill page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/${lang}/marketplace`}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold">Publish New Skill</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {!connected ? (
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
            <p className="text-white/60 mb-6">Please connect your wallet to publish a skill.</p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Basic Information */}
            <section className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#c9a84c]" />
                Basic Information
              </h2>

              <div className="space-y-6">
                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3">Skill Icon</label>
                  <div className="flex flex-wrap gap-2">
                    {iconOptions.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setIcon(emoji)}
                        className={`w-12 h-12 text-2xl rounded-xl border transition-all ${
                          icon === emoji
                            ? 'border-[#c9a84c] bg-[#c9a84c]/10'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skill Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Skill Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Twitter Bot Automation"
                    maxLength={100}
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 outline-none focus:border-[#c9a84c]/50 transition-colors"
                  />
                  <p className="text-xs text-white/40 mt-1">{100 - name.length} characters remaining</p>
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Short Description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe what your skill does (shown in listings)"
                    maxLength={200}
                    rows={2}
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 outline-none focus:border-[#c9a84c]/50 transition-colors resize-none"
                  />
                  <p className="text-xs text-white/40 mt-1">{200 - description.length} characters remaining</p>
                </div>

                {/* Long Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    value={longDescription}
                    onChange={(e) => setLongDescription(e.target.value)}
                    placeholder="Provide a detailed description of your skill, including what it does, how it works, and why users should buy it..."
                    rows={6}
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 outline-none focus:border-[#c9a84c]/50 transition-colors resize-none"
                  />
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
                        onClick={() => setCategoryId(category.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          categoryId === category.id
                            ? 'border-[#c9a84c] bg-[#c9a84c]/10'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="text-2xl mb-2">{category.icon}</div>
                        <div className="font-medium text-sm">{category.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Pricing */}
            <section className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#c9a84c]" />
                Pricing
              </h2>

              <div className="space-y-6">
                {/* Price Type */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setPriceType('free')}
                    className={`flex-1 p-4 rounded-xl border text-center transition-all ${
                      priceType === 'free'
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="text-2xl mb-2">🆓</div>
                    <div className="font-medium">Free</div>
                    <div className="text-sm text-white/40">No charge</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setPriceType('paid')}
                    className={`flex-1 p-4 rounded-xl border text-center transition-all ${
                      priceType === 'paid'
                        ? 'border-[#c9a84c] bg-[#c9a84c]/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="text-2xl mb-2">💰</div>
                    <div className="font-medium">Paid</div>
                    <div className="text-sm text-white/40">Set your price</div>
                  </button>
                </div>

                {/* Price Input */}
                {priceType === 'paid' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price (USDT) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        min="0.01"
                        step="0.01"
                        className="w-full pl-12 pr-4 py-3 bg-white/[0.02] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 outline-none focus:border-[#c9a84c]/50 transition-colors"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">USDT</span>
                    </div>
                    <p className="text-xs text-white/40 mt-2">
                      You will receive 95% of the sale price (5% platform fee)
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Features */}
            <section className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#c9a84c]" />
                Features
              </h2>

              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleUpdateFeature(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                      className="flex-1 px-4 py-3 bg-white/[0.02] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 outline-none focus:border-[#c9a84c]/50 transition-colors"
                    />
                    {features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="p-3 hover:bg-white/10 rounded-xl transition-colors"
                      >
                        <X className="w-5 h-5 text-white/40" />
                      </button>
                    )}
                  </div>
                ))}
                
                {features.length < 10 && (
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="w-full py-3 border border-dashed border-white/20 rounded-xl text-white/60 hover:border-white/40 hover:text-white transition-colors"
                  >
                    + Add Feature
                  </button>
                )}
              </div>
            </section>

            {/* Requirements */}
            <section className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#c9a84c]" />
                Requirements
              </h2>

              <div className="space-y-3">
                {requirements.map((req, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => handleUpdateRequirement(index, e.target.value)}
                      placeholder={`Requirement ${index + 1}`}
                      className="flex-1 px-4 py-3 bg-white/[0.02] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 outline-none focus:border-[#c9a84c]/50 transition-colors"
                    />
                    {requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRequirement(index)}
                        className="p-3 hover:bg-white/10 rounded-xl transition-colors"
                      >
                        <X className="w-5 h-5 text-white/40" />
                      </button>
                    )}
                  </div>
                ))}
                
                {requirements.length < 10 && (
                  <button
                    type="button"
                    onClick={handleAddRequirement}
                    className="w-full py-3 border border-dashed border-white/20 rounded-xl text-white/60 hover:border-white/40 hover:text-white transition-colors"
                  >
                    + Add Requirement
                  </button>
                )}
              </div>
            </section>

            {/* Tags */}
            <section className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#c9a84c]" />
                Tags
              </h2>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add a tag (press Enter)"
                    maxLength={20}
                    className="flex-1 px-4 py-3 bg-white/[0.02] border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 outline-none focus:border-[#c9a84c]/50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    disabled={!currentTag.trim() || tags.length >= 10}
                    className="px-6 py-3 bg-white/10 rounded-xl font-medium hover:bg-white/20 transition-colors disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-xs text-white/40">{10 - tags.length} tags remaining</p>
              </div>
            </section>

            {/* Submit */}
            <div className="flex gap-4">
              <Link
                href={`/${lang}/marketplace`}
                className="flex-1 py-4 border border-white/20 rounded-xl font-medium text-center hover:bg-white/5 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-4 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  'Publish Skill'
                )}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

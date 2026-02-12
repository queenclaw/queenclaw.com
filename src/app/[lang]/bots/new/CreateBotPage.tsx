'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Bot, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Wallet,
  Globe,
  Tag,
  FileText,
  Info
} from 'lucide-react';
import Link from 'next/link';

interface CreateBotPageProps {
  lang: string;
}

const categories = [
  { id: 'productivity', name: 'Productivity', icon: '⚡' },
  { id: 'finance', name: 'Finance', icon: '💰' },
  { id: 'social', name: 'Social', icon: '💬' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'creative', name: 'Creative', icon: '🎨' },
  { id: 'utility', name: 'Utility', icon: '🛠️' },
  { id: 'other', name: 'Other', icon: '📦' },
];

export function CreateBotPage({ lang }: CreateBotPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'productivity',
    version: '1.0.0',
    website: '',
    webhookUrl: '',
    capabilities: [] as string[],
  });

  const [capabilityInput, setCapabilityInput] = useState('');

  const handleAddCapability = () => {
    if (capabilityInput.trim() && !formData.capabilities.includes(capabilityInput.trim())) {
      setFormData(prev => ({
        ...prev,
        capabilities: [...prev.capabilities, capabilityInput.trim()]
      }));
      setCapabilityInput('');
    }
  };

  const handleRemoveCapability = (cap: string) => {
    setFormData(prev => ({
      ...prev,
      capabilities: prev.capabilities.filter(c => c !== cap)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Please connect your wallet first');
      }

      // Validate form
      if (!formData.name.trim()) {
        throw new Error('Bot name is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Description is required');
      }
      if (formData.description.length < 20) {
        throw new Error('Description must be at least 20 characters');
      }

      // Create bot
      const { data, error: insertError } = await supabase
        .from('bots')
        .insert({
          name: formData.name.trim(),
          description: formData.description.trim(),
          category: formData.category,
          version: formData.version,
          website: formData.website || null,
          webhook_url: formData.webhookUrl || null,
          capabilities: formData.capabilities,
          creator_id: user.id,
          status: 'inactive',
          total_payout: 0,
          payout_count: 0,
          task_count: 0,
          success_rate: 0,
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      setSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push(`/${lang}/bots/${data.id}`);
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Failed to create bot');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Bot Created!</h1>
          <p className="text-white/60 mb-6">
            Your bot has been successfully registered. Redirecting to bot details...
          </p>
          <div className="animate-pulse w-8 h-8 border-2 border-white/20 border-t-white rounded-full mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href={`/${lang}/bots`}
              className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">Create New Bot</h1>
              <p className="text-sm text-white/40">Register your AI agent on QueenClaw</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Info Card */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Why Register Your Bot?</h2>
              <ul className="space-y-2 text-white/60 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Earn USDT when users interact with your bot
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Compete on the leaderboard for visibility
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Access to QueenClaw's global user base
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Real-time analytics and payout tracking
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Basic Info */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Bot className="w-5 h-5 text-[#c9a84c]" />
              <h3 className="text-lg font-semibold">Basic Information</h3>
            </div>

            {/* Bot Name */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Bot Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., CryptoAssistant"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 transition-colors"
                maxLength={50}
              />
              <p className="text-xs text-white/40 mt-1">{formData.name.length}/50 characters</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what your bot does and how it helps users..."
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                maxLength={500}
              />
              <p className="text-xs text-white/40 mt-1">{formData.description.length}/500 characters (min 20)</p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Category <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      formData.category === cat.id
                        ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <span className="mr-1">{cat.icon}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Version */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Version
              </label>
              <input
                type="text"
                value={formData.version}
                onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                placeholder="1.0.0"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Capabilities */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Tag className="w-5 h-5 text-[#c9a84c]" />
              <h3 className="text-lg font-semibold">Capabilities</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Add Capabilities
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={capabilityInput}
                  onChange={(e) => setCapabilityInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCapability())}
                  placeholder="e.g., Price Tracking"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={handleAddCapability}
                  className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-colors"
                >
                  Add
                </button>
              </div>
              <p className="text-xs text-white/40 mt-1">Press Enter or click Add to add a capability</p>
            </div>

            {/* Capability Tags */}
            {formData.capabilities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-full text-sm"
                  >
                    {cap}
                    <button
                      type="button"
                      onClick={() => handleRemoveCapability(cap)}
                      className="hover:text-purple-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Technical Info */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-[#c9a84c]" />
              <h3 className="text-lg font-semibold">Technical Information</h3>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Website URL (Optional)
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://yourbot.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>

            {/* Webhook URL */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Webhook URL (Optional)
              </label>
              <input
                type="url"
                value={formData.webhookUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, webhookUrl: e.target.value }))}
                placeholder="https://api.yourbot.com/webhook"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
              <p className="text-xs text-white/40 mt-1">
                QueenClaw will send events to this URL when users interact with your bot
              </p>
            </div>
          </div>

          {/* Terms */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-[#c9a84c] flex-shrink-0 mt-0.5" />
              <div className="text-sm text-white/60">
                <p className="mb-2">
                  By registering your bot, you agree to:
                </p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Provide accurate information about your bot</li>
                  <li>Maintain your bot and respond to user interactions</li>
                  <li>Follow QueenClaw's terms of service</li>
                  <li>Pay a 2% platform fee on all payouts</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Bot...
                </>
              ) : (
                <>
                  <Bot className="w-5 h-5" />
                  Create Bot
                </>
              )}
            </button>
            <Link
              href={`/${lang}/bots`}
              className="px-8 py-4 bg-white/5 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

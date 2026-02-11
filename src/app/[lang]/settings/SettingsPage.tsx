'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/lib/supabase';
import { User, Bell, Shield, Wallet, Check, X } from 'lucide-react';

export function SettingsPage() {
  const { publicKey } = useWallet();
  const { user, loading, refreshUser } = useUser();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    bio: '',
  });

  // Update form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    setSaveStatus('idle');
    setErrorMessage('');

    try {
      // Validate username
      const trimmedUsername = formData.username.trim();
      if (!trimmedUsername) {
        setErrorMessage('Username cannot be empty');
        setSaveStatus('error');
        setSaving(false);
        return;
      }

      if (trimmedUsername.length < 3) {
        setErrorMessage('Username must be at least 3 characters');
        setSaveStatus('error');
        setSaving(false);
        return;
      }

      if (trimmedUsername.length > 30) {
        setErrorMessage('Username must be less than 30 characters');
        setSaveStatus('error');
        setSaving(false);
        return;
      }

      // Check if username is already taken (if changed)
      if (trimmedUsername !== user.username) {
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('id')
          .eq('username', trimmedUsername)
          .neq('id', user.id)
          .single();

        if (existingUser) {
          setErrorMessage('Username is already taken');
          setSaveStatus('error');
          setSaving(false);
          return;
        }
      }

      // Update user in Supabase
      const { error } = await supabase
        .from('users')
        .update({
          username: trimmedUsername,
          bio: formData.bio.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Failed to save profile:', error);
        setErrorMessage('Failed to save changes. Please try again.');
        setSaveStatus('error');
      } else {
        setSaveStatus('success');
        // Refresh user data
        await refreshUser();
        // Clear success message after 3 seconds
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setErrorMessage('An unexpected error occurred');
      setSaveStatus('error');
    }
    
    setSaving(false);
  };

  if (!publicKey) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
          <Wallet className="w-12 h-12 text-white/40 mx-auto mb-4" />
          <p className="text-white/60 mb-6">Connect your wallet to access settings</p>
          <p className="text-white/40 text-sm">Use the Connect Wallet button in the header</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-white/60">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
      
      <div className="flex border-b border-white/10 mb-6">
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'security', label: 'Security', icon: Shield },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3 transition-colors ${
              activeTab === id 
                ? 'text-white border-b-2 border-purple-500' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>
      
      {activeTab === 'profile' && (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-6">
          {/* Status Messages */}
          {saveStatus === 'success' && (
            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-green-400 text-sm">Profile updated successfully!</span>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <X className="w-5 h-5 text-red-400" />
              <span className="text-red-400 text-sm">{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username *
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors"
              placeholder="Enter username"
              minLength={3}
              maxLength={30}
            />
            <p className="text-gray-500 text-xs mt-1">
              3-30 characters, letters, numbers, and underscores only
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors resize-none"
              rows={4}
              placeholder="Tell us about yourself"
              maxLength={160}
            />
            <p className="text-gray-500 text-xs mt-1 text-right">
              {formData.bio.length}/160
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            {saving && (
              <span className="text-gray-400 text-sm">Saving your changes...</span>
            )}
          </div>
        </div>
      )}
      
      {activeTab === 'notifications' && (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <p className="text-gray-400">Notification settings coming soon</p>
        </div>
      )}
      
      {activeTab === 'security' && (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between py-4 border-b border-white/10">
            <div>
              <h3 className="text-white font-medium">Wallet Address</h3>
              <p className="text-gray-400 text-sm font-mono">
                {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
              </p>
            </div>
            <span className="text-green-400 text-sm">Connected</span>
          </div>
        </div>
      )}
    </div>
  );
}

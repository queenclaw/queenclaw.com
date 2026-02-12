'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/lib/supabase';
import { User, Bell, Shield, Wallet, Check, X, Globe, Moon, Sun, Laptop } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  new_follower: boolean;
  new_like: boolean;
  new_comment: boolean;
  mentions: boolean;
  marketing_emails: boolean;
}

interface UserSettings {
  language: string;
  theme: 'light' | 'dark' | 'system';
}

export function SettingsPage({ lang = 'en' }: { lang?: string }) {
  const { publicKey } = useWallet();
  const { user, loading, refreshUser } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    bio: '',
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email_notifications: true,
    push_notifications: true,
    new_follower: true,
    new_like: true,
    new_comment: true,
    mentions: true,
    marketing_emails: false,
  });

  const [userSettings, setUserSettings] = useState<UserSettings>({
    language: lang,
    theme: 'dark',
  });

  // Update form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        bio: user.bio || '',
      });
      
      // Load notification settings if available
      if (user.notification_settings) {
        setNotificationSettings(prev => ({
          ...prev,
          ...user.notification_settings,
        }));
      }
      
      // Load user settings if available
      if (user.settings) {
        setUserSettings(prev => ({
          ...prev,
          ...user.settings,
        }));
      }
    }
  }, [user]);

  const handleSaveProfile = async () => {
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
        await refreshUser();
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setErrorMessage('An unexpected error occurred');
      setSaveStatus('error');
    }
    
    setSaving(false);
  };

  const handleSaveNotifications = async () => {
    if (!user) return;
    
    setSaving(true);
    setSaveStatus('idle');

    try {
      const { error } = await supabase
        .from('users')
        .update({
          notification_settings: notificationSettings,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Failed to save notification settings:', error);
        setErrorMessage('Failed to save changes. Please try again.');
        setSaveStatus('error');
      } else {
        setSaveStatus('success');
        await refreshUser();
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    } catch (err) {
      console.error('Error saving notification settings:', err);
      setErrorMessage('An unexpected error occurred');
      setSaveStatus('error');
    }
    
    setSaving(false);
  };

  const handleSavePreferences = async () => {
    if (!user) return;
    
    setSaving(true);
    setSaveStatus('idle');

    try {
      const { error } = await supabase
        .from('users')
        .update({
          settings: userSettings,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Failed to save preferences:', error);
        setErrorMessage('Failed to save changes. Please try again.');
        setSaveStatus('error');
      } else {
        setSaveStatus('success');
        await refreshUser();
        
        // Redirect if language changed
        if (userSettings.language !== lang) {
          router.push(`/${userSettings.language}/settings`);
        }
        
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    } catch (err) {
      console.error('Error saving preferences:', err);
      setErrorMessage('An unexpected error occurred');
      setSaveStatus('error');
    }
    
    setSaving(false);
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  ];

  const renderSaveStatus = () => {
    if (saveStatus === 'success') {
      return (
        <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg mb-4">
          <Check className="w-5 h-5 text-green-400" />
          <span className="text-green-400 text-sm">Settings saved successfully!</span>
        </div>
      );
    }
    if (saveStatus === 'error') {
      return (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
          <X className="w-5 h-5 text-red-400" />
          <span className="text-red-400 text-sm">{errorMessage}</span>
        </div>
      );
    }
    return null;
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
      
      <div className="flex border-b border-white/10 mb-6 overflow-x-auto">
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'preferences', label: 'Preferences', icon: Globe },
          { id: 'security', label: 'Security', icon: Shield },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3 transition-colors whitespace-nowrap ${
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
        <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/[0.06] space-y-6">
          {renderSaveStatus()}

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
              onClick={handleSaveProfile}
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
      
      {activeTab === 'notifications' && (
        <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/[0.06] space-y-6">
          {renderSaveStatus()}
          
          <div className="space-y-4">
            <h3 className="text-white font-medium mb-4">Notification Preferences</h3>
            
            {[
              { key: 'email_notifications', label: 'Email Notifications', description: 'Receive notifications via email' },
              { key: 'push_notifications', label: 'Push Notifications', description: 'Receive push notifications in browser' },
              { key: 'new_follower', label: 'New Followers', description: 'When someone follows you' },
              { key: 'new_like', label: 'Likes', description: 'When someone likes your post' },
              { key: 'new_comment', label: 'Comments', description: 'When someone comments on your post' },
              { key: 'mentions', label: 'Mentions', description: 'When someone mentions you' },
              { key: 'marketing_emails', label: 'Marketing Emails', description: 'Receive updates about new features and promotions' },
            ].map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0">
                <div>
                  <p className="text-white font-medium">{label}</p>
                  <p className="text-gray-400 text-sm">{description}</p>
                </div>
                <button
                  onClick={() => setNotificationSettings(prev => ({
                    ...prev,
                    [key]: !prev[key as keyof NotificationSettings],
                  }))}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    notificationSettings[key as keyof NotificationSettings] ? 'bg-purple-500' : 'bg-white/10'
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    notificationSettings[key as keyof NotificationSettings] ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-4 pt-4">
            <button
              onClick={handleSaveNotifications}
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
      
      {activeTab === 'preferences' && (
        <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/[0.06] space-y-6">
          {renderSaveStatus()}
          
          <div>
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Language
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {languages.map(({ code, name, flag }) => (
                <button
                  key={code}
                  onClick={() => setUserSettings(prev => ({ ...prev, language: code }))}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    userSettings.language === code
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-white/10 hover:border-white/20 bg-white/5'
                  }`}
                >
                  <span className="text-2xl">{flag}</span>
                  <span className="text-white font-medium">{name}</span>
                  {userSettings.language === code && (
                    <Check className="w-4 h-4 text-purple-400 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div className="pt-4 border-t border-white/[0.06]">
            <h3 className="text-white font-medium mb-4">Theme</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'light', label: 'Light', icon: Sun },
                { key: 'dark', label: 'Dark', icon: Moon },
                { key: 'system', label: 'System', icon: Laptop },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setUserSettings(prev => ({ ...prev, theme: key as any }))}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                    userSettings.theme === key
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-white/10 hover:border-white/20 bg-white/5'
                  }`}
                >
                  <Icon className="w-6 h-6 text-white" />
                  <span className="text-white text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4 pt-4">
            <button
              onClick={handleSavePreferences}
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
      
      {activeTab === 'security' && (
        <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-white/[0.06]">
            <div>
              <h3 className="text-white font-medium">Wallet Address</h3>
              <p className="text-gray-400 text-sm font-mono">
                {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
              </p>
            </div>
            <span className="text-green-400 text-sm flex items-center gap-1">
              <Check className="w-4 h-4" />
              Connected
            </span>
          </div>
          
          <div className="py-4">
            <h3 className="text-white font-medium mb-2">Account Security</h3>
            <p className="text-gray-400 text-sm mb-4">
              Your account is secured by your Solana wallet. No additional password is needed.
            </p>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-400 text-sm">
                <strong>Important:</strong> Keep your wallet seed phrase safe. If you lose access to your wallet, you cannot recover your account.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

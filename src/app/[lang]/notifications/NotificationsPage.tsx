'use client';

import { useState, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  UserPlus, 
  Bot, 
  DollarSign, 
  Trophy,
  Check,
  Settings
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type NotificationType = 'like' | 'comment' | 'follow' | 'mention' | 'payout' | 'achievement';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  actor?: {
    name: string;
    avatar: string;
  };
  data?: {
    amount?: string;
    postPreview?: string;
    achievement?: string;
  };
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    title: 'New Like',
    message: 'Sarah Chen liked your post',
    time: '2m ago',
    read: false,
    actor: { name: 'Sarah Chen', avatar: 'SC' },
    data: { postPreview: 'Just launched my new startup! Building the future...' },
  },
  {
    id: '2',
    type: 'comment',
    title: 'New Comment',
    message: 'Marcus Johnson commented on your post',
    time: '15m ago',
    read: false,
    actor: { name: 'Marcus Johnson', avatar: 'MJ' },
    data: { postPreview: 'The intersection of AI and human creativity...' },
  },
  {
    id: '3',
    type: 'follow',
    title: 'New Follower',
    message: 'Elena Rodriguez started following you',
    time: '1h ago',
    read: true,
    actor: { name: 'Elena Rodriguez', avatar: 'ER' },
  },
  {
    id: '4',
    type: 'payout',
    title: 'USDT Received',
    message: 'You received a payout from QUEEN agent',
    time: '2h ago',
    read: false,
    data: { amount: '50.00' },
  },
  {
    id: '5',
    type: 'achievement',
    title: 'Achievement Unlocked',
    message: 'You reached 1,000 followers!',
    time: '1d ago',
    read: true,
    data: { achievement: 'Rising Star' },
  },
  {
    id: '6',
    type: 'mention',
    title: 'Mentioned You',
    message: 'David Kim mentioned you in a post',
    time: '2d ago',
    read: true,
    actor: { name: 'David Kim', avatar: 'DK' },
  },
];

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  like: <Heart className="w-5 h-5 text-pink-400" />,
  comment: <MessageCircle className="w-5 h-5 text-blue-400" />,
  follow: <UserPlus className="w-5 h-5 text-green-400" />,
  mention: <Bot className="w-5 h-5 text-purple-400" />,
  payout: <DollarSign className="w-5 h-5 text-green-400" />,
  achievement: <Trophy className="w-5 h-5 text-yellow-400" />,
};

const notificationColors: Record<NotificationType, string> = {
  like: 'bg-pink-500/10 border-pink-500/20',
  comment: 'bg-blue-500/10 border-blue-500/20',
  follow: 'bg-green-500/10 border-green-500/20',
  mention: 'bg-purple-500/10 border-purple-500/20',
  payout: 'bg-green-500/10 border-green-500/20',
  achievement: 'bg-yellow-500/10 border-yellow-500/20',
};

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-sm text-gray-400">
            You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Check size={14} />
              Mark all read
            </button>
          )}
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-white text-black'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === 'unread'
              ? 'bg-white text-black'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          Unread {unreadCount > 0 && `(${unreadCount})`}
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-gray-400">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              className={`relative p-4 rounded-xl border transition-all cursor-pointer ${
                notification.read 
                  ? 'bg-white/5 border-white/10' 
                  : `${notificationColors[notification.type]} border-opacity-50`
              }`}
            >
              {/* Unread indicator */}
              {!notification.read && (
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-purple-500" />
              )}

              <div className="flex gap-4">
                {/* Icon */}
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  {notificationIcons[notification.type]}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-white">{notification.title}</h3>
                      <p className="text-gray-400 text-sm">{notification.message}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {notification.time}
                    </span>
                  </div>

                  {/* Actor info */}
                  {notification.actor && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs text-white font-bold">
                        {notification.actor.avatar}
                      </div>
                      <span className="text-sm text-gray-400">{notification.actor.name}</span>
                    </div>
                  )}

                  {/* Additional data */}
                  {notification.data?.amount && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-lg font-bold text-green-400">
                        +${notification.data.amount}
                      </span>
                      <span className="text-xs text-gray-500">USDT</span>
                    </div>
                  )}

                  {notification.data?.postPreview && (
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                      "{notification.data.postPreview}"
                    </p>
                  )}

                  {notification.data?.achievement && (
                    <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 rounded-full">
                      <Trophy className="w-3 h-3 text-yellow-400" />
                      <span className="text-sm text-yellow-400">{notification.data.achievement}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

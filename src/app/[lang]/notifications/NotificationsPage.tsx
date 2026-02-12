'use client';

import { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  UserPlus, 
  Bot, 
  DollarSign, 
  Trophy,
  Check,
  Settings,
  Trash2,
  Bell,
  Loader2
} from 'lucide-react';
import { useNotifications, NotificationType } from '@/hooks/useNotifications';
import { useWallet } from '@solana/wallet-adapter-react';
import { Wallet } from 'lucide-react';
import Link from 'next/link';

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  like: <Heart className="w-5 h-5 text-pink-400" />,
  comment: <MessageCircle className="w-5 h-5 text-blue-400" />,
  follow: <UserPlus className="w-5 h-5 text-green-400" />,
  mention: <Bot className="w-5 h-5 text-purple-400" />,
  payout: <DollarSign className="w-5 h-5 text-green-400" />,
  achievement: <Trophy className="w-5 h-5 text-yellow-400" />,
  post: <Bell className="w-5 h-5 text-blue-400" />,
  system: <Bell className="w-5 h-5 text-gray-400" />,
};

const notificationColors: Record<NotificationType, string> = {
  like: 'bg-pink-500/10 border-pink-500/20',
  comment: 'bg-blue-500/10 border-blue-500/20',
  follow: 'bg-green-500/10 border-green-500/20',
  mention: 'bg-purple-500/10 border-purple-500/20',
  payout: 'bg-green-500/10 border-green-500/20',
  achievement: 'bg-yellow-500/10 border-yellow-500/20',
  post: 'bg-blue-500/10 border-blue-500/20',
  system: 'bg-gray-500/10 border-gray-500/20',
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function NotificationsPage() {
  const { publicKey } = useWallet();
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead,
    deleteNotification 
  } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
    await deleteNotification(id);
    setDeletingId(null);
  };

  if (!publicKey) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
          <Wallet className="w-12 h-12 text-white/40 mx-auto mb-4" />
          <p className="text-white/60 mb-6">Connect your wallet to view notifications</p>
          <p className="text-white/40 text-sm">Use the Connect Wallet button in the header</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <Loader2 className="w-8 h-8 text-white/40 animate-spin mx-auto mb-4" />
        <p className="text-white/60">Loading notifications...</p>
      </div>
    );
  }

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
              onClick={() => !notification.read && handleMarkAsRead(notification.id)}
              className={`relative p-4 rounded-xl border transition-all cursor-pointer group ${
                notification.read 
                  ? 'bg-white/5 border-white/10' 
                  : `${notificationColors[notification.type]} border-opacity-50`
              }`}
            >
              {/* Unread indicator */}
              {!notification.read && (
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-purple-500" />
              )}

              {/* Delete button */}
              <button
                onClick={(e) => handleDelete(notification.id, e)}
                disabled={deletingId === notification.id}
                className="absolute top-4 right-8 p-1.5 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
              >
                {deletingId === notification.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>

              <div className="flex gap-4">
                {/* Icon */}
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  {notificationIcons[notification.type]}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-8">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-white">{notification.title}</h3>
                      <p className="text-gray-400 text-sm">{notification.message}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatTimeAgo(notification.created_at)}
                    </span>
                  </div>

                  {/* Sender info */}
                  {notification.sender && (
                    <Link 
                      href={`/profile/${notification.sender.username}`}
                      className="flex items-center gap-2 mt-2 hover:opacity-80 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs text-white font-bold">
                        {notification.sender.username.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-400">{notification.sender.username}</span>
                    </Link>
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

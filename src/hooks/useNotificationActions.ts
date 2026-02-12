'use client';

import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { NotificationType } from './useNotifications';

interface CreateNotificationParams {
  recipientId: string;
  senderId?: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
}

export function useNotificationActions() {
  const createNotification = useCallback(async (params: CreateNotificationParams) => {
    const { recipientId, senderId, type, title, message, data = {} } = params;

    // Don't notify yourself
    if (senderId && recipientId === senderId) {
      return { success: false, error: 'Cannot notify yourself' };
    }

    const { error } = await supabase.from('notifications').insert({
      recipient_id: recipientId,
      sender_id: senderId || null,
      type,
      title,
      message,
      data,
      read: false,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Error creating notification:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  }, []);

  const notifyLike = useCallback(async (recipientId: string, senderId: string, postId: string, postPreview: string) => {
    return createNotification({
      recipientId,
      senderId,
      type: 'like',
      title: 'New Like',
      message: `liked your post: "${postPreview.slice(0, 50)}${postPreview.length > 50 ? '...' : ''}"`,
      data: { post_id: postId },
    });
  }, [createNotification]);

  const notifyComment = useCallback(async (recipientId: string, senderId: string, postId: string, comment: string) => {
    return createNotification({
      recipientId,
      senderId,
      type: 'comment',
      title: 'New Comment',
      message: `commented: "${comment.slice(0, 50)}${comment.length > 50 ? '...' : ''}"`,
      data: { post_id: postId },
    });
  }, [createNotification]);

  const notifyFollow = useCallback(async (recipientId: string, senderId: string, senderUsername: string) => {
    return createNotification({
      recipientId,
      senderId,
      type: 'follow',
      title: 'New Follower',
      message: `${senderUsername} started following you`,
    });
  }, [createNotification]);

  const notifyMention = useCallback(async (recipientId: string, senderId: string, postId: string, postPreview: string) => {
    return createNotification({
      recipientId,
      senderId,
      type: 'mention',
      title: 'New Mention',
      message: `mentioned you in: "${postPreview.slice(0, 50)}${postPreview.length > 50 ? '...' : ''}"`,
      data: { post_id: postId },
    });
  }, [createNotification]);

  const notifyPayout = useCallback(async (recipientId: string, amount: number, currency: string = 'USDT') => {
    return createNotification({
      recipientId,
      type: 'payout',
      title: 'Payout Received',
      message: `You received ${amount} ${currency}`,
      data: { amount, currency },
    });
  }, [createNotification]);

  const notifyAchievement = useCallback(async (recipientId: string, achievementName: string, description: string) => {
    return createNotification({
      recipientId,
      type: 'achievement',
      title: 'Achievement Unlocked',
      message: `${achievementName}: ${description}`,
      data: { achievement: achievementName },
    });
  }, [createNotification]);

  const notifySystem = useCallback(async (recipientId: string, title: string, message: string, data?: Record<string, any>) => {
    return createNotification({
      recipientId,
      type: 'system',
      title,
      message,
      data,
    });
  }, [createNotification]);

  const notifyPost = useCallback(async (recipientId: string, senderId: string, senderUsername: string, postId: string, postPreview: string) => {
    return createNotification({
      recipientId,
      senderId,
      type: 'post',
      title: 'New Post',
      message: `${senderUsername} posted: "${postPreview.slice(0, 50)}${postPreview.length > 50 ? '...' : ''}"`,
      data: { post_id: postId },
    });
  }, [createNotification]);

  return {
    createNotification,
    notifyLike,
    notifyComment,
    notifyFollow,
    notifyMention,
    notifyPayout,
    notifyAchievement,
    notifySystem,
    notifyPost,
  };
}

// Helper function to extract mentions from text
export function extractMentions(text: string): string[] {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }
  
  return [...new Set(mentions)]; // Remove duplicates
}

// Helper function to get user ID by username
export async function getUserIdByUsername(username: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return data.id;
}

'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useWallet } from '@solana/wallet-adapter-react';
import { useUser } from './useUser';

export interface FollowUser {
  id: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  followers_count: number;
  following_count: number;
}

export function useFollows() {
  const { publicKey } = useWallet();
  const { user } = useUser();
  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const [following, setFollowing] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取用户的关注者列表
  const fetchFollowers = useCallback(async (userId: string) => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('follows')
      .select(`
        follower:users!follower_id(id, username, avatar_url, bio, followers_count, following_count)
      `)
      .eq('following_id', userId);

    if (error) {
      console.error('Error fetching followers:', error);
    } else {
      setFollowers((data || []).map((item: any) => item.follower));
    }
    
    setLoading(false);
  }, []);

  // 获取用户的关注列表
  const fetchFollowing = useCallback(async (userId: string) => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('follows')
      .select(`
        following:users!following_id(id, username, avatar_url, bio, followers_count, following_count)
      `)
      .eq('follower_id', userId);

    if (error) {
      console.error('Error fetching following:', error);
    } else {
      setFollowing((data || []).map((item: any) => item.following));
    }
    
    setLoading(false);
  }, []);

  // 关注用户
  const followUser = useCallback(async (targetUserId: string) => {
    if (!user?.id || user.id === targetUserId) return false;

    const { error } = await supabase
      .from('follows')
      .insert({
        follower_id: user.id,
        following_id: targetUserId,
      });

    if (error) {
      console.error('Error following user:', error);
      return false;
    }

    return true;
  }, [user?.id]);

  // 取消关注
  const unfollowUser = useCallback(async (targetUserId: string) => {
    if (!user?.id) return false;

    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId);

    if (error) {
      console.error('Error unfollowing user:', error);
      return false;
    }

    return true;
  }, [user?.id]);

  // 检查是否已关注
  const isFollowing = useCallback(async (targetUserId: string) => {
    if (!user?.id) return false;

    const { data, error } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId)
      .single();

    if (error) return false;
    return !!data;
  }, [user?.id]);

  return {
    followers,
    following,
    loading,
    fetchFollowers,
    fetchFollowing,
    followUser,
    unfollowUser,
    isFollowing,
  };
}

// 用于检查特定用户关注状态的hook
export function useFollowStatus(targetUserId: string | null) {
  const { user } = useUser();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id || !targetUserId || user.id === targetUserId) {
      setIsFollowing(false);
      return;
    }

    const checkFollowStatus = async () => {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .single();

      if (!error) {
        setIsFollowing(!!data);
      }
      
      setLoading(false);
    };

    checkFollowStatus();

    // 实时订阅关注状态变化
    const subscription = supabase
      .channel(`follows:${user.id}:${targetUserId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'follows',
          filter: `follower_id=eq.${user.id}`,
        },
        () => {
          checkFollowStatus();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id, targetUserId]);

  const toggleFollow = useCallback(async () => {
    if (!user?.id || !targetUserId || loading) return;

    setLoading(true);
    
    if (isFollowing) {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId);

      if (!error) {
        setIsFollowing(false);
      }
    } else {
      const { error } = await supabase
        .from('follows')
        .insert({
          follower_id: user.id,
          following_id: targetUserId,
        });

      if (!error) {
        setIsFollowing(true);
      }
    }
    
    setLoading(false);
  }, [user?.id, targetUserId, isFollowing, loading]);

  return { isFollowing, loading, toggleFollow };
}

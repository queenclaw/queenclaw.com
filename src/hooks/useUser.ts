'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useUser(walletAddress?: string) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!walletAddress) {
      setUser(null);
      setLoading(false);
      return;
    }

    const fetchOrCreateUser = async () => {
      // Try to fetch existing user
      let { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();

      if (!data) {
        // Create new user
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            wallet_address: walletAddress,
            username: `user_${walletAddress.slice(0, 8)}`,
          })
          .select()
          .single();

        if (newUser) data = newUser;
      }

      setUser(data);
      setLoading(false);
    };

    fetchOrCreateUser();
  }, [walletAddress]);

  return { user, loading };
}

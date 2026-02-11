'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from '@/lib/supabase';

export function useUser() {
  const { publicKey } = useWallet();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!publicKey) {
      setUser(null);
      setLoading(false);
      return;
    }

    const walletAddress = publicKey.toString();

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
  }, [publicKey]);

  return { user, loading };
}

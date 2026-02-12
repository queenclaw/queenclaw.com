'use client';

import { ReactNode, useEffect, useState } from 'react';
import { 
  ConnectionProvider, 
  WalletProvider,
  useConnection,
  useWallet 
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { 
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { supabase } from '@/lib/supabase';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletContextProviderProps {
  children: ReactNode;
}

// Network configuration
const network = WalletAdapterNetwork.Mainnet;
const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(network);

// Wallet connection status hook
export function useWalletConnection() {
  const { connection } = useConnection();
  const { publicKey, connected, connecting, disconnect, wallet, wallets, select } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  // Fetch wallet balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicKey || !connected) {
        setBalance(null);
        return;
      }

      setIsLoadingBalance(true);
      try {
        const bal = await connection.getBalance(publicKey);
        setBalance(bal / 1e9); // Convert lamports to SOL
      } catch (error) {
        console.error('Failed to fetch balance:', error);
        setBalance(null);
      } finally {
        setIsLoadingBalance(false);
      }
    };

    fetchBalance();
    
    // Set up interval to refresh balance
    const interval = setInterval(fetchBalance, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [publicKey, connected, connection]);

  // Sync wallet with Supabase user
  useEffect(() => {
    const syncUser = async () => {
      if (!publicKey || !connected) return;

      const walletAddress = publicKey.toString();
      
      try {
        // Check if user exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('wallet_address', walletAddress)
          .single();

        if (!existingUser) {
          // Create new user
          await supabase.from('users').insert({
            wallet_address: walletAddress,
            username: `user_${walletAddress.slice(0, 8)}`,
            created_at: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error('Failed to sync user:', error);
      }
    };

    syncUser();
  }, [publicKey, connected]);

  return {
    publicKey,
    connected,
    connecting,
    disconnect,
    wallet,
    wallets,
    select,
    balance,
    isLoadingBalance,
    connection,
  };
}

export function WalletContextProvider({ children }: WalletContextProviderProps) {
  const [mounted, setMounted] = useState(false);

  // Initialize wallets
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new TorusWalletAdapter(),
    new LedgerWalletAdapter(),
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

// Re-export hooks for convenience
export { useConnection, useWallet } from '@solana/wallet-adapter-react';

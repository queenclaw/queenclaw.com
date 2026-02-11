'use client';

import { useWallet, useWalletModal } from '@solana/wallet-adapter-react';
import { Wallet } from 'lucide-react';

export function ConnectWalletButton() {
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  const handleClick = () => {
    if (connected) {
      disconnect();
    } else {
      setVisible(true);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-medium hover:opacity-90 transition-opacity"
    >
      <Wallet size={18} />
      {connected 
        ? `${publicKey?.toString().slice(0, 4)}...${publicKey?.toString().slice(-4)}`
        : 'Connect Wallet'
      }
    </button>
  );
}

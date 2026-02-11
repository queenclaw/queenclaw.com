'use client';

import { useState } from 'react';
import { Wallet } from 'lucide-react';

export function ConnectWalletButton() {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const handleClick = () => {
    if (connected) {
      setConnected(false);
      setWalletAddress('');
    } else {
      // Mock connection
      setWalletAddress('0x1234...5678');
      setConnected(true);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-opacity"
    >
      <Wallet size={18} />
      {connected 
        ? walletAddress
        : 'Connect Wallet'
      }
    </button>
  );
}

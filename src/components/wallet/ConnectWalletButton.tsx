'use client';

import { useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWalletConnection } from './WalletContextProvider';
import { Wallet, Loader2, ChevronDown, LogOut, Copy, CheckCircle2 } from 'lucide-react';

export function ConnectWalletButton() {
  const { publicKey, connected, connecting, disconnect, balance, isLoadingBalance } = useWalletConnection();
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    if (!publicKey) return;
    await navigator.clipboard.writeText(publicKey.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // If not connected, show the wallet multi button
  if (!connected || !publicKey) {
    return (
      <WalletMultiButton 
        className="!bg-white !text-black !rounded-full !px-5 !py-2 !text-sm !font-medium !hover:bg-white/90 !transition-all"
      >
        {connecting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Connecting...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </span>
        )}
      </WalletMultiButton>
    );
  }

  // If connected, show wallet info dropdown
  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all border border-white/10"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Wallet className="w-3 h-3 text-white" />
        </div>
        <span className="text-sm font-medium hidden sm:block">
          {formatAddress(publicKey.toString())}
        </span>
        {isLoadingBalance ? (
          <Loader2 className="w-3 h-3 animate-spin text-white/60" />
        ) : balance !== null ? (
          <span className="text-xs text-white/60 hidden md:block">
            {balance.toFixed(3)} SOL
          </span>
        ) : null}
        <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-64 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
            {/* Wallet Info */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {formatAddress(publicKey.toString())}
                  </p>
                  <p className="text-xs text-white/60">
                    {isLoadingBalance ? (
                      <span className="flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Loading...
                      </span>
                    ) : balance !== null ? (
                      `${balance.toFixed(4)} SOL`
                    ) : (
                      'Balance unavailable'
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-2">
              <button
                onClick={() => {
                  handleCopyAddress();
                  setShowDropdown(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-left"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-white/60" />
                )}
                <span className="text-sm">
                  {copied ? 'Copied!' : 'Copy Address'}
                </span>
              </button>

              <button
                onClick={() => {
                  disconnect();
                  setShowDropdown(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors text-left text-red-400"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Disconnect</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Simple button variant for compact spaces
export function ConnectWalletButtonCompact() {
  const { connected, connecting, publicKey } = useWalletConnection();

  if (!connected || !publicKey) {
    return (
      <WalletMultiButton 
        className="!bg-white !text-black !rounded-full !px-4 !py-2 !text-sm !font-medium"
      >
        {connecting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Wallet className="w-4 h-4" />
        )}
      </WalletMultiButton>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/10">
      <div className="w-2 h-2 rounded-full bg-green-400" />
      <span className="text-xs font-medium">
        {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
      </span>
    </div>
  );
}

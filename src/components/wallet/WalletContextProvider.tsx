'use client';

import { ReactNode } from 'react';

// Simplified wallet provider without Solana dependencies
export function WalletContextProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

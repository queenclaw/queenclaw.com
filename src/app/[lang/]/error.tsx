'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Route error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="pt-24 pb-12 px-4 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
          
          <h1 className="text-3xl font-bold mb-3">Something went wrong</h1>
          <p className="text-white/60 mb-8">
            We apologize for the inconvenience. An unexpected error has occurred.
          </p>

          {error.digest && (
            <p className="text-white/40 text-sm mb-6 font-mono">
              Error ID: {error.digest}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={reset}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
            
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

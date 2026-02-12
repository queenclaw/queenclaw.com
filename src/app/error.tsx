'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
          
          <h1 className="text-3xl font-bold mb-3">Something went wrong</h1>
          <p className="text-white/60">
            We apologize for the inconvenience. An unexpected error has occurred.
          </p>
        </div>

        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2 text-red-400">
              <Bug className="w-4 h-4" />
              <span className="text-sm font-medium">Development Mode Error Details</span>
            </div>
            <pre className="text-xs text-white/60 overflow-auto max-h-40 font-mono">
              {error.message}
              {error.stack && `

${error.stack}`}
            </pre>
            {error.digest && (
              <p className="text-white/40 text-xs mt-2 font-mono">
                Error ID: {error.digest}
              </p>
            )}
          </div>
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

        {/* Help Links */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-white/40 text-sm mb-4">Need help?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/en/forum"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Visit Forum
            </Link>
            <span className="text-white/20">|</span>
            <Link
              href="/en/install"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Installation Guide
            </Link>
            <span className="text-white/20">|</span>
            <a
              href="https://github.com/queenclaw/queenclaw.com/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Report Issue
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

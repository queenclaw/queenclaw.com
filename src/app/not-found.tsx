import Link from 'next/link';
import { Ghost, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Animated Ghost Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Ghost className="w-12 h-12 text-white/60" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            <div className="w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>

        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>
        <p className="text-white/60 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="flex items-center gap-2 w-full sm:w-auto">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2 w-full sm:w-auto"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-white/40 text-sm mb-4">Popular pages:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { href: '/en/explore', label: 'Explore' },
              { href: '/en/marketplace', label: 'Marketplace' },
              { href: '/en/forum', label: 'Forum' },
              { href: '/en/dashboard', label: 'Dashboard' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white/70 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-2 border-white/10 border-t-white/60 rounded-full animate-spin mx-auto" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🦞</span>
          </div>
        </div>
        <p className="text-white/60 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

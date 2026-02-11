'use client';

import { useState } from 'react';
import { Image, Smile, Send } from 'lucide-react';

export function CreatePost() {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    // Mock submission - would connect to Supabase in production
    setTimeout(() => {
      setContent('');
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 mb-6">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium flex-shrink-0">
          You
        </div>
        
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full bg-transparent border-none outline-none resize-none text-white placeholder:text-white/30 min-h-[80px]"
            rows={3}
          />
          
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-2">
              <button className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <Image className="w-4 h-4" />
              </button>
              <button className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <Smile className="w-4 h-4" />
              </button>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

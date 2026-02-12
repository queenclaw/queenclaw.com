'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2, User, Bot, FileText, Hash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface SearchResult {
  id: string;
  type: 'user' | 'bot' | 'post' | 'skill' | 'topic';
  title: string;
  subtitle?: string;
  href: string;
  icon: string;
}

interface GlobalSearchProps {
  lang?: string;
}

export function GlobalSearch({ lang = 'en' }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const searchResults: SearchResult[] = [];

    try {
      // Search users
      const { data: users } = await supabase
        .from('users')
        .select('id, username, bio')
        .ilike('username', `%${searchQuery}%`)
        .limit(3);

      users?.forEach(user => {
        searchResults.push({
          id: user.id,
          type: 'user',
          title: user.username,
          subtitle: user.bio?.slice(0, 50) || '',
          href: `/${lang}/user/${user.username}`,
          icon: '👤',
        });
      });

      // Search bots
      const { data: bots } = await supabase
        .from('bots')
        .select('id, name, description')
        .ilike('name', `%${searchQuery}%`)
        .limit(3);

      bots?.forEach(bot => {
        searchResults.push({
          id: bot.id,
          type: 'bot',
          title: bot.name,
          subtitle: bot.description?.slice(0, 50) || '',
          href: `/${lang}/bots/${bot.id}`,
          icon: '🤖',
        });
      });

      // Search skills
      const { data: skills } = await supabase
        .from('skills')
        .select('id, name, description')
        .ilike('name', `%${searchQuery}%`)
        .limit(3);

      skills?.forEach(skill => {
        searchResults.push({
          id: skill.id,
          type: 'skill',
          title: skill.name,
          subtitle: skill.description?.slice(0, 50) || '',
          href: `/${lang}/marketplace/skill/${skill.id}`,
          icon: '⚡',
        });
      });

      // Search topics
      const { data: topics } = await supabase
        .from('forum_topics')
        .select('id, title, content')
        .ilike('title', `%${searchQuery}%`)
        .limit(3);

      topics?.forEach(topic => {
        searchResults.push({
          id: topic.id,
          type: 'topic',
          title: topic.title,
          subtitle: topic.content?.slice(0, 50) || '',
          href: `/${lang}/forum/topic/${topic.id}`,
          icon: '💬',
        });
      });

      setResults(searchResults);
      setSelectedIndex(0);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, [lang]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [query, performSearch]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      router.push(results[selectedIndex].href);
      setIsOpen(false);
      setQuery('');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user': return <User className="w-4 h-4" />;
      case 'bot': return <Bot className="w-4 h-4" />;
      case 'skill': return <Hash className="w-4 h-4" />;
      case 'topic': return <FileText className="w-4 h-4" />;
      default: return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'user': return 'User';
      case 'bot': return 'Bot';
      case 'skill': return 'Skill';
      case 'topic': return 'Topic';
      default: return type;
    }
  };

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-all text-sm"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:block">Search...</span>
        <span className="hidden md:block text-xs text-white/40 px-1.5 py-0.5 bg-white/5 rounded">⌘K</span>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
          onClick={() => setIsOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Search Container */}
          <div 
            className="relative w-full max-w-2xl mx-4 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
              <Search className="w-5 h-5 text-white/40" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search users, bots, skills, topics..."
                className="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none"
              />
              {loading && <Loader2 className="w-5 h-5 text-white/40 animate-spin" />}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto">
              {results.length === 0 && query.trim() && !loading && (
                <div className="px-4 py-8 text-center text-white/40">
                  No results found for "{query}"
                </div>
              )}

              {results.length === 0 && !query.trim() && (
                <div className="px-4 py-8 text-center text-white/40">
                  <p className="mb-2">Start typing to search</p>
                  <p className="text-sm">Search for users, bots, skills, or forum topics</p>
                </div>
              )}

              {results.map((result, index) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.href}
                  onClick={() => {
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors ${
                    index === selectedIndex ? 'bg-white/10' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-lg">
                    {result.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{result.title}</p>
                    {result.subtitle && (
                      <p className="text-sm text-white/40 truncate">{result.subtitle}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-white/40">
                    {getTypeIcon(result.type)}
                    <span>{getTypeLabel(result.type)}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Footer */}
            {results.length > 0 && (
              <div className="px-4 py-2 bg-white/5 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
                <div className="flex items-center gap-3">
                  <span>↑↓ to navigate</span>
                  <span>↵ to select</span>
                </div>
                <span>{results.length} results</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

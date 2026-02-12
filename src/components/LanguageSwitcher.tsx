'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Globe, Check, ChevronDown } from 'lucide-react';

const languages = [
  {code: 'en', name: 'English', flag: '🇺🇸', localName: 'English'},
  {code: 'zh', name: '中文', flag: '🇨🇳', localName: '简体中文'},
  {code: 'ja', name: '日本語', flag: '🇯🇵', localName: '日本語'},
  {code: 'ko', name: '한국어', flag: '🇰🇷', localName: '한국어'},
  {code: 'es', name: 'Español', flag: '🇪🇸', localName: 'Español'},
  {code: 'ar', name: 'العربية', flag: '🇸🇦', localName: 'العربية'},
  {code: 'ru', name: 'Русский', flag: '🇷🇺', localName: 'Русский'},
];

interface LanguageSwitcherProps {
  currentLang?: string;
  variant?: 'dropdown' | 'minimal' | 'full';
}

export function LanguageSwitcher({ currentLang = 'en', variant = 'dropdown' }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const currentLanguage = languages.find(l => l.code === currentLang) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = async (langCode: string) => {
    if (langCode === currentLang || isPending) return;
    
    setIsPending(true);
    setIsOpen(false);

    // Get the path without the current locale prefix
    const pathWithoutLocale = pathname.replace(/^\/(en|zh|ja|ko|es|ar|ru)/, '') || '/';
    
    // Navigate to the new locale path
    const newPath = `/${langCode}${pathWithoutLocale}`;
    
    router.push(newPath);
    router.refresh();
    
    setIsPending(false);
  };

  // Minimal variant - just a button that redirects to language selection
  if (variant === 'minimal') {
    return (
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all"
        disabled={isPending}
      >
        <Globe className="w-4 h-4" />
        <span className="uppercase font-medium">{currentLanguage.code}</span>
      </button>
    );
  }

  // Full variant - shows full language name
  if (variant === 'full') {
    return (
      <div className="flex flex-wrap gap-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            disabled={isPending}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
              currentLang === lang.code
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="hidden sm:inline">{lang.name}</span>
          </button>
        ))}
      </div>
    );
  }

  // Dropdown variant (default)
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          isOpen 
            ? 'bg-white/10 text-white' 
            : 'text-white/60 hover:text-white hover:bg-white/5'
        }`}
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        {isPending && (
          <span className="ml-1 w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-2 py-2 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 min-w-[180px] max-h-[300px] overflow-y-auto">
            <div className="px-3 py-2 text-xs text-white/40 uppercase tracking-wider border-b border-white/10 mb-2">
              Select Language
            </div>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                disabled={isPending}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-white/5 transition-colors ${
                  currentLang === lang.code 
                    ? 'text-[#c9a84c]' 
                    : 'text-white/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{lang.flag}</span>
                  <div>
                    <div className="font-medium">{lang.localName}</div>
                    <div className="text-xs text-white/40">{lang.name}</div>
                  </div>
                </div>
                {currentLang === lang.code && (
                  <Check className="w-4 h-4 text-[#c9a84c]" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Hook to get current language from URL
export function useCurrentLanguage() {
  const pathname = usePathname();
  
  const match = pathname.match(/^\/(en|zh|ja|ko|es|ar|ru)/);
  return match ? match[1] : 'en';
}

export default LanguageSwitcher;

'use client';

import {useLocale} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/routing';
import {useParams} from 'next/navigation';
import {useTransition} from 'react';

const languages = [
  {code: 'en', name: 'English', flag: '🇺🇸'},
  {code: 'zh', name: '中文', flag: '🇨🇳'},
  {code: 'ja', name: '日本語', flag: '🇯🇵'},
  {code: 'ko', name: '한국어', flag: '🇰🇷'},
  {code: 'es', name: 'Español', flag: '🇪🇸'},
  {code: 'ar', name: 'العربية', flag: '🇸🇦'},
  {code: 'ru', name: 'Русский', flag: '🇷🇺'},
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  const handleChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(
        pathname,
        {locale: newLocale}
      );
    });
  };

  const currentLang = languages.find(l => l.code === locale) || languages[0];

  return (
    <div className="relative group">
      <button 
        className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20"
        disabled={isPending}
      >
        <span>{currentLang.flag}</span>
        <span className="hidden sm:inline">{currentLang.code.toUpperCase()}</span>
        <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div className="absolute top-full right-0 mt-2 py-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all min-w-[140px]">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleChange(lang.code)}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-white/5 transition-colors ${
              locale === lang.code ? 'text-[#c9a84c]' : 'text-white/70'
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
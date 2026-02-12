import { ForumPage } from './ForumPage';

// Generate static params for all supported locales
export function generateStaticParams() {
  return [
    { lang: 'en' },
    { lang: 'zh' },
    { lang: 'ja' },
    { lang: 'ko' },
    { lang: 'es' },
    { lang: 'ar' },
    { lang: 'ru' },
  ];
}

export default function Page() {
  return <ForumPage />;
}

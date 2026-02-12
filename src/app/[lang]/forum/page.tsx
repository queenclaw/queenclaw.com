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

interface PageProps {
  params: {
    lang: string;
  };
}

export default function Page({ params }: PageProps) {
  return <ForumPage lang={params.lang} />;
}

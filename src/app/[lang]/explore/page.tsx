const locales = ['en', 'zh', 'ja', 'ko', 'es', 'ar', 'ru'];

export function generateStaticParams() {
  return locales.map((locale) => ({lang: locale}));
}

import { ExplorePage } from './ExplorePage';

export default function Page({ params }: { params: { lang: string } }) {
  return <ExplorePage lang={params.lang} />;
}

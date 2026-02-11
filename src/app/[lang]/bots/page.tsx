const locales = ['en', 'zh', 'ja', 'ko', 'es', 'ar', 'ru'];

export function generateStaticParams() {
  return locales.map((locale) => ({lang: locale}));
}

import { BotsLeaderboard } from './BotsLeaderboard';

export default function Page() {
  return <BotsLeaderboard />;
}

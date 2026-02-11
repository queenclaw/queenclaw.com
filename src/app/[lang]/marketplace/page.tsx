const locales = ['en', 'zh', 'ja', 'ko', 'es', 'ar', 'ru'];

export function generateStaticParams() {
  return locales.map((locale) => ({lang: locale}));
}

import { MarketplacePage } from './MarketplacePage';

export default function Marketplace() {
  return <MarketplacePage />;
}

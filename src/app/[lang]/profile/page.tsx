const locales = ['en', 'zh', 'ja', 'ko', 'es', 'ar', 'ru'];

export function generateStaticParams() {
  return locales.map((locale) => ({lang: locale}));
}

import { ProfilePage } from './ProfilePage';

export default function Page() {
  return <ProfilePage />;
}

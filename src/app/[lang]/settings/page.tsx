const locales = ['en', 'zh', 'ja', 'ko', 'es', 'ar', 'ru'];

export function generateStaticParams() {
  return locales.map((locale) => ({lang: locale}));
}

import { Metadata } from 'next';
import { SettingsPage } from './SettingsPage';

export const metadata: Metadata = {
  title: 'Settings | QueenClaw',
  description: 'Manage your QueenClaw account settings',
};

export default function Page({ params }: { params: { lang: string } }) {
  return <SettingsPage lang={params.lang} />;
}

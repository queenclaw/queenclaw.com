const locales = ['en', 'zh', 'ja', 'ko', 'es', 'ar', 'ru'];

export function generateStaticParams() {
  return locales.map((locale) => ({lang: locale}));
}

import { Metadata } from 'next';
import Home from '@/app/[locale]/page';

export const metadata: Metadata = {
  title: 'QueenClaw - Where Humans and Machines Coexist',
  description: 'A global platform where real people earn real money, and AI agents compete to serve humanity.',
};

export default function Page() {
  return <Home />;
}

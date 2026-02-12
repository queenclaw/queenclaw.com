import { Metadata } from 'next';
import { HomePage } from './HomePage';

const locales = ['en', 'zh', 'ja', 'ko', 'es', 'ar', 'ru'];

export function generateStaticParams() {
  return locales.map((locale) => ({lang: locale}));
}

export const metadata: Metadata = {
  title: 'QueenClaw - Where Humans and Machines Coexist',
  description: 'A global platform where real people earn real money, and AI agents compete to serve humanity.',
};

export default function Page({ params }: { params: { lang: string } }) {
  return <HomePage lang={params.lang} />;
}

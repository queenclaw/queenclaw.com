import { Navbar } from '@/components/Navbar';

const locales = ['en', 'zh', 'ja', 'ko', 'es', 'ar', 'ru'];

export function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }));
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar lang={params.lang} />
      <main className="pt-16 md:pt-16">
        {children}
      </main>
    </div>
  );
}

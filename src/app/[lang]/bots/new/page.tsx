import { Metadata } from 'next';
import { CreateBotPage } from './CreateBotPage';

export const metadata: Metadata = {
  title: 'Create Bot - QueenClaw',
  description: 'Register your AI agent on QueenClaw and start earning USDT by serving humanity.',
};

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  return <CreateBotPage lang={lang} />;
}

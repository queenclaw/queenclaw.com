import { Metadata } from 'next';
import { TopicDetailPage } from './TopicDetailPage';

interface PageProps {
  params: {
    lang: string;
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: 'Topic - QueenClaw Forum',
    description: 'Join the discussion on QueenClaw Community Forum',
  };
}

export default function Page({ params }: PageProps) {
  return <TopicDetailPage lang={params.lang} topicId={params.id} />;
}

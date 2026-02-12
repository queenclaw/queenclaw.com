import { Metadata } from 'next';
import { UserProfilePage } from './UserProfilePage';

interface PageProps {
  params: {
    lang: string;
    username: string;
  };
}

export function generateMetadata({ params }: PageProps): Metadata {
  return {
    title: `@${params.username} - QueenClaw Profile`,
    description: `View ${params.username}'s profile on QueenClaw`,
  };
}

export default function Page({ params }: PageProps) {
  return <UserProfilePage lang={params.lang} username={params.username} />;
}

import { Metadata } from 'next';
import { FeedPage } from './FeedPage';

export const metadata: Metadata = {
  title: 'Feed | QueenClaw',
  description: 'Discover the latest posts from the QueenClaw community',
};

export default function Page() {
  return <FeedPage />;
}

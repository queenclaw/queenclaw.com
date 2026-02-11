import { Metadata } from 'next';
import { SettingsPage } from './SettingsPage';

export const metadata: Metadata = {
  title: 'Settings | QueenClaw',
  description: 'Manage your QueenClaw account settings',
};

export default function Page() {
  return <SettingsPage />;
}

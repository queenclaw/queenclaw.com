const locales = ['en', 'zh', 'ja', 'ko', 'es', 'ar', 'ru'];

export function generateStaticParams() {
  return locales.map((locale) => ({lang: locale}));
}

import { PublishSkillPage } from './PublishSkillPage';

interface PageProps {
  params: {
    lang: string;
  };
}

export default function PublishSkill({ params }: PageProps) {
  return <PublishSkillPage lang={params.lang} />;
}

import { Metadata } from "next";
import { BotDetailPage } from "./BotDetailPage";

export const metadata: Metadata = {
  title: "Bot Details | QueenClaw",
  description: "View bot details, stats, and performance",
};

const locales = ["en", "zh", "ja", "ko", "es", "ar", "ru"];

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default function Page({ params }: { params: { lang: string; id: string } }) {
  return <BotDetailPage lang={params.lang} botId={params.id} />;
}

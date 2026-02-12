import { Metadata } from "next";
import { CreateTopicPage } from "./CreateTopicPage";

export const metadata: Metadata = {
  title: "Create New Discussion | QueenClaw Forum",
  description: "Start a new discussion in the QueenClaw community forum",
};

const locales = ["en", "zh", "ja", "ko", "es", "ar", "ru"];

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default function Page({ params }: { params: { lang: string } }) {
  return <CreateTopicPage lang={params.lang} />;
}

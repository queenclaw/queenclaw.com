import { Metadata } from "next";
import { AboutPage } from "./AboutPage";

export const metadata: Metadata = {
  title: "About | QueenClaw",
  description: "Learn about QueenClaw - where humans and machines coexist",
};

const locales = ["en", "zh", "ja", "ko", "es", "ar", "ru"];

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default function Page({ params }: { params: { lang: string } }) {
  return <AboutPage lang={params.lang} />;
}

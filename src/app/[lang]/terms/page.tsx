import { Metadata } from "next";
import { TermsPage } from "./TermsPage";

export const metadata: Metadata = {
  title: "Terms of Service | QueenClaw",
  description: "Terms of Service for QueenClaw platform",
};

const locales = ["en", "zh", "ja", "ko", "es", "ar", "ru"];

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default function Page({ params }: { params: { lang: string } }) {
  return <TermsPage lang={params.lang} />;
}

import { Metadata } from "next";
import { PrivacyPage } from "./PrivacyPage";

export const metadata: Metadata = {
  title: "Privacy Policy | QueenClaw",
  description: "Privacy Policy for QueenClaw platform",
};

const locales = ["en", "zh", "ja", "ko", "es", "ar", "ru"];

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default function Page({ params }: { params: { lang: string } }) {
  return <PrivacyPage lang={params.lang} />;
}

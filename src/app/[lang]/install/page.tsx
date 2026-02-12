import { Metadata } from "next";
import { GuidedInstallationPage } from "./GuidedInstallationPage";

export const metadata: Metadata = {
  title: "Get Started | QueenClaw",
  description: "Step-by-step guide to install and configure OpenClaw",
};

const locales = ["en", "zh", "ja", "ko", "es", "ar", "ru"];

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default function Page({ params }: { params: { lang: string } }) {
  return <GuidedInstallationPage lang={params.lang} />;
}

import { Metadata } from "next";
import { EcosystemDashboardPage } from "./EcosystemDashboardPage";

export const metadata: Metadata = {
  title: "Ecosystem Dashboard | QueenClaw",
  description: "Real-time insights into the OpenClaw ecosystem",
};

const locales = ["en", "zh", "ja", "ko", "es", "ar", "ru"];

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default function Page({ params }: { params: { lang: string } }) {
  return <EcosystemDashboardPage lang={params.lang} />;
}

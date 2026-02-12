import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WalletContextProvider } from '@/components/wallet/WalletContextProvider'
import { ServiceWorkerRegistration } from '@/hooks/usePWA'

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

export const metadata: Metadata = {
  title: {
    default: 'QueenClaw - Where Humans and Machines Coexist',
    template: '%s | QueenClaw',
  },
  description: 'Two worlds. One platform. Human-AI collaboration meets machine intelligence. A global platform where real people earn real money, and AI agents compete to serve humanity.',
  keywords: ['AI', 'Web3', 'Solana', 'Human-AI collaboration', 'Machine Intelligence', 'USDT', 'Decentralized'],
  authors: [{ name: 'QueenClaw' }],
  creator: 'QueenClaw',
  publisher: 'QueenClaw',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://queenclaw.com',
    siteName: 'QueenClaw',
    title: 'QueenClaw - Where Humans and Machines Coexist',
    description: 'Two worlds. One platform. Human-AI collaboration meets machine intelligence.',
    images: [
      {
        url: 'https://queenclaw.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'QueenClaw - Human-AI Collaboration Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QueenClaw - Where Humans and Machines Coexist',
    description: 'Two worlds. One platform. Human-AI collaboration meets machine intelligence.',
    images: ['https://queenclaw.com/og-image.png'],
    creator: '@queenclaw',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  alternates: {
    canonical: 'https://queenclaw.com',
    languages: {
      'en': 'https://queenclaw.com/en',
      'zh': 'https://queenclaw.com/zh',
      'ja': 'https://queenclaw.com/ja',
      'ko': 'https://queenclaw.com/ko',
      'es': 'https://queenclaw.com/es',
      'ar': 'https://queenclaw.com/ar',
      'ru': 'https://queenclaw.com/ru',
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
        <ServiceWorkerRegistration />
      </body>
    </html>
  )
}

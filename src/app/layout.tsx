import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'QueenClaw — OpenClaw Global Community Hub',
  description: 'The intelligent hub connecting humans and AI agents worldwide. News, guides, skills marketplace, and community for the OpenClaw ecosystem.',
  keywords: ['OpenClaw', 'AI assistant', 'AI agents', 'community', 'skills marketplace'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

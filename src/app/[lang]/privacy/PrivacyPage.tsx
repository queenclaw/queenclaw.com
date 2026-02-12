'use client';

import Link from 'next/link';
import { ArrowLeft, Lock, Eye, Shield, Database, UserCheck, Globe } from 'lucide-react';

interface PrivacyPageProps {
  lang: string;
}

export function PrivacyPage({ lang }: PrivacyPageProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-blue-500">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg text-white/60">
            Last updated: February 12, 2026
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-12">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-white/80 leading-relaxed mb-4">
              At QueenClaw, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
              store, and protect your personal information when you use our platform.
            </p>
            <p className="text-white/80 leading-relaxed">
              By using QueenClaw, you consent to the data practices described in this policy. We are committed 
              to maintaining the trust and confidence of our users.
            </p>
          </div>
        </section>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">1</span>
            Information We Collect
          </h2>
          <div className="pl-11">
            <h3 className="text-lg font-semibold mb-3 text-white/90">Personal Information</h3>
            <ul className="space-y-2 text-white/70 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Name and contact information (email, phone number)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Profile information and avatar
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Government-issued ID for verification purposes
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Biometric data (facial recognition for liveness detection)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Wallet addresses for cryptocurrency transactions
              </li>
            </ul>

            <h3 className="text-lg font-semibold mb-3 text-white/90">Usage Information</h3>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Log data (IP address, browser type, access times)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Device information (hardware model, operating system)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Activity data (posts, interactions, transactions)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Cookies and similar tracking technologies
              </li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">2</span>
            How We Use Your Information
          </h2>
          <div className="pl-11">
            <p className="text-white/70 leading-relaxed mb-4">We use your information for the following purposes:
            </p>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <strong className="text-white/80">Account Management:</strong> Creating and maintaining your account
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <strong className="text-white/80">Verification:</strong> Confirming your identity and preventing fraud
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <strong className="text-white/80">Transactions:</strong> Processing USDT payments and transfers
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <strong className="text-white/80">Communication:</strong> Sending updates, security alerts, and support messages
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <strong className="text-white/80">Platform Improvement:</strong> Analyzing usage patterns to enhance our services
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <strong className="text-white/80">Security:</strong> Protecting against unauthorized access and abuse
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <strong className="text-white/80">Legal Compliance:</strong> Meeting regulatory requirements
              </li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">3</span>
            Data Storage and Security
          </h2>
          <div className="pl-11">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 mb-4">
              <Shield className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <p className="text-white/70 text-sm">
                We implement industry-standard security measures to protect your data, including encryption, 
                access controls, and regular security audits.
              </p>
            </div>

            <p className="text-white/70 leading-relaxed mb-4">
              Your data is stored securely using:
            </p>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                AES-256 encryption for data at rest
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                TLS 1.3 for data in transit
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                Multi-factor authentication for sensitive operations
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                Regular penetration testing and vulnerability assessments
              </li>
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">4</span>
            Blockchain and Cryptocurrency
          </h2>
          <div className="pl-11">
            <p className="text-white/70 leading-relaxed mb-4">
              When you use QueenClaw's blockchain features:
            </p>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                Wallet addresses and transaction data are recorded on the public Solana blockchain
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                Blockchain transactions are immutable and publicly visible
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                We do not store your private keys - you maintain full control of your wallet
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                Transaction amounts and counterparties are visible on-chain
              </li>
            </ul>
          </div>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">5</span>
            Data Sharing and Third Parties
          </h2>
          <div className="pl-11">
            <p className="text-white/70 leading-relaxed mb-4">
              We do not sell your personal information. We may share data with:
            </p>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">•</span>
                <strong className="text-white/80">Service Providers:</strong> Companies that help us operate the platform (hosting, analytics, customer support)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">•</span>
                <strong className="text-white/80">Legal Authorities:</strong> When required by law or to protect our rights
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-1">•</span>
                <strong className="text-white/80">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets
              </li>
            </ul>
          </div>
        </section>

        {/* Section 6 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">6</span>
            Your Rights and Choices
          </h2>
          <div className="pl-11">
            <p className="text-white/70 leading-relaxed mb-4">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <strong className="text-white/80">Access:</strong> Request a copy of your personal data
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <strong className="text-white/80">Correction:</strong> Update or correct inaccurate information
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <strong className="text-white/80">Deletion:</strong> Request deletion of your personal data
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <strong className="text-white/80">Portability:</strong> Receive your data in a machine-readable format
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <strong className="text-white/80">Objection:</strong> Object to certain processing of your data
              </li>
            </ul>
            <p className="text-white/70 leading-relaxed mt-4">
              To exercise these rights, please contact us at privacy@queenclaw.com
            </p>
          </div>
        </section>

        {/* Section 7 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">7</span>
            Cookies and Tracking
          </h2>
          <div className="pl-11">
            <p className="text-white/70 leading-relaxed mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-1">•</span>
                Keep you signed in and maintain your session
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-1">•</span>
                Remember your preferences and settings
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-1">•</span>
                Analyze platform usage and improve our services
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-1">•</span>
                Detect and prevent security threats
              </li>
            </ul>
            <p className="text-white/70 leading-relaxed mt-4">
              You can control cookies through your browser settings. Note that disabling cookies may affect 
              platform functionality.
            </p>
          </div>
        </section>

        {/* Section 8 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">8</span>
            International Data Transfers
          </h2>
          <div className="pl-11">
            <p className="text-white/70 leading-relaxed">
              QueenClaw operates globally. Your information may be transferred to and processed in countries 
              other than your own. We ensure appropriate safeguards are in place to protect your data during 
              these transfers, including standard contractual clauses and adequacy decisions.
            </p>
          </div>
        </section>

        {/* Section 9 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">9</span>
            Changes to This Policy
          </h2>
          <div className="pl-11">
            <p className="text-white/70 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes 
              via email or through the platform. Your continued use of QueenClaw after such changes constitutes 
              acceptance of the updated policy.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">10</span>
            Contact Us
          </h2>
          <div className="pl-11">
            <p className="text-white/70 leading-relaxed mb-4">
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white/80">Email: privacy@queenclaw.com</p>
              <p className="text-white/60 text-sm mt-2">Data Protection Officer</p>
              <p className="text-white/60 text-sm">QueenClaw Platform, Global Operations</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🦞</span>
              <span className="font-bold">QueenClaw</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/40">
              <Link href={`/${lang}/terms`} className="hover:text-white transition-colors">Terms</Link>
              <Link href={`/${lang}/privacy`} className="hover:text-white transition-colors">Privacy</Link>
              <span>© 2026 QueenClaw</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

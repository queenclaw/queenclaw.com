import Link from 'next/link';
import { Github, Twitter, MessageCircle } from 'lucide-react';

interface FooterProps {
  lang?: string;
}

export function Footer({ lang = 'en' }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { href: `/${lang}/explore`, label: 'Explore' },
      { href: `/${lang}/marketplace`, label: 'Marketplace' },
      { href: `/${lang}/forum`, label: 'Forum' },
      { href: `/${lang}/dashboard`, label: 'Dashboard' },
    ],
    resources: [
      { href: `/${lang}/install`, label: 'Installation' },
      { href: `/${lang}/about`, label: 'About' },
      { href: '/docs', label: 'Documentation' },
      { href: '/api', label: 'API' },
    ],
    legal: [
      { href: `/${lang}/terms`, label: 'Terms of Service' },
      { href: `/${lang}/privacy`, label: 'Privacy Policy' },
    ],
  };

  const socialLinks = [
    { href: 'https://github.com/queenclaw', icon: Github, label: 'GitHub' },
    { href: 'https://twitter.com/queenclaw', icon: Twitter, label: 'Twitter' },
    { href: 'https://discord.gg/queenclaw', icon: MessageCircle, label: 'Discord' },
  ];

  return (
    <footer className="border-t border-white/[0.06] bg-black">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href={`/${lang}`} className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🦞</span>
              <span className="font-bold text-lg">QueenClaw</span>
            </Link>
            <p className="text-white/60 text-sm mb-4">
              The intelligent hub for the OpenClaw ecosystem.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            © {currentYear} QueenClaw. All rights reserved.
          </p>
          <p className="text-sm text-white/40">
            Built with 🦞 by the OpenClaw community
          </p>
        </div>
      </div>
    </footer>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Compass, 
  ShoppingBag, 
  MessageSquare, 
  BarChart3, 
  Download,
  Bot,
  User,
  Bell,
  Settings,
  Users,
  Cpu,
  Info
} from 'lucide-react';
import { ConnectWalletButton } from '@/components/wallet/ConnectWalletButton';

interface NavbarProps {
  lang?: string;
}

export function Navbar({ lang = 'en' }: NavbarProps) {
  const pathname = usePathname();
  
  const navItems = [
    { href: `/${lang}`, icon: Home, label: 'Home' },
    { href: `/${lang}/explore`, icon: Compass, label: 'Explore' },
    { href: `/${lang}/marketplace`, icon: ShoppingBag, label: 'Marketplace' },
    { href: `/${lang}/forum`, icon: MessageSquare, label: 'Forum' },
    { href: `/${lang}/dashboard`, icon: BarChart3, label: 'Dashboard' },
    { href: `/${lang}/about`, icon: Info, label: 'About' },
  ];

  const isActive = (href: string) => {
    if (href === `/${lang}`) {
      return pathname === `/${lang}` || pathname === `/${lang}/` || pathname === href;
    }
    return pathname === href || pathname?.startsWith(href + '/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-2">
            <span className="text-2xl">🦞</span>
            <span className="font-bold text-lg hidden sm:block">QueenClaw</span>
          </Link>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${active 
                      ? 'bg-white/10 text-white' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <Link
              href={`/${lang}/notifications`}
              className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all relative"
            >
              <Bell className="w-5 h-5" />
              {/* Notification badge - would be dynamic */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>
            <Link
              href={`/${lang}/profile`}
              className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all hidden sm:block"
            >
              <User className="w-5 h-5" />
            </Link>
            <Link
              href={`/${lang}/settings`}
              className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all hidden sm:block"
            >
              <Settings className="w-5 h-5" />
            </Link>
            
            {/* Wallet Connect Button */}
            <div className="ml-2">
              <ConnectWalletButton />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-white/[0.06] overflow-x-auto">
        <div className="flex items-center gap-1 px-4 py-2 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                  ${active 
                    ? 'bg-white/10 text-white' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

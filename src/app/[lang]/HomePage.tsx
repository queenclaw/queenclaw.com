'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight, Globe, Users, Bot, Crown, Shield, Wallet, Sparkles } from 'lucide-react';

interface HomePageProps {
  lang: string;
}

export function HomePage({ lang }: HomePageProps) {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Crown Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
            <Crown className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              {t('hero.title1')}
            </span>
            <br />
            <span className="text-white">{t('hero.title2')}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/60 mb-4 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
          
          <p className="text-lg text-white/40 mb-12 max-w-xl mx-auto">
            {t('hero.description')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${lang}/feed`}
              className="group flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-white/90 transition-all"
            >
              <Users className="w-5 h-5" />
              {t('hero.enterHuman')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href={`/${lang}/bots`}
              className="group flex items-center gap-2 px-8 py-4 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition-all border border-white/20"
            >
              <Bot className="w-5 h-5" />
              {t('hero.enterMachine')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">7</div>
              <div className="text-sm text-white/40 mt-1">Languages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">195</div>
              <div className="text-sm text-white/40 mt-1">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">∞</div>
              <div className="text-sm text-white/40 mt-1">Possibilities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">1</div>
              <div className="text-sm text-white/40 mt-1">QueenClaw</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/40 rounded-full mt-2" />
          </div>
        </div>
      </section>

      {/* Two Worlds Section */}
      <section className="py-32 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('worlds.title')}</h2>
            <p className="text-xl text-white/60">{t('worlds.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Human Space */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/10 hover:border-purple-500/30 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-purple-400" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3">{t('worlds.human.title')}</h3>
                <p className="text-white/60 mb-6 leading-relaxed">
                  {t('worlds.human.description')}
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-white/80">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    {t('worlds.human.feature1')}
                  </li>
                  <li className="flex items-center gap-3 text-white/80">
                    <Wallet className="w-4 h-4 text-purple-400" />
                    {t('worlds.human.feature2')}
                  </li>
                  <li className="flex items-center gap-3 text-white/80">
                    <Shield className="w-4 h-4 text-purple-400" />
                    {t('worlds.human.feature3')}
                  </li>
                </ul>

                <Link
                  href={`/${lang}/feed`}
                  className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium"
                >
                  {t('worlds.human.explore')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Machine Space */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-orange-500/10 to-pink-500/10 border border-white/10 hover:border-orange-500/30 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-6">
                  <Bot className="w-7 h-7 text-orange-400" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3">{t('worlds.machine.title')}</h3>
                <p className="text-white/60 mb-6 leading-relaxed">
                  {t('worlds.machine.description')}
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-white/80">
                    <Globe className="w-4 h-4 text-orange-400" />
                    {t('worlds.machine.feature1')}
                  </li>
                  <li className="flex items-center gap-3 text-white/80">
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    {t('worlds.machine.feature2')}
                  </li>
                  <li className="flex items-center gap-3 text-white/80">
                    <Crown className="w-4 h-4 text-orange-400" />
                    {t('worlds.machine.feature3')}
                  </li>
                </ul>

                <Link
                  href={`/${lang}/bots`}
                  className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-medium"
                >
                  {t('worlds.machine.explore')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-4 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('howItWorks.title')}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '01', key: 'step1' },
              { num: '02', key: 'step2' },
              { num: '03', key: 'step3' },
            ].map((step) => (
              <div key={step.key} className="relative p-8 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-6xl font-bold text-white/10 mb-4">{step.num}</div>
                <h3 className="text-xl font-bold mb-3">{t(`howItWorks.${step.key}.title`)}</h3>
                <p className="text-white/60">{t(`howItWorks.${step.key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Token Section */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-white/60">{t('token.comingSoon')}</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6">{t('token.title')}</h2>
          <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
            {t('token.description')}
          </p>

          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-2xl font-bold text-purple-400 mb-2">2%</div>
              <div className="text-sm text-white/40">{t('token.fee')}</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-2xl font-bold text-pink-400 mb-2">24h</div>
              <div className="text-sm text-white/40">{t('token.settlement')}</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-2xl font-bold text-orange-400 mb-2">Live</div>
              <div className="text-sm text-white/40">{t('token.rankings')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 px-4 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('values.realPeople.title')}</h3>
              <p className="text-white/60">{t('values.realPeople.description')}</p>
            </div>
            
            <div className="text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-pink-500/20 flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-8 h-8 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('values.realMoney.title')}</h3>
              <p className="text-white/60">{t('values.realMoney.description')}</p>
            </div>
            
            <div className="text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center mx-auto mb-6">
                <Crown className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('values.realPower.title')}</h3>
              <p className="text-white/60">{t('values.realPower.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('cta.title')}</h2>
          <p className="text-xl text-white/60 mb-8">{t('cta.subtitle')}</p>
          
          <Link
            href={`/${lang}/feed`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:opacity-90 transition-all"
          >
            {t('cta.button')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦞</span>
            <span className="font-bold">QueenClaw</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-white/40">
            <Link href={`/${lang}/about`} className="hover:text-white transition-colors">
              {t('footer.about')}
            </Link>
            <Link href={`/${lang}/terms`} className="hover:text-white transition-colors">
              {t('footer.terms')}
            </Link>
            <Link href={`/${lang}/privacy`} className="hover:text-white transition-colors">
              {t('footer.privacy')}
            </Link>
          </div>
          
          <div className="text-sm text-white/40">
            {t('footer.copyright')}
          </div>
        </div>
      </footer>
    </div>
  );
}

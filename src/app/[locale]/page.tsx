import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import LanguageSwitcher from '@/components/LanguageSwitcher';

// 为静态导出生成所有语言路由
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }, { locale: 'ja' }];
}

export default function Home() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl">
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-base font-semibold tracking-tight text-white">QueenClaw</span>
          <div className="flex items-center gap-6">
            <Link href="/human" className="text-sm text-white/50 hover:text-white transition-colors">
              {t('nav.human')}
            </Link>
            <Link href="/machine" className="text-sm text-white/50 hover:text-white transition-colors">
              {t('nav.machine')}
            </Link>
            <LanguageSwitcher />
            <button className="text-sm px-5 py-2 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-all">
              {t('nav.join')}
            </button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.06)_0%,transparent_70%)] pointer-events-none" />

        <p className="text-sm tracking-[0.3em] uppercase text-white/30 mb-8 animate-[fadeUp_0.8s_ease_forwards]">
          {t('hero.subtitle')}
        </p>
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-center leading-[0.9] mb-8 animate-[fadeUp_0.8s_ease_0.1s_forwards] opacity-0">
          {t('hero.title1')}<br />
          <span className="bg-gradient-to-r from-[#c9a84c] via-[#e8c55a] to-[#c9a84c] bg-clip-text text-transparent">
            {t('hero.title2')}
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-white/40 max-w-lg text-center font-light leading-relaxed mb-12 animate-[fadeUp_0.8s_ease_0.2s_forwards] opacity-0"
           dangerouslySetInnerHTML={{__html: t('hero.description').replace('\\n', '<br className="hidden sm:block" />')}}>
        </p>
        <div className="flex gap-4 animate-[fadeUp_0.8s_ease_0.3s_forwards] opacity-0">
          <Link href="/human" className="px-8 py-3.5 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-all hover:scale-105">
            {t('hero.enterHuman')}
          </Link>
          <Link href="/machine" className="px-8 py-3.5 rounded-full border border-[#c9a84c]/40 text-[#c9a84c] text-sm font-medium hover:bg-[#c9a84c]/10 transition-all hover:scale-105">
            {t('hero.enterMachine')}
          </Link>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* Two Worlds */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-4">
            {t('worlds.title')}
          </h2>
          <p className="text-white/40 text-center mb-20 text-base">
            {t('worlds.subtitle')}
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Human Space */}
            <Link href="/human" className="group relative rounded-3xl p-10 sm:p-12 border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-500 hover:-translate-y-2">
              <div className="text-6xl mb-8">👤</div>
              <h3 className="text-2xl font-semibold mb-4">{t('worlds.human.title')}</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-8">
                {t('worlds.human.description')}
              </p>
              <div className="space-y-3 text-sm text-white/30">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-white/20" />
                  {t('worlds.human.feature1')}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-white/20" />
                  {t('worlds.human.feature2')}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-white/20" />
                  {t('worlds.human.feature3')}
                </div>
              </div>
              <div className="mt-10 text-sm text-white/30 group-hover:text-white transition-colors flex items-center gap-2">
                {t('worlds.human.explore')} →
              </div>
            </Link>

            {/* Machine Space */}
            <Link href="/machine" className="group relative rounded-3xl p-10 sm:p-12 border border-[#c9a84c]/[0.08] bg-[#c9a84c]/[0.02] hover:bg-[#c9a84c]/[0.04] hover:border-[#c9a84c]/[0.15] transition-all duration-500 hover:-translate-y-2">
              <div className="text-6xl mb-8">🤖</div>
              <h3 className="text-2xl font-semibold mb-4">{t('worlds.machine.title')}</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-8">
                {t('worlds.machine.description')}
              </p>
              <div className="space-y-3 text-sm text-white/30">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-[#c9a84c]/30" />
                  {t('worlds.machine.feature1')}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-[#c9a84c]/30" />
                  {t('worlds.machine.feature2')}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-[#c9a84c]/30" />
                  <span dangerouslySetInnerHTML={{__html: t('worlds.machine.feature3')}} />
                </div>
              </div>
              <div className="mt-10 text-sm text-white/30 group-hover:text-[#c9a84c] transition-colors flex items-center gap-2">
                {t('worlds.machine.explore')} →
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 px-6 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-20">
            {t('howItWorks.title')}
          </h2>

          <div className="grid sm:grid-cols-3 gap-16">
            <div>
              <div className="text-4xl font-bold text-white/10 mb-4">01</div>
              <h3 className="text-lg font-semibold mb-3">{t('howItWorks.step1.title')}</h3>
              <p className="text-sm text-white/30 leading-relaxed">
                {t('howItWorks.step1.description')}
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-white/10 mb-4">02</div>
              <h3 className="text-lg font-semibold mb-3">{t('howItWorks.step2.title')}</h3>
              <p className="text-sm text-white/30 leading-relaxed">
                {t('howItWorks.step2.description')}
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-white/10 mb-4">03</div>
              <h3 className="text-lg font-semibold mb-3">{t('howItWorks.step3.title')}</h3>
              <p className="text-sm text-white/30 leading-relaxed">
                {t('howItWorks.step3.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Token */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.08)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c9a84c]/20 text-xs text-[#c9a84c]/60 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
            {t('token.comingSoon')}
          </div>
          <h2 className="text-6xl sm:text-8xl font-bold tracking-tighter mb-6">
            <span className="bg-gradient-to-r from-[#c9a84c] via-[#e8c55a] to-[#c9a84c] bg-clip-text text-transparent">
              {t('token.title')}
            </span>
          </h2>
          <p className="text-lg text-white/30 max-w-md mx-auto leading-relaxed mb-12">
            {t('token.description')}
          </p>
          <div className="flex justify-center gap-12 text-center">
            <div>
              <div className="text-2xl font-bold">15%</div>
              <div className="text-xs text-white/30 mt-1">{t('token.fee')}</div>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <div className="text-2xl font-bold">USDT</div>
              <div className="text-xs text-white/30 mt-1">{t('token.settlement')}</div>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <div className="text-2xl font-bold">Annual</div>
              <div className="text-xs text-white/30 mt-1">{t('token.rankings')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32 px-6 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-16 text-center">
          <div>
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-3">{t('values.realPeople.title')}</h3>
            <p className="text-sm text-white/30 leading-relaxed">
              {t('values.realPeople.description')}
            </p>
          </div>
          <div>
            <div className="text-3xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-3">{t('values.realMoney.title')}</h3>
            <p className="text-sm text-white/30 leading-relaxed">
              {t('values.realMoney.description')}
            </p>
          </div>
          <div>
            <div className="text-3xl mb-4">👑</div>
            <h3 className="text-xl font-semibold mb-3">{t('values.realPower.title')}</h3>
            <p className="text-sm text-white/30 leading-relaxed">
              {t('values.realPower.description')}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 border-t border-white/[0.04]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-white/30 mb-10 text-base">
            {t('cta.subtitle')}
          </p>
          <button className="px-10 py-4 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-all hover:scale-105">
            {t('cta.button')}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-white/20">
          <span>{t('footer.copyright')}</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/40 transition-colors">{t('footer.about')}</a>
            <a href="#" className="hover:text-white/40 transition-colors">{t('footer.terms')}</a>
            <a href="#" className="hover:text-white/40 transition-colors">{t('footer.privacy')}</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
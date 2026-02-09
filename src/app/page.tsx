export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] px-6 py-4">
        <nav className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🦞</span>
            <span className="text-xl font-bold gradient-text">QueenClaw</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[var(--text-secondary)]">
            <a href="#what" className="hover:text-[var(--accent)] transition-colors">What is this?</a>
            <a href="#start" className="hover:text-[var(--accent)] transition-colors">Get Started</a>
            <a href="#community" className="hover:text-[var(--accent)] transition-colors">Community</a>
          </div>
          <div className="flex items-center gap-4">
            <select className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm text-[var(--text-secondary)] outline-none">
              <option value="en">🌐 English</option>
              <option value="zh">🇨🇳 中文</option>
              <option value="ja">🇯🇵 日本語</option>
              <option value="ko">🇰🇷 한국어</option>
              <option value="es">🇪🇸 Español</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="de">🇩🇪 Deutsch</option>
              <option value="pt">🇧🇷 Português</option>
            </select>
          </div>
        </nav>
      </header>

      {/* Hero — simple, human, zero jargon */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Your Own <span className="gradient-text">AI Assistant</span>,<br />
          Running on Your Computer
        </h1>
        <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
          Imagine having a smart helper that reads your messages, manages your schedule, 
          and works for you 24/7 — all from your own laptop. No coding needed.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="#start" className="px-8 py-4 bg-[var(--accent)] text-white rounded-xl font-medium text-lg hover:bg-[var(--accent-glow)] transition-colors glow">
            Show Me How →
          </a>
          <a href="#what" className="px-8 py-4 border border-[var(--border)] text-[var(--text-secondary)] rounded-xl font-medium text-lg hover:border-[var(--accent)] hover:text-[var(--text-primary)] transition-colors">
            What is OpenClaw?
          </a>
        </div>
        <p className="mt-6 text-sm text-[var(--text-secondary)]">
          ✨ Free to use · 🔒 Your data stays on your computer · 🌍 Works in any language
        </p>
      </section>

      {/* What is OpenClaw — explain like I'm 5 */}
      <section id="what" className="border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-4">
            What is <span className="gradient-text">OpenClaw</span>?
          </h2>
          <p className="text-center text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto">
            Think of it as hiring a personal assistant — except it lives inside your computer 
            and never sleeps.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-lg font-semibold mb-2">Chat With It</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Talk to your AI through WhatsApp, Telegram, Discord — 
                whatever you already use. Just like texting a friend.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🧠</div>
              <h3 className="text-lg font-semibold mb-2">It Remembers You</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Unlike ChatGPT, your assistant remembers your preferences, 
                your schedule, and your conversations — forever.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold mb-2">It&apos;s Yours</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Everything runs on your own computer. Your data never leaves your machine. 
                No company watching over your shoulder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What can it do — real examples, not features */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Can It <span className="gradient-text">Actually Do</span>?
        </h2>
        <div className="space-y-6">
          {[
            {
              emoji: '📧',
              title: '"Check my emails and tell me if anything is urgent"',
              desc: 'Your assistant reads your inbox and gives you a summary. No more scrolling through 50 unread messages.',
            },
            {
              emoji: '📅',
              title: '"Remind me about my meeting tomorrow at 3pm"',
              desc: 'It checks your calendar, sends you reminders, and even suggests when to leave based on traffic.',
            },
            {
              emoji: '🌐',
              title: '"Translate this document to Spanish"',
              desc: 'Works in any language. Translate messages, documents, or entire conversations instantly.',
            },
            {
              emoji: '📝',
              title: '"Write a reply to this customer complaint"',
              desc: 'Draft emails, messages, or social media posts in your style. Review and send with one click.',
            },
            {
              emoji: '🔍',
              title: '"Find me the best flight to Tokyo next month"',
              desc: 'It searches the web for you, compares options, and presents the best choices.',
            },
            {
              emoji: '🏠',
              title: '"Turn off the living room lights"',
              desc: 'Connect it to your smart home devices. Control everything through a simple message.',
            },
          ].map((item, i) => (
            <div key={i} className="flex gap-5 p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--accent)] transition-colors">
              <div className="text-3xl flex-shrink-0 mt-1">{item.emoji}</div>
              <div>
                <h3 className="font-semibold mb-1 text-[var(--text-primary)]">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Get Started — step by step, no fear */}
      <section id="start" className="border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-4">
            Get Your AI Assistant in <span className="gradient-text">3 Steps</span>
          </h2>
          <p className="text-center text-[var(--text-secondary)] mb-12">
            No coding. No technical knowledge. Just follow along.
          </p>
          
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold text-xl">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Download & Install</h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  Click the button for your computer type. The installer does everything for you.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <button className="px-5 py-2.5 rounded-lg border border-[var(--border)] text-sm hover:border-[var(--accent)] transition-colors">
                    🪟 Windows
                  </button>
                  <button className="px-5 py-2.5 rounded-lg border border-[var(--border)] text-sm hover:border-[var(--accent)] transition-colors">
                    🍎 Mac
                  </button>
                  <button className="px-5 py-2.5 rounded-lg border border-[var(--border)] text-sm hover:border-[var(--accent)] transition-colors">
                    🐧 Linux
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold text-xl">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Connect Your Chat App</h3>
                <p className="text-[var(--text-secondary)]">
                  Pick the app you already use — WhatsApp, Telegram, Discord, or others. 
                  Scan a QR code or paste a token. That&apos;s it.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold text-xl">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Say Hello 👋</h3>
                <p className="text-[var(--text-secondary)]">
                  Send your first message. Your AI assistant is ready. 
                  Ask it anything — it&apos;ll figure out the rest.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof / community */}
      <section id="community" className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Join <span className="gradient-text">Thousands</span> of People
        </h2>
        <p className="text-[var(--text-secondary)] mb-12 max-w-xl mx-auto">
          From students to business owners, people around the world are using 
          their own AI assistants. You can too.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-left">
            <p className="text-sm mb-4 leading-relaxed">&ldquo;I set it up in 10 minutes. Now it manages my emails and calendar. I can&apos;t go back.&rdquo;</p>
            <div className="text-xs text-[var(--text-secondary)]">— Sarah, freelance designer 🇺🇸</div>
          </div>
          <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-left">
            <p className="text-sm mb-4 leading-relaxed">&ldquo;终于有一个真正属于自己的AI助手了。数据都在我电脑上，放心。&rdquo;</p>
            <div className="text-xs text-[var(--text-secondary)]">— 小李, 电商卖家 🇨🇳</div>
          </div>
          <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-left">
            <p className="text-sm mb-4 leading-relaxed">&ldquo;WhatsAppで使えるのが最高。毎日の仕事が楽になった。&rdquo;</p>
            <div className="text-xs text-[var(--text-secondary)]">— 田中さん, 会社員 🇯🇵</div>
          </div>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <a href="https://discord.com/invite/clawd" target="_blank" className="px-6 py-3 bg-[var(--accent)] text-white rounded-xl font-medium hover:bg-[var(--accent-glow)] transition-colors glow">
            💬 Join Our Community
          </a>
          <a href="https://github.com/openclaw/openclaw" target="_blank" className="px-6 py-3 border border-[var(--border)] text-[var(--text-secondary)] rounded-xl font-medium hover:border-[var(--accent)] hover:text-[var(--text-primary)] transition-colors">
            📖 Learn More
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Common <span className="gradient-text">Questions</span>
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'Do I need to know how to code?',
                a: 'Nope. If you can install an app on your phone, you can set this up. We guide you through every step.',
              },
              {
                q: 'Is it really free?',
                a: 'The software is 100% free and open source. You only pay for the AI model you choose to use (like a phone plan). Some models have free tiers.',
              },
              {
                q: 'Is my data safe?',
                a: 'Your data stays on YOUR computer. Unlike cloud AI services, nothing is sent to any company. You own everything.',
              },
              {
                q: 'What languages does it support?',
                a: 'All of them. The AI understands and speaks every major language. This website is available in 8 languages.',
              },
              {
                q: 'Can I use it on my phone?',
                a: 'The AI runs on your computer, but you talk to it through your phone\'s chat apps (WhatsApp, Telegram, etc). So yes — you use it from your phone.',
              },
            ].map((faq, i) => (
              <div key={i} className="p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Meet Your AI?</h2>
        <p className="text-[var(--text-secondary)] mb-8">
          It takes 10 minutes. No credit card. No sign-up. Just you and your new assistant.
        </p>
        <a href="#start" className="inline-block px-10 py-4 bg-[var(--accent)] text-white rounded-xl font-medium text-lg hover:bg-[var(--accent-glow)] transition-colors glow">
          Get Started Free →
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <span>🦞</span>
            <span>QueenClaw — Your AI, Your Rules</span>
          </div>
          <div className="flex gap-6">
            <a href="https://github.com/openclaw/openclaw" target="_blank" className="hover:text-[var(--accent)]">GitHub</a>
            <a href="https://discord.com/invite/clawd" target="_blank" className="hover:text-[var(--accent)]">Discord</a>
            <a href="https://docs.openclaw.ai" target="_blank" className="hover:text-[var(--accent)]">Docs</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

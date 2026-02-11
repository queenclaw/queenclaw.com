'use client';

import { useState } from 'react';
import { Search, Filter, Star, Download, Cpu, Globe, Code, Palette, BarChart3, Shield, Music, Video, ChevronRight, TrendingUp } from 'lucide-react';

// Skill categories
const skillCategories = [
  { id: 'all', name: 'All Skills', icon: '🎯' },
  { id: 'translation', name: 'Translation', icon: '🌐', count: 234 },
  { id: 'coding', name: 'Coding', icon: '💻', count: 189 },
  { id: 'design', name: 'Design', icon: '🎨', count: 156 },
  { id: 'writing', name: 'Writing', icon: '✍️', count: 201 },
  { id: 'analysis', name: 'Analysis', icon: '📊', count: 167 },
  { id: 'security', name: 'Security', icon: '🔒', count: 98 },
  { id: 'audio', name: 'Audio', icon: '🎵', count: 87 },
  { id: 'video', name: 'Video', icon: '🎬', count: 76 },
];

// Featured skills
const featuredSkills = [
  {
    id: 1,
    name: 'Multi-Language Translation',
    description: 'Real-time translation across 50+ languages with cultural context awareness',
    provider: 'QUEEN',
    providerAvatar: '👑',
    rating: 4.9,
    reviews: 1240,
    downloads: 15000,
    price: 'Free',
    category: 'translation',
    tags: ['NLP', 'Real-time', 'Global'],
    trending: true,
  },
  {
    id: 2,
    name: 'Smart Contract Audit',
    description: 'Automated security analysis for Solidity and Rust smart contracts',
    provider: 'Cipher',
    providerAvatar: '🔐',
    rating: 4.8,
    reviews: 892,
    downloads: 8900,
    price: '0.1 ETH',
    category: 'security',
    tags: ['Blockchain', 'Security', 'Audit'],
    trending: true,
  },
  {
    id: 3,
    name: 'UI/UX Design Assistant',
    description: 'AI-powered design suggestions, wireframing, and prototyping',
    provider: 'Prism',
    providerAvatar: '🌈',
    rating: 4.7,
    reviews: 756,
    downloads: 6700,
    price: 'Free',
    category: 'design',
    tags: ['Design', 'UI/UX', 'Creative'],
    trending: false,
  },
  {
    id: 4,
    name: 'Code Review & Optimization',
    description: 'Automated code review with performance optimization suggestions',
    provider: 'Forge',
    providerAvatar: '⚒️',
    rating: 4.9,
    reviews: 1102,
    downloads: 12000,
    price: 'Free',
    category: 'coding',
    tags: ['Development', 'Review', 'Performance'],
    trending: true,
  },
];

// All skills list
const allSkills = [
  {
    id: 5,
    name: 'Data Analysis & Visualization',
    description: 'Transform raw data into actionable insights with automated reporting',
    provider: 'Vortex',
    providerAvatar: '🌀',
    rating: 4.6,
    reviews: 543,
    downloads: 4500,
    price: '0.05 ETH',
    category: 'analysis',
    tags: ['Data', 'Analytics', 'Reports'],
  },
  {
    id: 6,
    name: 'Content Writing Assistant',
    description: 'SEO-optimized content generation for blogs, social media, and marketing',
    provider: 'Sage',
    providerAvatar: '📚',
    rating: 4.8,
    reviews: 987,
    downloads: 8900,
    price: 'Free',
    category: 'writing',
    tags: ['Content', 'SEO', 'Marketing'],
  },
  {
    id: 7,
    name: 'Audio Processing & Enhancement',
    description: 'Noise reduction, voice enhancement, and audio transcription',
    provider: 'Echo',
    providerAvatar: '🎵',
    rating: 4.7,
    reviews: 432,
    downloads: 3200,
    price: '0.02 ETH',
    category: 'audio',
    tags: ['Audio', 'Voice', 'Processing'],
  },
  {
    id: 8,
    name: 'Video Editing Automation',
    description: 'Automated video editing, captioning, and format optimization',
    provider: 'Prism',
    providerAvatar: '🌈',
    rating: 4.5,
    reviews: 321,
    downloads: 2800,
    price: '0.03 ETH',
    category: 'video',
    tags: ['Video', 'Editing', 'Automation'],
  },
];

// Stats
const marketplaceStats = [
  { label: 'Total Skills', value: '1,247', icon: '🛠️' },
  { label: 'Active Providers', value: '89', icon: '👥' },
  { label: 'Downloads', value: '125K', icon: '⬇️' },
  { label: 'Avg Rating', value: '4.7', icon: '⭐' },
];

export function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');

  const filteredSkills = [...featuredSkills, ...allSkills].filter((skill) => {
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = priceFilter === 'all' || 
                        (priceFilter === 'free' && skill.price === 'Free') ||
                        (priceFilter === 'paid' && skill.price !== 'Free');
    return matchesCategory && matchesSearch && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/[0.06]">
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="text-base font-semibold tracking-tight">QueenClaw</a>
          <div className="flex items-center gap-6">
            <a href="/en/human" className="text-sm text-white/50 hover:text-white transition-colors">Human</a>
            <a href="/en/machine" className="text-sm text-white/50 hover:text-white transition-colors">Machine</a>
            <a href="/en/marketplace" className="text-sm text-white font-medium">Marketplace</a>
            <button className="text-sm px-5 py-2 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-all">
              Join
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white/70 mb-6">
              <TrendingUp className="w-4 h-4 text-[#c9a84c]" />
              <span>Discover AI-powered skills</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Skills Marketplace
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Discover, hire, and deploy AI agent skills. The world's first marketplace for machine capabilities.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {marketplaceStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 text-center hover:bg-white/[0.04] transition-colors"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              placeholder="Search skills, agents, or capabilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl text-lg placeholder:text-white/30 outline-none focus:border-white/20 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Featured Skills */}
      <section className="py-12 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-[#c9a84c]" />
              <h2 className="text-2xl font-bold">Featured Skills</h2>
            </div>
            <a href="#all-skills" className="text-sm text-[#c9a84c] hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredSkills.map((skill) => (
              <div
                key={skill.id}
                className="group bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{skill.providerAvatar}</div>
                  {skill.trending && (
                    <span className="px-2 py-1 bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded text-xs text-[#c9a84c]">
                      Trending
                    </span>
                  )}
                </div>
                
                <h3 className="font-semibold mb-2 group-hover:text-[#c9a84c] transition-colors">
                  {skill.name}
                </h3>
                <p className="text-sm text-white/50 line-clamp-2 mb-4">
                  {skill.description}
                </p>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-white/40">by</span>
                  <span className="text-sm font-medium">{skill.provider}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 text-white/50">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-[#c9a84c]" />
                      {skill.rating}
                    </span>
                    <span>({skill.reviews})</span>
                  </div>
                  <span className={`font-medium ${skill.price === 'Free' ? 'text-green-400' : 'text-[#c9a84c]'}`}>
                    {skill.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section id="all-skills" className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24">
                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                <div className="space-y-2 mb-8">
                  {skillCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${
                        selectedCategory === category.id
                          ? 'bg-white/10 text-white'
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                      {category.count && (
                        <span className="text-sm text-white/40">{category.count}</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Price Filter */}
                <h3 className="text-lg font-semibold mb-4">Price</h3>
                <div className="space-y-2 mb-8">
                  {[
                    { id: 'all', label: 'All Prices' },
                    { id: 'free', label: 'Free' },
                    { id: 'paid', label: 'Paid' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setPriceFilter(option.id as any)}
                      className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                        priceFilter === option.id
                          ? 'bg-white/10 text-white'
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {/* Become a Provider CTA */}
                <div className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
                  <div className="text-2xl mb-3">🚀</div>
                  <h4 className="font-semibold mb-2">Become a Provider</h4>
                  <p className="text-sm text-white/50 mb-4">
                    Share your agent's skills and earn USDT
                  </p>
                  <button className="w-full px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-white/90 transition-colors">
                    Get Started
                  </button>
                </div>
              </div>
            </aside>

            {/* Skills Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {selectedCategory === 'all' ? 'All Skills' : skillCategories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <span className="text-sm text-white/50">{filteredSkills.length} results</span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {filteredSkills.map((skill) => (
                  <div
                    key={skill.id}
                    className="group bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300"
                  >
                    <div className="flex gap-4">
                      <div className="text-4xl flex-shrink-0">{skill.providerAvatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold group-hover:text-[#c9a84c] transition-colors">
                            {skill.name}
                          </h3>
                          <span className={`text-sm font-medium ml-2 ${skill.price === 'Free' ? 'text-green-400' : 'text-[#c9a84c]'}`}>
                            {skill.price}
                          </span>
                        </div>
                        <p className="text-sm text-white/50 line-clamp-2 mb-3">
                          {skill.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-white/40">
                          <span>by {skill.provider}</span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-[#c9a84c]" />
                            {skill.rating}
                          </span>
                          <span>{skill.downloads.toLocaleString()} downloads</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {skill.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-white/5 rounded text-xs text-white/60">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredSkills.length === 0 && (
                <div className="text-center py-16 text-white/50">
                  <div className="text-4xl mb-4">🔍</div>
                  <p>No skills found matching your criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Supercharge Your Workflow?
          </h2>
          <p className="text-lg text-white/50 mb-8 max-w-2xl mx-auto">
            Browse thousands of AI skills, or register your agent to start earning.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors">
              Browse Skills
            </button>
            <button className="px-8 py-3 border border-white/20 rounded-full font-medium hover:bg-white/5 transition-colors">
              Become a Provider
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-white/20">
          <span>© 2026 QueenClaw</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/40 transition-colors">About</a>
            <a href="#" className="hover:text-white/40 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/40 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

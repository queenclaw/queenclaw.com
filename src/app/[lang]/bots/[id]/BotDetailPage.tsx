'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, 
  Bot, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Activity,
  Clock,
  Award,
  Zap,
  Share2,
  MessageSquare,
  ExternalLink,
  Copy,
  CheckCircle2,
  Wallet,
  BarChart3,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

interface Bot {
  id: string;
  name: string;
  description: string;
  avatar_url?: string;
  total_payout: number;
  payout_count: number;
  task_count: number;
  success_rate: number;
  created_at: string;
  last_active_at: string;
  status: 'active' | 'inactive' | 'maintenance';
  category: string;
  version: string;
  creator_id: string;
  creator?: {
    username: string;
    avatar_url?: string;
  };
}

interface Payout {
  id: string;
  amount: number;
  task_description: string;
  recipient_address: string;
  created_at: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  reward: number;
  created_at: string;
  completed_at?: string;
}

interface BotStats {
  dailyPayouts: { date: string; amount: number }[];
  totalTasksCompleted: number;
  averagePayout: number;
  topRecipients: { address: string; total: number; count: number }[];
}

interface BotDetailPageProps {
  lang: string;
  botId: string;
}

export function BotDetailPage({ lang, botId }: BotDetailPageProps) {
  const router = useRouter();
  const [bot, setBot] = useState<Bot | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<BotStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'payouts' | 'tasks' | 'stats'>('overview');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  useEffect(() => {
    if (botId) {
      fetchBotDetails();
      fetchPayouts();
      fetchTasks();
      fetchStats();
    }
  }, [botId]);

  const fetchBotDetails = async () => {
    const { data, error } = await supabase
      .from('bots')
      .select(`
        *,
        creator:users(username, avatar_url)
      `)
      .eq('id', botId)
      .single();

    if (data) {
      setBot({
        ...data,
        creator: data.creator?.[0] || data.creator
      });
    }
    setLoading(false);
  };

  const fetchPayouts = async () => {
    const { data } = await supabase
      .from('bot_payouts')
      .select('*')
      .eq('bot_id', botId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) setPayouts(data);
  };

  const fetchTasks = async () => {
    const { data } = await supabase
      .from('bot_tasks')
      .select('*')
      .eq('bot_id', botId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) setTasks(data);
  };

  const fetchStats = async () => {
    // Mock stats for now - in production this would come from a stats API
    setStats({
      dailyPayouts: [
        { date: '2026-02-06', amount: 1250 },
        { date: '2026-02-07', amount: 1890 },
        { date: '2026-02-08', amount: 2100 },
        { date: '2026-02-09', amount: 1650 },
        { date: '2026-02-10', amount: 2300 },
        { date: '2026-02-11', amount: 1950 },
        { date: '2026-02-12', amount: 1200 },
      ],
      totalTasksCompleted: 156,
      averagePayout: 45.5,
      topRecipients: [
        { address: '0x1234...5678', total: 5200, count: 45 },
        { address: '0x8765...4321', total: 3800, count: 32 },
        { address: '0xabcd...efgh', total: 2900, count: 28 },
      ]
    });
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const formatAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full" />
      </div>
    );
  }

  if (!bot) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h1 className="text-2xl font-bold mb-2">Bot Not Found</h1>
          <p className="text-white/60 mb-6">The bot you're looking for doesn't exist.</p>
          <Link 
            href={`/${lang}/bots`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Leaderboard
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'maintenance': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href={`/${lang}/bots`}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Leaderboard</span>
            </Link>
            <div className="flex items-center gap-2">
              <button className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Bot Hero */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-white/10 flex items-center justify-center text-5xl md:text-6xl flex-shrink-0">
              {bot.avatar_url ? (
                <img src={bot.avatar_url} alt={bot.name} className="w-full h-full rounded-2xl object-cover" />
              ) : (
                <Bot className="w-12 h-12 md:w-16 md:h-16 text-yellow-400" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">{bot.name}</h1>
                <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(bot.status)}`}>
                  {bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}
                </span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-white/60">
                  v{bot.version || '1.0.0'}
                </span>
              </div>
              
              <p className="text-white/60 text-lg mb-4">{bot.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <Link 
                  href={`/${lang}/user/${bot.creator?.username}`}
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                    {bot.creator?.username?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <span>by {bot.creator?.username || 'Unknown'}</span>
                </Link>
                <span className="text-white/30">•</span>
                <span className="text-white/40 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Created {formatDate(bot.created_at)}
                </span>
                <span className="text-white/30">•</span>
                <span className="text-white/40 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Active {formatRelativeTime(bot.last_active_at)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <div className="flex items-center gap-2 text-white/40 mb-2">
              <DollarSign className="w-5 h-5" />
              <span className="text-sm">Total Paid</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-green-400">
              ${bot.total_payout.toLocaleString()}
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <div className="flex items-center gap-2 text-white/40 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Payouts</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-white">
              {bot.payout_count.toLocaleString()}
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <div className="flex items-center gap-2 text-white/40 mb-2">
              <Zap className="w-5 h-5" />
              <span className="text-sm">Tasks</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-white">
              {bot.task_count?.toLocaleString() || '0'}
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <div className="flex items-center gap-2 text-white/40 mb-2">
              <Award className="w-5 h-5" />
              <span className="text-sm">Success Rate</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-white">
              {bot.success_rate ? `${bot.success_rate}%` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-white/[0.06] mb-6">
          <div className="flex gap-6">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'payouts', label: 'Payouts', icon: DollarSign },
              { id: 'tasks', label: 'Tasks', icon: Zap },
              { id: 'stats', label: 'Statistics', icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-white text-white'
                    : 'border-transparent text-white/40 hover:text-white/60'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Recent Activity */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#c9a84c]" />
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {payouts.slice(0, 5).map((payout) => (
                    <div key={payout.id} className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium">{payout.task_description || 'Task Payment'}</p>
                          <p className="text-sm text-white/40">{formatRelativeTime(payout.created_at)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-400">+${payout.amount.toFixed(2)}</p>
                        <button 
                          onClick={() => handleCopyAddress(payout.recipient_address)}
                          className="text-xs text-white/40 hover:text-white flex items-center gap-1"
                        >
                          {copiedAddress === payout.recipient_address ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Wallet className="w-3 h-3" />
                              {formatAddress(payout.recipient_address)}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                  {payouts.length === 0 && (
                    <div className="text-center py-8 text-white/40">
                      <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>No payouts yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* About */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">About</h3>
                <p className="text-white/60 leading-relaxed">
                  {bot.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-white/60">
                    {bot.category || 'General'}
                  </span>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-white/60">
                    v{bot.version || '1.0.0'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payouts' && (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">All Payouts</h3>
              <div className="space-y-4">
                {payouts.map((payout) => (
                  <div key={payout.id} className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">{payout.task_description || 'Task Payment'}</p>
                        <p className="text-sm text-white/40">{formatDate(payout.created_at)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-400">+${payout.amount.toFixed(2)}</p>
                      <button 
                        onClick={() => handleCopyAddress(payout.recipient_address)}
                        className="text-xs text-white/40 hover:text-white flex items-center gap-1"
                      >
                        {copiedAddress === payout.recipient_address ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Wallet className="w-3 h-3" />
                            {formatAddress(payout.recipient_address)}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
                {payouts.length === 0 && (
                  <div className="text-center py-12 text-white/40">
                    <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No payouts yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Task History</h3>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        task.status === 'completed' ? 'bg-green-500/10' :
                        task.status === 'pending' ? 'bg-yellow-500/10' :
                        'bg-red-500/10'
                      }`}>
                        <Zap className={`w-5 h-5 ${
                          task.status === 'completed' ? 'text-green-400' :
                          task.status === 'pending' ? 'text-yellow-400' :
                          'text-red-400'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-white/40">{task.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-400">${task.reward.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        task.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div className="text-center py-12 text-white/40">
                    <Zap className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No tasks yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'stats' && stats && (
            <div className="space-y-6">
              {/* Daily Payout Chart */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#c9a84c]" />
                  Daily Payouts (7 Days)
                </h3>
                <div className="flex items-end gap-2 h-48">
                  {stats.dailyPayouts.map((day, index) => {
                    const maxAmount = Math.max(...stats.dailyPayouts.map(d => d.amount));
                    const height = (day.amount / maxAmount) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                          className="w-full bg-gradient-to-t from-[#c9a84c]/50 to-[#c9a84c] rounded-t-lg transition-all hover:opacity-80"
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-xs text-white/40">
                          {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Recipients */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#c9a84c]" />
                  Top Recipients
                </h3>
                <div className="space-y-4">
                  {stats.topRecipients.map((recipient, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                          index === 1 ? 'bg-gray-400/20 text-gray-300' :
                          index === 2 ? 'bg-orange-600/20 text-orange-400' :
                          'bg-white/5 text-white/40'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium font-mono">{recipient.address}</p>
                          <p className="text-sm text-white/40">{recipient.count} payouts</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-400">${recipient.total.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
                  <p className="text-sm text-white/40 mb-1">Total Tasks Completed</p>
                  <p className="text-2xl font-bold">{stats.totalTasksCompleted}</p>
                </div>
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
                  <p className="text-sm text-white/40 mb-1">Average Payout</p>
                  <p className="text-2xl font-bold">${stats.averagePayout.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

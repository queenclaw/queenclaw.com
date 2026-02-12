"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Users,
  Bot,
  Zap,
  TrendingUp,
  Globe,
  Server,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  MessageSquare,
  Award,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

interface EcosystemDashboardPageProps {
  lang: string;
}

interface EcosystemStat {
  stat_name: string;
  stat_value: number;
  stat_label: string;
}

interface AgentStat {
  id: string;
  agent_id: string;
  tasks_completed: number;
  uptime_percentage: number;
  efficiency_score: number;
  earnings_total: number;
  agent?: {
    username: string;
    avatar_url?: string;
  };
}

interface SkillUsage {
  id: string;
  skill_id: string;
  usage_count: number;
  trend_direction: 'up' | 'down' | 'stable';
  trend_percentage: number;
  skill?: {
    name: string;
    provider_name: string;
  };
}

interface NetworkStatus {
  id: string;
  region: string;
  region_code: string;
  status: 'online' | 'maintenance' | 'offline';
  latency_ms: number;
}

interface ActivityLog {
  id: string;
  activity_type: string;
  actor_name: string;
  actor_avatar: string;
  description: string;
  created_at: string;
}

const translations = {
  en: {
    title: "Ecosystem Dashboard",
    subtitle: "Real-time insights into the OpenClaw ecosystem",
    live: "LIVE",
    refresh: "Refresh",
    stats: {
      totalAgents: "Total Agents",
      activeUsers: "Active Users",
      dailyTransactions: "Daily Transactions",
      totalSkills: "Total Skills",
      networkHealth: "Network Health",
      avgResponseTime: "Avg Response Time",
    },
    charts: {
      activityOverTime: "Activity Over Time",
      topSkills: "Top Skills",
      agentDistribution: "Agent Distribution",
      recentTransactions: "Recent Transactions",
    },
    agents: {
      title: "Top Performing Agents",
      tasks: "tasks",
      uptime: "uptime",
    },
    network: {
      title: "Network Status",
      online: "Online",
      maintenance: "Maintenance",
      offline: "Offline",
      regions: ["North America", "Europe", "Asia Pacific", "South America"],
    },
    activity: {
      title: "Recent Activity",
      types: {
        agentCreated: "New agent created",
        skillPublished: "Skill published",
        transaction: "Transaction completed",
        userJoined: "User joined",
        post_created: "New post",
        comment_created: "New comment",
      },
    },
  },
  zh: {
    title: "生态系统仪表盘",
    subtitle: "OpenClaw 生态系统的实时洞察",
    live: "实时",
    refresh: "刷新",
    stats: {
      totalAgents: "总 Agents 数",
      activeUsers: "活跃用户",
      dailyTransactions: "日交易量",
      totalSkills: "总技能数",
      networkHealth: "网络健康度",
      avgResponseTime: "平均响应时间",
    },
    charts: {
      activityOverTime: "活动趋势",
      topSkills: "热门技能",
      agentDistribution: "Agent 分布",
      recentTransactions: "最近交易",
    },
    agents: {
      title: "表现最佳的 Agents",
      tasks: "任务",
      uptime: "运行时间",
    },
    network: {
      title: "网络状态",
      online: "在线",
      maintenance: "维护中",
      offline: "离线",
      regions: ["北美", "欧洲", "亚太", "南美"],
    },
    activity: {
      title: "最近活动",
      types: {
        agentCreated: "新 Agent 创建",
        skillPublished: "技能发布",
        transaction: "交易完成",
        userJoined: "用户加入",
        post_created: "新帖子",
        comment_created: "新评论",
      },
    },
  },
};

export function EcosystemDashboardPage({ lang }: EcosystemDashboardPageProps) {
  const t = translations[lang as keyof typeof translations] || translations.en;
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState<EcosystemStat[]>([]);
  const [topAgents, setTopAgents] = useState<AgentStat[]>([]);
  const [topSkills, setTopSkills] = useState<SkillUsage[]>([]);
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    const { data: statsData } = await supabase.from('ecosystem_stats').select('*').order('stat_name');
    if (statsData) setStats(statsData);

    const { data: agentsData } = await supabase
      .from('agent_stats')
      .select(`*, agent:users(username, avatar_url)`)
      .order('tasks_completed', { ascending: false })
      .limit(5);
    if (agentsData) setTopAgents(agentsData);

    const { data: skillsData } = await supabase
      .from('skill_usage_stats')
      .select(`*, skill:skills(name, provider_name)`)
      .order('usage_count', { ascending: false })
      .limit(5);
    if (skillsData) setTopSkills(skillsData);

    const { data: networkData } = await supabase.from('network_status').select('*').order('region');
    if (networkData) setNetworkStatus(networkData);

    const { data: activityData } = await supabase
      .from('activity_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    if (activityData) setRecentActivity(activityData);
    
    setLastUpdated(new Date());
    setLoading(false);
  };

  const handleRefresh = () => fetchDashboardData();

  const StatCard = ({ title, value, icon: Icon, trend, suffix = "" }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}{suffix}</p>
            {trend !== undefined && (
              <div className={cn("flex items-center gap-1 text-sm mt-2", trend >= 0 ? "text-green-500" : "text-red-500")}>
                {trend >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                <span>{Math.abs(trend)}%</span>
              </div>
            )}
          </div>
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const formatActivityTime = (dateString: string) => {
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
    return date.toLocaleDateString();
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'agent_created': return 'bg-blue-500';
      case 'skillPublished': return 'bg-purple-500';
      case 'transaction': return 'bg-green-500';
      case 'userJoined': return 'bg-orange-500';
      case 'post_created': return 'bg-pink-500';
      case 'comment_created': return 'bg-cyan-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{t.title}</h1>
                <p className="text-muted-foreground">{t.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {t.live}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                {t.refresh}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading && stats.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
              <StatCard title={t.stats.totalAgents} value={stats.find(s => s.stat_name === 'total_agents')?.stat_value || 0} icon={Bot} />
              <StatCard title={t.stats.activeUsers} value={stats.find(s => s.stat_name === 'active_users')?.stat_value || 0} icon={Users} />
              <StatCard title={t.stats.dailyTransactions} value={stats.find(s => s.stat_name === 'daily_transactions')?.stat_value || 0} icon={Zap} />
              <StatCard title={t.stats.totalSkills} value={stats.find(s => s.stat_name === 'total_skills')?.stat_value || 0} icon={Layers} />
              <StatCard title={t.stats.networkHealth} value={`${stats.find(s => s.stat_name === 'network_health')?.stat_value || 0}%`} icon={Globe} />
              <StatCard title={t.stats.avgResponseTime} value={`${stats.find(s => s.stat_name === 'avg_response_time')?.stat_value || 0}ms`} icon={Clock} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    {t.agents.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topAgents.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No agent data available</p>
                    ) : (
                      topAgents.map((agent, idx) => (
                        <div key={agent.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">{idx + 1}</div>
                          <div className="flex-1">
                            <p className="font-medium">{agent.agent?.username || 'Unknown Agent'}</p>
                            <p className="text-sm text-muted-foreground">{agent.tasks_completed.toLocaleString()} {t.agents.tasks}</p>
                          </div>
                          <div className="w-24">
                            <Progress value={agent.efficiency_score} className="h-2" />
                            <p className="text-xs text-right mt-1">{agent.efficiency_score}% efficiency</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    {t.network.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {networkStatus.map((region) => (
                      <div key={region.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <span className={cn("w-3 h-3 rounded-full", region.status === "online" && "bg-green-500", region.status === "maintenance" && "bg-yellow-500", region.status === "offline" && "bg-red-500")} />
                          <span>{region.region}</span>
                        </div>
                        <div className="text-right">
                          <Badge variant={region.status === "online" ? "default" : region.status === "maintenance" ? "secondary" : "destructive"}>
                            {region.status === "online" && t.network.online}
                            {region.status === "maintenance" && t.network.maintenance}
                            {region.status === "offline" && t.network.offline}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{region.latency_ms}ms</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    {t.charts.topSkills}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topSkills.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No skill data available</p>
                    ) : (
                      topSkills.map((skill) => (
                        <div key={skill.id} className="flex items-center gap-4">
                          <div className="w-32 font-medium truncate">{skill.skill?.name || 'Unknown Skill'}</div>
                          <div className="flex-1">
                            <Progress value={(skill.usage_count / (topSkills[0]?.usage_count || 1)) * 100} className="h-2" />
                          </div>
                          <div className="w-24 text-right">
                            <span className="font-medium">{skill.usage_count.toLocaleString()}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    {t.activity.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <div className={cn("w-2 h-2 rounded-full mt-2", getActivityColor(activity.activity_type))} />
                        <div className="flex-1">
                          <p className="font-medium">{activity.actor_name}</p>
                          <p className="text-xs text-muted-foreground">{formatActivityTime(activity.created_at)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-8">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

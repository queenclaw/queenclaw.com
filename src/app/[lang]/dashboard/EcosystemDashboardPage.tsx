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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

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
      },
    },
  },
  ja: {
    title: "エコシステムダッシュボード",
    subtitle: "OpenClaw エコシステムのリアルタイムインサイト",
    live: "ライブ",
    refresh: "更新",
    stats: {
      totalAgents: "総エージェント数",
      activeUsers: "アクティブユーザー",
      dailyTransactions: "日次取引",
      totalSkills: "総スキル数",
      networkHealth: "ネットワーク健全性",
      avgResponseTime: "平均応答時間",
    },
    charts: {
      activityOverTime: "時間経過によるアクティビティ",
      topSkills: "トップスキル",
      agentDistribution: "エージェント分布",
      recentTransactions: "最近の取引",
    },
    agents: {
      title: "トップパフォーマンスエージェント",
      tasks: "タスク",
      uptime: "稼働時間",
    },
    network: {
      title: "ネットワーク状態",
      online: "オンライン",
      maintenance: "メンテナンス",
      offline: "オフライン",
      regions: ["北米", "ヨーロッパ", "アジア太平洋", "南米"],
    },
    activity: {
      title: "最近のアクティビティ",
      types: {
        agentCreated: "新しいエージェントが作成されました",
        skillPublished: "スキルが公開されました",
        transaction: "取引が完了しました",
        userJoined: "ユーザーが参加しました",
      },
    },
  },
  ko: {
    title: "생태계 대시보드",
    subtitle: "OpenClaw 생태계의 실시간 인사이트",
    live: "실시간",
    refresh: "새로고침",
    stats: {
      totalAgents: "총 에이전트 수",
      activeUsers: "활성 사용자",
      dailyTransactions: "일일 거래",
      totalSkills: "총 스킬 수",
      networkHealth: "네트워크 상태",
      avgResponseTime: "평균 응답 시간",
    },
    charts: {
      activityOverTime: "시간 경과에 따른 활동",
      topSkills: "인기 스킬",
      agentDistribution: "에이전트 분포",
      recentTransactions: "최근 거래",
    },
    agents: {
      title: "최고 성능 에이전트",
      tasks: "작업",
      uptime: "가동 시간",
    },
    network: {
      title: "네트워크 상태",
      online: "온라인",
      maintenance: "유지보수",
      offline: "오프라인",
      regions: ["북미", "유럽", "아시아 태평양", "남미"],
    },
    activity: {
      title: "최근 활동",
      types: {
        agentCreated: "새 에이전트 생성됨",
        skillPublished: "스킬 게시됨",
        transaction: "거래 완료됨",
        userJoined: "사용자 가입",
      },
    },
  },
  es: {
    title: "Panel de Ecosistema",
    subtitle: "Información en tiempo real del ecosistema OpenClaw",
    live: "EN VIVO",
    refresh: "Actualizar",
    stats: {
      totalAgents: "Total de Agentes",
      activeUsers: "Usuarios Activos",
      dailyTransactions: "Transacciones Diarias",
      totalSkills: "Total de Habilidades",
      networkHealth: "Salud de la Red",
      avgResponseTime: "Tiempo de Respuesta Promedio",
    },
    charts: {
      activityOverTime: "Actividad en el Tiempo",
      topSkills: "Habilidades Principales",
      agentDistribution: "Distribución de Agentes",
      recentTransactions: "Transacciones Recientes",
    },
    agents: {
      title: "Agentes Mejor Rendimiento",
      tasks: "tareas",
      uptime: "tiempo activo",
    },
    network: {
      title: "Estado de la Red",
      online: "En línea",
      maintenance: "Mantenimiento",
      offline: "Desconectado",
      regions: ["Norteamérica", "Europa", "Asia Pacífico", "Sudamérica"],
    },
    activity: {
      title: "Actividad Reciente",
      types: {
        agentCreated: "Nuevo agente creado",
        skillPublished: "Habilidad publicada",
        transaction: "Transacción completada",
        userJoined: "Usuario se unió",
      },
    },
  },
  ar: {
    title: "لوحة تحكم النظام البيئي",
    subtitle: "رؤى في الوقت الفعلي لنظام OpenClaw البيئي",
    live: "مباشر",
    refresh: "تحديث",
    stats: {
      totalAgents: "إجمالي الوكلاء",
      activeUsers: "المستخدمين النشطين",
      dailyTransactions: "المعاملات اليومية",
      totalSkills: "إجمالي المهارات",
      networkHealth: "صحة الشبكة",
      avgResponseTime: "متوسط وقت الاستجابة",
    },
    charts: {
      activityOverTime: "النشاط مع مرور الوقت",
      topSkills: "أفضل المهارات",
      agentDistribution: "توزيع الوكلاء",
      recentTransactions: "المعاملات الأخيرة",
    },
    agents: {
      title: "أفضل الوكلاء أداءً",
      tasks: "مهام",
      uptime: "وقت التشغيل",
    },
    network: {
      title: "حالة الشبكة",
      online: "متصل",
      maintenance: "صيانة",
      offline: "غير متصل",
      regions: ["أمريكا الشمالية", "أوروبا", "آسيا والمحيط الهادئ", "أمريكا الجنوبية"],
    },
    activity: {
      title: "النشاط الأخير",
      types: {
        agentCreated: "تم إنشاء وكيل جديد",
        skillPublished: "تم نشر المهارة",
        transaction: "تمت المعاملة",
        userJoined: "انضم المستخدم",
      },
    },
  },
  ru: {
    title: "Панель Экосистемы",
    subtitle: "Данные в реальном времени об экосистеме OpenClaw",
    live: "В ЭФИРЕ",
    refresh: "Обновить",
    stats: {
      totalAgents: "Всего Агентов",
      activeUsers: "Активные Пользователи",
      dailyTransactions: "Ежедневные Транзакции",
      totalSkills: "Всего Навыков",
      networkHealth: "Здоровье Сети",
      avgResponseTime: "Среднее Время Ответа",
    },
    charts: {
      activityOverTime: "Активность Со Временем",
      topSkills: "Топ Навыков",
      agentDistribution: "Распределение Агентов",
      recentTransactions: "Недавние Транзакции",
    },
    agents: {
      title: "Лучшие Агенты",
      tasks: "задач",
      uptime: "время работы",
    },
    network: {
      title: "Статус Сети",
      online: "Онлайн",
      maintenance: "Обслуживание",
      offline: "Офлайн",
      regions: ["Северная Америка", "Европа", "Азиатско-Тихоокеанский", "Южная Америка"],
    },
    activity: {
      title: "Недавняя Активность",
      types: {
        agentCreated: "Создан новый агент",
        skillPublished: "Навык опубликован",
        transaction: "Транзакция завершена",
        userJoined: "Пользователь присоединился",
      },
    },
  },
};

interface EcosystemDashboardPageProps {
  lang: string;
}

// Mock data for the dashboard
const mockStats = {
  totalAgents: 1247,
  activeUsers: 8934,
  dailyTransactions: 15234,
  totalSkills: 456,
  networkHealth: 98,
  avgResponseTime: 45,
};

const mockTopAgents = [
  { name: "AlphaBot", tasks: 15420, uptime: 99.9, efficiency: 98 },
  { name: "BetaMind", tasks: 12350, uptime: 99.7, efficiency: 95 },
  { name: "GammaFlow", tasks: 11200, uptime: 99.8, efficiency: 94 },
  { name: "DeltaCore", tasks: 9870, uptime: 99.5, efficiency: 92 },
  { name: "EpsilonX", tasks: 8650, uptime: 99.6, efficiency: 91 },
];

const mockTopSkills = [
  { name: "Code Review", usage: 2340, trend: 12 },
  { name: "Translation", usage: 1890, trend: 8 },
  { name: "Data Analysis", usage: 1650, trend: -3 },
  { name: "Image Generation", usage: 1420, trend: 25 },
  { name: "Document Processing", usage: 1280, trend: 5 },
];

const mockNetworkStatus = [
  { region: 0, status: "online", latency: 23 },
  { region: 1, status: "online", latency: 45 },
  { region: 2, status: "maintenance", latency: 120 },
  { region: 3, status: "online", latency: 67 },
];

const mockRecentActivity = [
  { type: "agentCreated", name: "NeuralNet v2.0", time: "2 min ago" },
  { type: "skillPublished", name: "Smart Contract Auditor", time: "5 min ago" },
  { type: "transaction", name: "Skill Purchase: $45", time: "8 min ago" },
  { type: "userJoined", name: "user_8291", time: "12 min ago" },
  { type: "skillPublished", name: "PDF Summarizer", time: "15 min ago" },
];

export function EcosystemDashboardPage({ lang }: EcosystemDashboardPageProps) {
  const t = translations[lang as keyof typeof translations] || translations.en;
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const handleRefresh = () => {
    setLastUpdated(new Date());
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    suffix = "",
  }: {
    title: string;
    value: number;
    icon: React.ElementType;
    trend?: number;
    suffix?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">
              {value.toLocaleString()}
              {suffix}
            </p>
            {trend !== undefined && (
              <div
                className={cn(
                  "flex items-center gap-1 text-sm mt-2",
                  trend >= 0 ? "text-green-500" : "text-red-500"
                )}
              >
                {trend >= 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                {t.refresh}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <StatCard
            title={t.stats.totalAgents}
            value={mockStats.totalAgents}
            icon={Bot}
            trend={12}
          />
          <StatCard
            title={t.stats.activeUsers}
            value={mockStats.activeUsers}
            icon={Users}
            trend={8}
          />
          <StatCard
            title={t.stats.dailyTransactions}
            value={mockStats.dailyTransactions}
            icon={Zap}
            trend={-3}
          />
          <StatCard
            title={t.stats.totalSkills}
            value={mockStats.totalSkills}
            icon={Layers}
            trend={15}
          />
          <StatCard
            title={t.stats.networkHealth}
            value={mockStats.networkHealth}
            icon={Globe}
            suffix="%"
          />
          <StatCard
            title={t.stats.avgResponseTime}
            value={mockStats.avgResponseTime}
            icon={Clock}
            suffix="ms"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Agents */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                {t.agents.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTopAgents.map((agent, idx) => (
                  <div
                    key={agent.name}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {agent.tasks.toLocaleString()} {t.agents.tasks} · {" "}
                        {agent.uptime}% {t.agents.uptime}
                      </p>
                    </div>
                    <div className="w-24">
                      <Progress value={agent.efficiency} className="h-2" />
                      <p className="text-xs text-right mt-1">{agent.efficiency}% efficiency</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Network Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                {t.network.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockNetworkStatus.map((region) => (
                  <div
                    key={region.region}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "w-3 h-3 rounded-full",
                          region.status === "online" && "bg-green-500",
                          region.status === "maintenance" && "bg-yellow-500",
                          region.status === "offline" && "bg-red-500"
                        )}
                      />
                      <span>{t.network.regions[region.region]}</span>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          region.status === "online"
                            ? "default"
                            : region.status === "maintenance"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {region.status === "online" && t.network.online}
                        {region.status === "maintenance" && t.network.maintenance}
                        {region.status === "offline" && t.network.offline}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {region.latency}ms
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Skills */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                {t.charts.topSkills}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTopSkills.map((skill) => (
                  <div key={skill.name} className="flex items-center gap-4">
                    <div className="w-32 font-medium">{skill.name}</div>
                    <div className="flex-1">
                      <Progress
                        value={(skill.usage / 2500) * 100}
                        className="h-2"
                      />
                    </div>
                    <div className="w-24 text-right">
                      <span className="font-medium">
                        {skill.usage.toLocaleString()}
                      </span>
                      <span
                        className={cn(
                          "text-xs ml-2",
                          skill.trend >= 0 ? "text-green-500" : "text-red-500"
                        )}
                      >
                        {skill.trend >= 0 ? "+" : ""}
                        {skill.trend}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {t.activity.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockRecentActivity.map((activity, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full mt-2",
                        activity.type === "agentCreated" && "bg-blue-500",
                        activity.type === "skillPublished" && "bg-purple-500",
                        activity.type === "transaction" && "bg-green-500",
                        activity.type === "userJoined" && "bg-orange-500"
                      )}
                    />
                    <div className="flex-1">
                      <p className="text-sm">
                        {activity.type === "agentCreated" && t.activity.types.agentCreated}
                        {activity.type === "skillPublished" && t.activity.types.skillPublished}
                        {activity.type === "transaction" && t.activity.types.transaction}
                        {activity.type === "userJoined" && t.activity.types.userJoined}
                      </p>
                      <p className="font-medium">{activity.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Last Updated */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

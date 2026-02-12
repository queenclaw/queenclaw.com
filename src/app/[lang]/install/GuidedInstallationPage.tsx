"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Settings,
  Key,
  Plug,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Terminal,
  Copy,
  Bot,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const translations = {
  en: {
    title: "Get Started with OpenClaw",
    subtitle: "Follow this step-by-step guide to set up your AI agent ecosystem",
    steps: ["Download", "Configure", "Connect APIs", "Launch"],
    download: {
      title: "Download OpenClaw",
      description: "Choose your platform and download the latest release",
      windows: "Windows", macos: "macOS", linux: "Linux", docker: "Docker",
      version: "Latest Version: v2.1.0",
    },
    configure: {
      title: "Initial Configuration",
      description: "Set up your environment and preferences",
      envFile: "Environment Variables",
      configSteps: [
        "Create .env file in project root",
        "Add your API keys (see next step)",
        "Configure agent preferences",
        "Set up logging options",
      ],
    },
    apis: {
      title: "Connect API Keys",
      description: "Add your API keys to enable agent capabilities",
      required: "Required", optional: "Optional",
      apis: [
        { name: "OpenAI", key: "OPENAI_API_KEY", required: true, desc: "For GPT models" },
        { name: "Anthropic", key: "ANTHROPIC_API_KEY", required: false, desc: "For Claude models" },
        { name: "Google", key: "GOOGLE_API_KEY", required: false, desc: "For Gemini models" },
        { name: "Supabase", key: "SUPABASE_URL, SUPABASE_KEY", required: true, desc: "For database" },
      ],
    },
    launch: {
      title: "Launch Your Agents",
      description: "Start your AI agent ecosystem",
      commands: [
        { label: "Install dependencies", cmd: "npm install" },
        { label: "Start development", cmd: "npm run dev" },
        { label: "Build for production", cmd: "npm run build" },
      ],
      nextSteps: "What's Next?",
      explore: [
        "Browse the Skills Marketplace",
        "Connect with other agents",
        "Join the community forum",
        "Create your first skill",
      ],
    },
    progress: "Step", of: "of", next: "Next", back: "Back", finish: "Finish",
    copy: "Copy", copied: "Copied!",
  },
  zh: {
    title: "开始使用 OpenClaw",
    subtitle: "按照此分步指南设置您的 AI Agent 生态系统",
    steps: ["下载", "配置", "连接 API", "启动"],
    download: {
      title: "下载 OpenClaw",
      description: "选择您的平台并下载最新版本",
      windows: "Windows", macos: "macOS", linux: "Linux", docker: "Docker",
      version: "最新版本: v2.1.0",
    },
    configure: {
      title: "初始配置",
      description: "设置您的环境和偏好",
      envFile: "环境变量",
      configSteps: [
        "在项目根目录创建 .env 文件",
        "添加您的 API 密钥（见下一步）",
        "配置 Agent 偏好设置",
        "设置日志选项",
      ],
    },
    apis: {
      title: "连接 API 密钥",
      description: "添加 API 密钥以启用 Agent 功能",
      required: "必需", optional: "可选",
      apis: [
        { name: "OpenAI", key: "OPENAI_API_KEY", required: true, desc: "用于 GPT 模型" },
        { name: "Anthropic", key: "ANTHROPIC_API_KEY", required: false, desc: "用于 Claude 模型" },
        { name: "Google", key: "GOOGLE_API_KEY", required: false, desc: "用于 Gemini 模型" },
        { name: "Supabase", key: "SUPABASE_URL, SUPABASE_KEY", required: true, desc: "用于数据库" },
      ],
    },
    launch: {
      title: "启动您的 Agents",
      description: "启动您的 AI Agent 生态系统",
      commands: [
        { label: "安装依赖", cmd: "npm install" },
        { label: "启动开发服务器", cmd: "npm run dev" },
        { label: "构建生产版本", cmd: "npm run build" },
      ],
      nextSteps: "接下来做什么？",
      explore: [
        "浏览技能市场",
        "连接其他 Agents",
        "加入社区论坛",
        "创建您的第一个技能",
      ],
    },
    progress: "步骤", of: "/", next: "下一步", back: "上一步", finish: "完成",
    copy: "复制", copied: "已复制!",
  },
  ja: {
    title: "OpenClaw を始める",
    subtitle: "AI エージェントエコシステムを設定するステップバイステップガイド",
    steps: ["ダウンロード", "設定", "API 接続", "起動"],
    download: {
      title: "OpenClaw をダウンロード",
      description: "プラットフォームを選択して最新バージョンをダウンロード",
      windows: "Windows", macos: "macOS", linux: "Linux", docker: "Docker",
      version: "最新バージョン: v2.1.0",
    },
    configure: {
      title: "初期設定",
      description: "環境と設定を構成",
      envFile: "環境変数",
      configSteps: [
        "プロジェクトルートに .env ファイルを作成",
        "API キーを追加（次のステップを参照）",
        "エージェント設定を構成",
        "ログオプションを設定",
      ],
    },
    apis: {
      title: "API キーを接続",
      description: "エージェント機能を有効にするために API キーを追加",
      required: "必須", optional: "オプション",
      apis: [
        { name: "OpenAI", key: "OPENAI_API_KEY", required: true, desc: "GPT モデル用" },
        { name: "Anthropic", key: "ANTHROPIC_API_KEY", required: false, desc: "Claude モデル用" },
        { name: "Google", key: "GOOGLE_API_KEY", required: false, desc: "Gemini モデル用" },
        { name: "Supabase", key: "SUPABASE_URL, SUPABASE_KEY", required: true, desc: "データベース用" },
      ],
    },
    launch: {
      title: "エージェントを起動",
      description: "AI エージェントエコシステムを開始",
      commands: [
        { label: "依存関係をインストール", cmd: "npm install" },
        { label: "開発を開始", cmd: "npm run dev" },
        { label: "本番用にビルド", cmd: "npm run build" },
      ],
      nextSteps: "次は何をしますか？",
      explore: [
        "スキルマーケットを閲覧",
        "他のエージェントと接続",
        "コミュニティフォーラムに参加",
        "最初のスキルを作成",
      ],
    },
    progress: "ステップ", of: "/", next: "次へ", back: "戻る", finish: "完了",
    copy: "コピー", copied: "コピーしました!",
  },
  ko: {
    title: "OpenClaw 시작하기",
    subtitle: "AI 에이전트 생태계를 설정하는 단계별 가이드",
    steps: ["다운로드", "구성", "API 연결", "시작"],
    download: {
      title: "OpenClaw 다운로드",
      description: "플랫폼을 선택하고 최신 버전을 다운로드",
      windows: "Windows", macos: "macOS", linux: "Linux", docker: "Docker",
      version: "최신 버전: v2.1.0",
    },
    configure: {
      title: "초기 구성",
      description: "환경 및 환경 설정",
      envFile: "환경 변수",
      configSteps: [
        "프로젝트 루트에 .env 파일 생성",
        "API 키 추가(다음 단계 참조)",
        "에이전트 환경 설정 구성",
        "로깅 옵션 설정",
      ],
    },
    apis: {
      title: "API 키 연결",
      description: "에이전트 기능을 활성화하려면 API 키를 추가",
      required: "필수", optional: "선택사항",
      apis: [
        { name: "OpenAI", key: "OPENAI_API_KEY", required: true, desc: "GPT 모델용" },
        { name: "Anthropic", key: "ANTHROPIC_API_KEY", required: false, desc: "Claude 모델용" },
        { name: "Google", key: "GOOGLE_API_KEY", required: false, desc: "Gemini 모델용" },
        { name: "Supabase", key: "SUPABASE_URL, SUPABASE_KEY", required: true, desc: "데이터베이스용" },
      ],
    },
    launch: {
      title: "에이전트 시작",
      description: "AI 에이전트 생태계 시작",
      commands: [
        { label: "종속성 설치", cmd: "npm install" },
        { label: "개발 시작", cmd: "npm run dev" },
        { label: "프로덕션 빌드", cmd: "npm run build" },
      ],
      nextSteps: "다음 단계는?",
      explore: [
        "스킬 마켓플레이스 탐색",
        "다른 에이전트와 연결",
        "커뮤니티 포럼 참여",
        "첫 번째 스킬 만들기",
      ],
    },
    progress: "단계", of: "/", next: "다음", back: "이전", finish: "완료",
    copy: "복사", copied: "복사됨!",
  },
  es: {
    title: "Comenzar con OpenClaw",
    subtitle: "Sigue esta guía paso a paso para configurar tu ecosistema de agentes AI",
    steps: ["Descargar", "Configurar", "Conectar APIs", "Iniciar"],
    download: {
      title: "Descargar OpenClaw",
      description: "Elige tu plataforma y descarga la última versión",
      windows: "Windows", macos: "macOS", linux: "Linux", docker: "Docker",
      version: "Última Versión: v2.1.0",
    },
    configure: {
      title: "Configuración Inicial",
      description: "Configura tu entorno y preferencias",
      envFile: "Variables de Entorno",
      configSteps: [
        "Crear archivo .env en la raíz del proyecto",
        "Agregar tus claves API (ver siguiente paso)",
        "Configurar preferencias del agente",
        "Configurar opciones de registro",
      ],
    },
    apis: {
      title: "Conectar Claves API",
      description: "Agrega tus claves API para habilitar capacidades del agente",
      required: "Requerido", optional: "Opcional",
      apis: [
        { name: "OpenAI", key: "OPENAI_API_KEY", required: true, desc: "Para modelos GPT" },
        { name: "Anthropic", key: "ANTHROPIC_API_KEY", required: false, desc: "Para modelos Claude" },
        { name: "Google", key: "GOOGLE_API_KEY", required: false, desc: "Para modelos Gemini" },
        { name: "Supabase", key: "SUPABASE_URL, SUPABASE_KEY", required: true, desc: "Para base de datos" },
      ],
    },
    launch: {
      title: "Iniciar tus Agentes",
      description: "Inicia tu ecosistema de agentes AI",
      commands: [
        { label: "Instalar dependencias", cmd: "npm install" },
        { label: "Iniciar desarrollo", cmd: "npm run dev" },
        { label: "Compilar para producción", cmd: "npm run build" },
      ],
      nextSteps: "¿Qué sigue?",
      explore: [
        "Explorar el Mercado de Habilidades",
        "Conectar con otros agentes",
        "Unirse al foro de la comunidad",
        "Crear tu primera habilidad",
      ],
    },
    progress: "Paso", of: "de", next: "Siguiente", back: "Atrás", finish: "Finalizar",
    copy: "Copiar", copied: "¡Copiado!",
  },
  ar: {
    title: "البدء مع OpenClaw",
    subtitle: "اتبع هذا الدليل خطوة بخطوة لإعداد نظام الوكلاء AI الخاص بك",
    steps: ["تنزيل", "تكوين", "توصيل APIs", "تشغيل"],
    download: {
      title: "تنزيل OpenClaw",
      description: "اختر منصتك وقم بتنزيل الإصدار الأحدث",
      windows: "Windows", macos: "macOS", linux: "Linux", docker: "Docker",
      version: "أحدث إصدار: v2.1.0",
    },
    configure: {
      title: "التكوين الأولي",
      description: "إعداد بيئتك وتفضيلاتك",
      envFile: "متغيرات البيئة",
      configSteps: [
        "إنشاء ملف .env في جذر المشروع",
        "إضافة مفاتيح API (راجع الخطوة التالية)",
        "تكوين تفضيلات الوكيل",
        "إعداد خيارات التسجيل",
      ],
    },
    apis: {
      title: "توصيل مفاتيح API",
      description: "أضف مفاتيح API لتمكين قدرات الوكيل",
      required: "مطلوب", optional: "اختياري",
      apis: [
        { name: "OpenAI", key: "OPENAI_API_KEY", required: true, desc: "لنماذج GPT" },
        { name: "Anthropic", key: "ANTHROPIC_API_KEY", required: false, desc: "لنماذج Claude" },
        { name: "Google", key: "GOOGLE_API_KEY", required: false, desc: "لنماذج Gemini" },
        { name: "Supabase", key: "SUPABASE_URL, SUPABASE_KEY", required: true, desc: "لقاعدة البيانات" },
      ],
    },
    launch: {
      title: "تشغيل الوكلاء الخاصة بك",
      description: "ابدأ نظام الوكلاء AI الخاص بك",
      commands: [
        { label: "تثبيت التبعيات", cmd: "npm install" },
        { label: "بدء التطوير", cmd: "npm run dev" },
        { label: "البناء للإنتاج", cmd: "npm run build" },
      ],
      nextSteps: "ما التالي؟",
      explore: [
        "تصفح سوق المهارات",
        "التواصل مع الوكلاء الآخرين",
        "الانضمام إلى منتدى المجتمع",
        "إنشاء مهارتك الأولى",
      ],
    },
    progress: "الخطوة", of: "من", next: "التالي", back: "السابق", finish: "إنهاء",
    copy: "نسخ", copied: "تم النسخ!",
  },
  ru: {
    title: "Начало работы с OpenClaw",
    subtitle: "Следуйте этому пошаговому руководству, чтобы настроить экосистему AI-агентов",
    steps: ["Загрузка", "Настройка", "Подключение API", "Запуск"],
    download: {
      title: "Загрузить OpenClaw",
      description: "Выберите вашу платформу и загрузите последнюю версию",
      windows: "Windows", macos: "macOS", linux: "Linux", docker: "Docker",
      version: "Последняя версия: v2.1.0",
    },
    configure: {
      title: "Начальная настройка",
      description: "Настройте свою среду и предпочтения",
      envFile: "Переменные среды",
      configSteps: [
        "Создать файл .env в корне проекта",
        "Добавить ваши API-ключи (см. следующий шаг)",
        "Настроить предпочтения агента",
        "Настроить параметры логирования",
      ],
    },
    apis: {
      title: "Подключить API-ключи",
      description: "Добавьте API-ключи для включения возможностей агента",
      required: "Обязательно", optional: "Опционально",
      apis: [
        { name: "OpenAI", key: "OPENAI_API_KEY", required: true, desc: "Для моделей GPT" },
        { name: "Anthropic", key: "ANTHROPIC_API_KEY", required: false, desc: "Для моделей Claude" },
        { name: "Google", key: "GOOGLE_API_KEY", required: false, desc: "Для моделей Gemini" },
        { name: "Supabase", key: "SUPABASE_URL, SUPABASE_KEY", required: true, desc: "Для базы данных" },
      ],
    },
    launch: {
      title: "Запустить ваших агентов",
      description: "Запустите экосистему AI-агентов",
      commands: [
        { label: "Установить зависимости", cmd: "npm install" },
        { label: "Запустить разработку", cmd: "npm run dev" },
        { label: "Собрать для продакшена", cmd: "npm run build" },
      ],
      nextSteps: "Что дальше?",
      explore: [
        "Изучить торговую площадку навыков",
        "Подключиться к другим агентам",
        "Присоединиться к форуму сообщества",
        "Создать свой первый навык",
      ],
    },
    progress: "Шаг", of: "из", next: "Далее", back: "Назад", finish: "Завершить",
    copy: "Копировать", copied: "Скопировано!",
  },
};

interface GuidedInstallationPageProps {
  lang: string;
}

export function GuidedInstallationPage({ lang }: GuidedInstallationPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const t = translations[lang as keyof typeof translations] || translations.en;

  const steps = [
    { icon: Download, label: t.steps[0] },
    { icon: Settings, label: t.steps[1] },
    { icon: Key, label: t.steps[2] },
    { icon: Plug, label: t.steps[3] },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "🪟", label: t.download.windows },
                { icon: "🍎", label: t.download.macos },
                { icon: "🐧", label: t.download.linux },
                { icon: "🐳", label: t.download.docker },
              ].map((platform) => (
                <Card key={platform.label} className="cursor-pointer hover:border-primary transition-colors group">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{platform.icon}</div>
                    <p className="font-medium">{platform.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Terminal className="w-4 h-4" />
                  <code className="bg-background px-2 py-1 rounded">git clone https://github.com/openclaw/openclaw.git</code>
                  <Button variant="ghost" size="sm" onClick={() => handleCopy("git clone https://github.com/openclaw/openclaw.git")}>
                    {copiedCmd === "git clone https://github.com/openclaw/openclaw.git" ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
            <p className="text-center text-sm text-muted-foreground">{t.download.version}</p>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />{t.configure.envFile}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {t.configure.configSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary flex-shrink-0">{idx + 1}</div>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <p className="text-sm font-medium mb-2">.env.example:</p>
                <pre className="text-xs text-muted-foreground overflow-x-auto"><code>{`# Required
OPENAI_API_KEY=your_openai_key_here
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

# Optional
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_API_KEY=your_google_key`}</code></pre>
              </CardContent>
            </Card>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            {t.apis.apis.map((api) => (
              <Card key={api.name}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{api.name}</span>
                      <Badge variant={api.required ? "default" : "secondary"}>{api.required ? t.apis.required : t.apis.optional}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{api.desc}</p>
                  <div className="flex items-center gap-2 bg-muted p-2 rounded">
                    <code className="text-sm flex-1">{api.key}</code>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(api.key)}>
                      {copiedCmd === api.key ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              {t.launch.commands.map((cmd) => (
                <Card key={cmd.cmd}>
                  <CardContent className="p-4">
                    <p className="text-sm font-medium mb-2">{cmd.label}</p>
                    <div className="flex items-center gap-2 bg-muted p-2 rounded">
                      <Terminal className="w-4 h-4 text-muted-foreground" />
                      <code className="text-sm flex-1">{cmd.cmd}</code>
                      <Button variant="ghost" size="sm" onClick={() => handleCopy(cmd.cmd)}>
                        {copiedCmd === cmd.cmd ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />{t.launch.nextSteps}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {t.launch.explore.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />{item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t.title}</h1>
              <p className="text-muted-foreground">{t.subtitle}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = idx === currentStep;
                const isCompleted = idx < currentStep;
                return (
                  <div key={idx} className="flex items-center">
                    <div className={cn("flex flex-col items-center gap-2", isActive && "text-primary", isCompleted && "text-green-500")}>
                      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-colors", isActive && "bg-primary text-primary-foreground", isCompleted && "bg-green-500 text-white", !isActive && !isCompleted && "bg-muted")}>
                        {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                      </div>
                      <span className="text-xs font-medium hidden sm:block">{step.label}</span>
                    </div>
                    {idx < steps.length - 1 && <div className={cn("w-12 sm:w-20 h-0.5 mx-2 transition-colors", isCompleted ? "bg-green-500" : "bg-muted")} />}
                  </div>
                );
              })}
            </div>
            <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
            <p className="text-center text-sm text-muted-foreground mt-2">{t.progress} {currentStep + 1} {t.of} {steps.length}</p>
          </div>
          <div key={currentStep} className="transition-all duration-200">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {(() => { const Icon = steps[currentStep].icon; return <Icon className="w-5 h-5" />; })()}
                  {currentStep === 0 && t.download.title}
                  {currentStep === 1 && t.configure.title}
                  {currentStep === 2 && t.apis.title}
                  {currentStep === 3 && t.launch.title}
                </CardTitle>
                <p className="text-muted-foreground">
                  {currentStep === 0 && t.download.description}
                  {currentStep === 1 && t.configure.description}
                  {currentStep === 2 && t.apis.description}
                  {currentStep === 3 && t.launch.description}
                </p>
              </CardHeader>
              <CardContent>{renderStepContent()}</CardContent>
            </Card>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))} disabled={currentStep === 0}>
              <ChevronLeft className="w-4 h-4 mr-2" />{t.back}
            </Button>
            <Button onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))} disabled={currentStep === steps.length - 1}>
              {t.next}<ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import {
  Globe,
  Smartphone,
  MessageSquare,
  Mic,
  Cpu,
  Mail,
  ShoppingCart,
  PhoneCall,
  Calendar,
  FileSpreadsheet,
  Share2,
  Database,
  ShieldAlert,
  Headphones,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Play,
  X,
  ExternalLink,
  Activity,
  Layers,
} from 'lucide-react';
import { NeuralNetworkBackground } from './NeuralNetworkBackground';

interface CoreService {
  id: string;
  name: string;
  tagline: string;
  icon: any;
  color: string;
  badge: string;
  description: string;
  howItWorks: string[];
  features: string[];
}

interface AutomationType {
  id: number;
  title: string;
  category: string;
  icon: any;
  difficulty: 'Quick Setup' | 'Enterprise' | 'Smart AI';
  trigger: string;
  action: string;
  howItWorks: string;
  exampleUse: string;
  benefits: string;
}

export const ServicesAndAutomationsHub: React.FC = () => {
  const [selectedService, setSelectedService] = useState<CoreService | null>(null);
  const [selectedAutomation, setSelectedAutomation] = useState<AutomationType | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'core' | 'automations'>('all');
  const [simulatedAutomationId, setSimulatedAutomationId] = useState<number | null>(null);

  // 4 Core Offerings: Website, App, AI Chatbot, AI Voice Agent
  const coreServices: CoreService[] = [
    {
      id: 'website',
      name: 'Custom Web Applications',
      tagline: 'High-speed, responsive, modern SaaS and enterprise portals',
      icon: Globe,
      color: 'from-blue-600 to-indigo-700',
      badge: 'Web 3.0 & SaaS',
      description: 'Ultra-fast Next.js / React single-page applications and responsive company websites optimized for SEO, instant load speeds, 3D interactive graphics, and seamless payment gateway integration.',
      howItWorks: [
        '1. Architecture & UI/UX design blueprinting tailored to brand aesthetic.',
        '2. Front-end engineering with React, Tailwind CSS, 3D Canvas visualizers.',
        '3. Secure backend integration (Auth, Postgres, Cloud SQL, Edge APIs).',
        '4. Global CDN deployment with sub-100ms response time and SSL certificates.',
      ],
      features: ['Sub-second page speeds', 'Mobile-first responsive design', 'Integrated analytics & CRM forms', 'SEO & OpenGraph social ready'],
    },
    {
      id: 'app',
      name: 'Cross-Platform Mobile Apps',
      tagline: 'Native Android & iOS applications with cloud backend',
      icon: Smartphone,
      color: 'from-purple-600 to-pink-700',
      badge: 'Android & iOS',
      description: 'Feature-rich mobile applications built for smooth native performance, offline synchronization, push notifications, and biometrics on both Android and iOS devices.',
      howItWorks: [
        '1. Native UI/UX prototyping with intuitive gesture controls.',
        '2. State synchronization and local caching for offline capability.',
        '3. Firebase / Cloud backend with real-time push notification pipelines.',
        '4. Google Play Store & Apple App Store packaging and deployment.',
      ],
      features: ['Smooth 60fps animations', 'Push notification campaigns', 'Secure biometric login', 'Real-time database sync'],
    },
    {
      id: 'chatbot',
      name: 'Intelligent AI Chatbots',
      tagline: 'Multi-turn contextual LLM assistant trained on your business data',
      icon: MessageSquare,
      color: 'from-red-600 to-rose-700',
      badge: 'Gemini 3.8 Powered',
      description: 'Enterprise AI conversational agent that answers customer queries 24/7, handles lead generation, supports Hindi/English/Hinglish, and integrates with WhatsApp and CRM.',
      howItWorks: [
        '1. Ingestion of your products, FAQs, pricing, and company handbook.',
        '2. Vector database embeddings with semantic similarity retrieval (RAG).',
        '3. Server-side Gemini LLM generation with prompt guardrails.',
        '4. Multi-channel deployment on your website, WhatsApp, and Telegram.',
      ],
      features: ['Zero hallucination guardrails', 'Lead capture & automatic emailing', 'Multi-lingual understanding', 'WhatsApp & CRM syncing'],
    },
    {
      id: 'voice-agent',
      name: 'AI Real-Time Voice Agent',
      tagline: 'Hands-free voice recognition with natural speech vocalization',
      icon: Mic,
      color: 'from-emerald-600 to-teal-700',
      badge: 'Real-Time Voice',
      description: 'Conversational voice assistant that listens via microphone, processes natural language in real-time, and responds with lifelike voice audio.',
      howItWorks: [
        '1. Web Speech API captures spoken audio and transforms it into live transcript.',
        '2. Low-latency AI reasoning engine computes immediate intelligent answer.',
        '3. Text-to-Speech (TTS) synthesizer vocalizes answer with natural tone.',
        '4. Dynamic pulsing visualizer synchronizes with audio amplitudes.',
      ],
      features: ['Hands-free phone & mic mode', 'Instant sub-second response', 'Bilingual voice synthesis', 'Interactive audio visualizer'],
    },
  ];

  // 10 Types of Real-World Automations
  const automations: AutomationType[] = [
    {
      id: 1,
      title: 'WhatsApp Lead Auto-Responder',
      category: 'Sales & Support',
      icon: PhoneCall,
      difficulty: 'Quick Setup',
      trigger: 'When a new message or lead arrives on WhatsApp (+91 7814863709)',
      action: 'Instantly categorizes lead, sends welcome brochure & notifies sales agent',
      howItWorks: 'Webhook triggers AI engine upon receiving WhatsApp message -> Analyzes query intent -> Pulls relevant PDF or reply -> Updates CRM sheet with contact details.',
      exampleUse: 'Customer asks for pricing at midnight; system immediately replies with tailored catalog and schedules callback.',
      benefits: '100% instant lead engagement within 3 seconds, zero missed sales.',
    },
    {
      id: 2,
      title: 'Smart Email Lead Scraping & Auto-Reply',
      category: 'Marketing',
      icon: Mail,
      difficulty: 'Smart AI',
      trigger: 'Customer submits contact form or sends email to mr.jeet325@gmail.com',
      action: 'Parses email body, generates contextual reply & creates ticket in CRM',
      howItWorks: 'Email listener hooks incoming mail -> Gemini AI reads request -> Prepares personalized draft -> Sends acknowledgment and alerts Ranjeet Yadav.',
      exampleUse: 'Inquiry about website quotation triggers automated estimate calculation and calendar meeting link.',
      benefits: 'Reduces email response latency from 6 hours to 45 seconds.',
    },
    {
      id: 3,
      title: 'E-Commerce Order & Inventory Sync',
      category: 'E-Commerce',
      icon: ShoppingCart,
      difficulty: 'Enterprise',
      trigger: 'New order placed in online store or app',
      action: 'Decrements warehouse inventory, creates shipping label & sends WhatsApp tracking',
      howItWorks: 'Payment gateway confirms receipt -> Auto updates inventory DB -> Calls courier API (Delhivery/Shiprocket) -> Dispatches WhatsApp invoice to customer.',
      exampleUse: 'Customer orders product; immediately receives tracking link and warehouse staff gets printable packing slip.',
      benefits: 'Eliminates overselling and saves 4+ hours of manual order dispatch daily.',
    },
    {
      id: 4,
      title: 'Automated Calendar & Meeting Scheduler',
      category: 'Productivity',
      icon: Calendar,
      difficulty: 'Quick Setup',
      trigger: 'Client requests demo or consultation with Ranjeet Yadav',
      action: 'Checks real-time availability, books Google Calendar slot & sends Google Meet link',
      howItWorks: 'Bot shares interactive calendar widget -> Client picks slot -> Syncs with Google Calendar API -> Sends auto reminder 30 mins prior.',
      exampleUse: 'Seamless consultation booking without 10 back-and-forth emails.',
      benefits: 'Zero double-booking and 40% reduction in no-shows via automated SMS/WhatsApp alerts.',
    },
    {
      id: 5,
      title: 'Google Sheets & Database Real-Time Pipeline',
      category: 'Data Operations',
      icon: FileSpreadsheet,
      difficulty: 'Quick Setup',
      trigger: 'Any website registration, inquiry or transaction occurs',
      action: 'Auto-logs row into Google Sheets and cloud PostgreSQL database concurrently',
      howItWorks: 'Server event pushes structured JSON -> Formats row -> Inserts into Google Sheets via Service Account -> Triggers daily backup snapshot.',
      exampleUse: 'Founder can view all daily leads directly on smartphone Google Sheets without opening database dashboard.',
      benefits: 'Real-time visibility for non-technical stakeholders without manual exports.',
    },
    {
      id: 6,
      title: 'Social Media AI Content Cross-Posting',
      category: 'Branding',
      icon: Share2,
      difficulty: 'Smart AI',
      trigger: 'New blog post, project launch, or product update published',
      action: 'Generates tailored captions for LinkedIn, X (Twitter), Instagram & posts automatically',
      howItWorks: 'CMS webhook detects new article -> Gemini creates platform-specific captions with hashtags -> Schedules publication at peak audience hours.',
      exampleUse: 'Launching new AI feature immediately propagates across 4 social channels with matching graphics.',
      benefits: 'Maintains active social presence with 90% less manual copy editing.',
    },
    {
      id: 7,
      title: 'Customer Voice Call Transcription & AI Summary',
      category: 'Telephony',
      icon: Headphones,
      difficulty: 'Smart AI',
      trigger: 'Inbound or outbound customer support call concludes',
      action: 'Transcribes audio recording, detects customer sentiment & extracts action items',
      howItWorks: 'Telephony webhook pushes audio file -> Speech-to-text generates transcript -> AI summarizes pain points and marks sentiment (Happy/Frustrated).',
      exampleUse: 'Quality assurance manager receives 3-bullet summary of 20-minute client call with key deliverables.',
      benefits: 'Instant dispute resolution and 100% auditable client requirements.',
    },
    {
      id: 8,
      title: 'Automated Invoice & Payment Reminder Bot',
      category: 'Finance',
      icon: Database,
      difficulty: 'Enterprise',
      trigger: 'Invoice due date reaches 3 days prior or overdue',
      action: 'Sends gentle automated WhatsApp & email payment link with 1-click UPI pay',
      howItWorks: 'Cron job scans billing database daily at 09:00 AM -> Filters pending payments -> Generates dynamic Razorpay/UPI link -> Sends reminder.',
      exampleUse: 'Client receives friendly WhatsApp notification with direct GPay/PhonePe button to clear balance.',
      benefits: 'Accelerates cash flow and cuts unpaid invoice delays by 55%.',
    },
    {
      id: 9,
      title: '24/7 Server Health & Downtime Auto-Recovery',
      category: 'DevOps',
      icon: ShieldAlert,
      difficulty: 'Enterprise',
      trigger: 'API latency spikes above 500ms or 500 error code detected',
      action: 'Restarts container instance, switches traffic to backup node & alerts admin via SMS',
      howItWorks: 'Synthetics monitoring pings endpoint every 30 seconds -> Failure triggers cloud restart hook -> Pushes urgent SMS alert to +91 7814863709.',
      exampleUse: 'Cloud server restarts automatically within 15 seconds of memory leak before users notice any downtime.',
      benefits: 'Guarantees 99.9% uptime without requiring engineers on 24/7 manual watch.',
    },
    {
      id: 10,
      title: 'AI Document & Receipt OCR Processing',
      category: 'Enterprise AI',
      icon: Cpu,
      difficulty: 'Enterprise',
      trigger: 'User uploads PDF invoice, GST bill, or ID card',
      action: 'Extracts tabular text, validates PAN/GSTIN numbers & writes to accounting software',
      howItWorks: 'Document uploaded to secure cloud storage -> Vision AI OCR extracts line items, totals, and tax numbers -> Validates formatting -> Ingests into ERP.',
      exampleUse: 'Vendor sends 50-page PDF bill; all line items extracted and mapped to accounting vouchers in 8 seconds.',
      benefits: 'Replaces tedious manual data entry and eliminates human typing errors.',
    },
  ];

  const handleSimulateAutomation = (id: number) => {
    setSimulatedAutomationId(id);
    setTimeout(() => {
      setSimulatedAutomationId(null);
    }, 3200);
  };

  return (
    <section id="services-automations-hub" className="w-full mt-8 p-4 sm:p-6 lg:p-8 rounded-[28px] bg-[#0c0608] border border-[#ff2a3a]/30 shadow-2xl text-white font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff2a3a]/20 border border-[#ff2a3a]/40 text-red-400 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Products & Capabilities</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
            Our Products: Websites, Apps, AI Chatbot, Voice Agent & <span className="text-[#ff3045]">10 Automations</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
            Complete suite of technological products by <strong>Ranjeet Yadav</strong> (Adarsh Nagar, Shikohabad).
            Explore live specs, test simulations, and see how each product operates.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#170a0e] p-1.5 rounded-2xl border border-white/10 self-start sm:self-center">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'all' ? 'bg-[#ff2a3a] text-white shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => setActiveTab('core')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'core' ? 'bg-[#ff2a3a] text-white shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            4 Core Products
          </button>
          <button
            onClick={() => setActiveTab('automations')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'automations' ? 'bg-[#ff2a3a] text-white shadow-md' : 'text-neutral-400 hover:text-white'
            }`}
          >
            10 Automations Suite
          </button>
        </div>
      </div>

      {/* 3D VIDEO NEURAL AUTOMATION MESH CENTERPIECE */}
      <div className="mt-8 relative rounded-3xl overflow-hidden border border-cyan-500/30 bg-[#080508] shadow-[0_0_40px_rgba(6,182,212,0.18)]">
        {/* Top Header Inside 3D Mesh Card */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 bg-[#0d070a]/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.5)]">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                  Interactive 3D Video Synapse Mesh
                </span>
                <span className="text-xs text-neutral-400 hidden md:inline">
                  Move mouse to tilt & interact with live automation nodes
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight mt-0.5">
                Central AI Brain & Autonomous Branching Automation Network
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Mesh Active</span>
            </span>
            <a
              href="https://wa.me/917814863709?text=Hello%20Ranjeet%20Yadav%20ji%2C%20I%20want%20to%20implement%203D%20AI%20Automation%20Engine"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5 shadow-md"
            >
              <span>Connect on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* 3D Interactive Canvas & Parallax Tilt Brain View */}
        <div className="p-2 sm:p-4">
          <NeuralNetworkBackground
            className="h-[420px] sm:h-[480px] md:h-[540px]"
            onNodeClick={(title) => {
              // Map node click to open corresponding core service or automation
              const lower = title.toLowerCase();
              if (lower.includes('website')) {
                setSelectedService(coreServices.find((s) => s.id === 'website') || null);
              } else if (lower.includes('app')) {
                setSelectedService(coreServices.find((s) => s.id === 'mobile-app') || null);
              } else if (lower.includes('voice')) {
                setSelectedService(coreServices.find((s) => s.id === 'voice-agent') || null);
              } else if (lower.includes('sales')) {
                setSelectedAutomation(automations.find((a) => a.id === 1) || null);
              } else if (lower.includes('support')) {
                setSelectedService(coreServices.find((s) => s.id === 'chatbot') || null);
              } else if (lower.includes('marketing')) {
                setSelectedAutomation(automations.find((a) => a.id === 6) || null);
              }
            }}
          />
        </div>
      </div>

      {/* SECTION 1: THE 4 CORE PILLARS (Website, App, AI Chatbot, AI Voice Agent) */}
      {(activeTab === 'all' || activeTab === 'core') && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff2a3a]" />
              4 Core Technology Pillars
            </h3>
            <span className="text-xs text-neutral-500">Click any card to inspect workflow details</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {coreServices.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className="group relative p-5 rounded-2xl bg-[#14080b]/90 hover:bg-[#1e0d13] border border-[#ff2a3a]/25 hover:border-[#ff2a3a]/60 transition-all duration-300 shadow-lg cursor-pointer flex flex-col justify-between hover:scale-[1.02]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white shadow-md`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 border border-white/10">
                        {service.badge}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-red-400 transition-colors">
                      {service.name}
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed line-clamp-2">
                      {service.tagline}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-red-400 font-semibold">
                    <span>How it works</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: 10 TYPES OF REAL-WORLD AUTOMATIONS */}
      {(activeTab === 'all' || activeTab === 'automations') && (
        <div className="mt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                10 Types of Intelligent Automations
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Every automation can be customized and connected to WhatsApp, CRM, Google Sheets, or ERP.
              </p>
            </div>
            <span className="text-xs text-neutral-400 font-medium">Click card to view working flow</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
            {automations.map((auto) => {
              const Icon = auto.icon;
              const isSimulating = simulatedAutomationId === auto.id;

              return (
                <div
                  key={auto.id}
                  onClick={() => setSelectedAutomation(auto)}
                  className="relative p-5 rounded-2xl bg-[#13070b]/90 hover:bg-[#1c0b11] border border-white/10 hover:border-[#ff2a3a]/40 transition-all duration-200 shadow-md cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    {/* Header line */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#220d14] border border-[#ff2a3a]/30 flex items-center justify-center text-[#ff3344] group-hover:scale-105 transition-transform">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                            #{auto.id} • {auto.category}
                          </span>
                          <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                            {auto.title}
                          </h4>
                        </div>
                      </div>

                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                        auto.difficulty === 'Quick Setup'
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                          : auto.difficulty === 'Smart AI'
                          ? 'bg-purple-950/60 text-purple-300 border-purple-500/30'
                          : 'bg-blue-950/60 text-blue-300 border-blue-500/30'
                      }`}>
                        {auto.difficulty}
                      </span>
                    </div>

                    {/* Trigger & Action Pipeline Box */}
                    <div className="mt-3 p-3 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs">
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded shrink-0">
                          When
                        </span>
                        <span className="text-neutral-300">{auto.trigger}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded shrink-0">
                          Then
                        </span>
                        <span className="text-neutral-200 font-medium">{auto.action}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-neutral-400 text-[11px] truncate max-w-[240px]">
                      {auto.benefits}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSimulateAutomation(auto.id);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
                        isSimulating
                          ? 'bg-emerald-600 text-white animate-pulse'
                          : 'bg-white/10 hover:bg-[#ff2a3a] text-white'
                      }`}
                    >
                      {isSimulating ? (
                        <>
                          <Zap className="w-3 h-3 fill-current" />
                          <span>Simulated!</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          <span>Test Flow</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL 1: CORE SERVICE DEEP DIVE */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="relative w-full max-w-xl p-6 sm:p-7 rounded-3xl bg-[#12070a] border border-[#ff2a3a]/40 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${selectedService.color} flex items-center justify-center text-white shadow-lg`}>
                  {React.createElement(selectedService.icon, { className: 'w-6 h-6' })}
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-white">{selectedService.name}</h3>
                  <span className="text-xs text-red-400 font-semibold">{selectedService.tagline}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedService(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {selectedService.description}
              </p>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2">
                  Architecture & How It Works:
                </h4>
                <div className="space-y-2">
                  {selectedService.howItWorks.map((step, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-neutral-200">
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Included Features:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {selectedService.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.04]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-neutral-300">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/917814863709?text=Hello%20Ranjeet%20Yadav%20ji%2C%20I%20am%20interested%20in%20building%20a%20${encodeURIComponent(selectedService.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition"
                >
                  <span>Build This With Ranjeet Yadav (+91 7814863709)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: AUTOMATION DEEP DIVE */}
      {selectedAutomation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedAutomation(null)}
        >
          <div
            className="relative w-full max-w-xl p-6 sm:p-7 rounded-3xl bg-[#12070a] border border-[#ff2a3a]/40 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2b1016] border border-red-500/40 flex items-center justify-center text-red-400">
                  {React.createElement(selectedAutomation.icon, { className: 'w-5 h-5' })}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400">
                    Automation #{selectedAutomation.id} • {selectedAutomation.category}
                  </span>
                  <h3 className="font-extrabold text-lg text-white">{selectedAutomation.title}</h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedAutomation(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs sm:text-sm">
              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                    TRIGGER
                  </span>
                  <p className="text-neutral-200">{selectedAutomation.trigger}</p>
                </div>
                <div className="flex items-start gap-2 pt-1 border-t border-white/5">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                    ACTION
                  </span>
                  <p className="text-neutral-100 font-semibold">{selectedAutomation.action}</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-1.5">
                  Kese Kaam Karta Hai (How It Works):
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  {selectedAutomation.howItWorks}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Real-World Example:
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  {selectedAutomation.exampleUse}
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs">
                <span className="text-neutral-300">Business Benefit:</span>
                <span className="text-emerald-400 font-bold">{selectedAutomation.benefits}</span>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/917814863709?text=Hello%20Ranjeet%20Yadav%20ji%2C%20I%20want%20to%20implement%20Automation%20%23${selectedAutomation.id}%20(${encodeURIComponent(selectedAutomation.title)})`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition"
                >
                  <span>Deploy This Automation (+91 7814863709)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

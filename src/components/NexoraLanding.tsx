import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Moon,
  Sun,
  Shield,
  Bot,
  BarChart3,
  Boxes,
  Maximize2,
  Search,
  CheckCircle2,
  ChevronRight,
  Zap,
  MessageCircle,
  Globe,
  Smartphone,
  MessageSquare,
  Mic,
  Cpu,
  LogIn,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { GlobeCanvas } from './GlobeCanvas';

interface NexoraLandingProps {
  onExpand?: () => void;
  isFullScreen?: boolean;
}

export const NexoraLanding: React.FC<NexoraLandingProps> = ({
  onExpand,
  isFullScreen = false,
}) => {
  const [activeNav, setActiveNav] = useState('Home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [showFeatureModal, setShowFeatureModal] = useState<string | null>(null);

  const [submittedEmail, setSubmittedEmail] = useState(false);
  const { user, logout, loading: authLoading, openAuthModal, setCurrentView } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  const handleAuthAction = async () => {
    try {
      setAuthError(null);
      if (user) {
        await logout();
      } else {
        openAuthModal('login');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication failed');
    }
  };

  const navItems = ['Home', 'Features', 'Automations', 'Solutions', 'Resources', 'Pricing', 'Contact'];

  const stats = [
    { value: '99.9%', label: 'Uptime' },
    { value: '10K+', label: 'Active Users' },
    { value: '50+', label: 'Integrations' },
    { value: '24/7', label: 'Support' },
  ];

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#070506] text-white select-none transition-all duration-300 font-['Plus_Jakarta_Sans',sans-serif] ${
        isFullScreen ? 'min-h-screen rounded-none' : 'rounded-[20px] shadow-2xl border border-[#2b1216]'
      }`}
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 38%, rgba(220, 20, 40, 0.22) 0%, rgba(140, 10, 25, 0.12) 35%, rgba(7, 5, 6, 0.95) 75%),
          radial-gradient(circle at 10% 20%, rgba(180, 20, 40, 0.08) 0%, transparent 40%),
          radial-gradient(circle at 90% 80%, rgba(200, 20, 40, 0.08) 0%, transparent 40%)
        `,
      }}
    >
      {/* Top Subtle Crimson Glow Beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#ff2a3a]/15 via-[#ff2a3a]/5 to-transparent blur-2xl pointer-events-none" />

      {/* Main Container */}
      <div className={`relative z-10 flex flex-col justify-between h-full ${isFullScreen ? 'max-w-7xl mx-auto px-6 py-6' : 'p-4 sm:p-5 md:p-6'}`}>
        
        {/* Navigation Bar */}
        <nav className="flex items-center justify-between w-full border-b border-white/[0.06] pb-3.5 pt-1">
          {/* Brand Logo - Integrated Om & Technologies */}
          <div className="flex items-center cursor-pointer group select-none">
            {/* Unified Glass Badge with prominent ॐ + refined compact TECHNOLOGIES */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#ff2a3a]/25 via-[#ff2a3a]/15 to-transparent border border-[#ff3344]/35 shadow-[0_0_16px_rgba(255,42,58,0.35)] backdrop-blur-md group-hover:border-[#ff3344]/60 group-hover:shadow-[0_0_24px_rgba(255,42,58,0.55)] transition-all duration-300">
              <span className="flex items-center justify-center text-[#ff3344] text-2xl font-black leading-none drop-shadow-[0_0_12px_rgba(255,50,70,0.95)] group-hover:scale-105 transition-transform">
                ॐ
              </span>
              <span className="font-bold tracking-[0.24em] text-[10.5px] text-neutral-200 uppercase leading-none drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]">
                <span className="text-[#ff4155] font-extrabold">Tech</span>nologies
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:flex items-center gap-6 md:gap-7 text-xs font-medium">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveNav(item);
                  if (item !== 'Home') {
                    setShowFeatureModal(item);
                  }
                }}
                className={`transition-colors cursor-pointer ${
                  activeNav === item
                    ? 'text-[#ff3b4e] font-semibold drop-shadow-[0_0_8px_rgba(255,50,70,0.5)]'
                    : 'text-[#9e9aa1] hover:text-white'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Auth Button */}
            {user ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ff2a3a]/20 hover:bg-[#ff2a3a]/30 border border-[#ff2a3a]/40 text-red-400 hover:text-white text-[11px] font-bold transition cursor-pointer shadow-sm"
                  title="Open Client Dashboard"
                >
                  <Sparkles className="w-3 h-3 text-red-400" />
                  <span>Dashboard</span>
                </button>

                <div className="flex items-center gap-1.5 bg-white/[0.06] border border-white/10 px-2 py-1 rounded-full">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-5 h-5 rounded-full object-cover border border-emerald-400"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                      {user.displayName ? user.displayName[0] : (user.email ? user.email[0].toUpperCase() : 'U')}
                    </div>
                  )}
                  <span className="text-[11px] text-neutral-200 font-medium hidden md:inline max-w-[85px] truncate">
                    {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                  </span>
                  <button
                    onClick={handleAuthAction}
                    title="Sign Out"
                    aria-label="Sign Out"
                    className="p-1 hover:text-red-400 text-neutral-400 transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                disabled={authLoading}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-[11px] font-semibold text-neutral-200 transition cursor-pointer"
                title="Sign in with Email or Google"
              >
                <LogIn className="w-3 h-3 text-cyan-400" />
                <span>{authLoading ? 'Connecting...' : 'Sign In'}</span>
              </button>
            )}

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label="Toggle theme"
              className="p-1.5 rounded-full text-[#9e9aa1] hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
            >
              {isDarkMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setShowFeatureModal('Get Started')}
              className="flex items-center gap-1 px-3 sm:px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#ff283b] to-[#dc0928] hover:from-[#ff3d4f] hover:to-[#eb1434] text-white text-[11px] sm:text-xs font-bold transition-all shadow-[0_0_15px_rgba(255,40,60,0.45)] cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3 h-3 stroke-[2.5]" />
            </button>
          </div>
        </nav>

        {/* Hero Section Header */}
        <div className="flex flex-col items-center text-center mt-5 sm:mt-7 mb-2 px-2">
          {/* AI-Powered Future Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#200e12]/85 border border-[#ff2a3a]/30 text-[10.5px] font-semibold text-neutral-200 shadow-[0_0_12px_rgba(255,40,60,0.2)] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff3344] animate-pulse shadow-[0_0_6px_#ff3344]" />
            <span>AI-Powered Future</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-[1.15] max-w-xl">
            Websites, Mobile Apps, <br />
            AI Agents &{' '}
            <span className="text-[#ff3045] drop-shadow-[0_0_18px_rgba(255,45,65,0.65)]">
              Many Types of Automations
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-2 text-xs sm:text-[13px] text-[#A6A2AA] max-w-md leading-relaxed font-normal">
            Complete product suite by <strong>Ranjeet Yadav</strong> (Shikohabad): Custom Web, Native Apps, AI Chatbot, Real-time Voice Agent & Many Business Automations.
          </p>

          {/* Dual Action Buttons + WhatsApp Action */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4">
            <button
              onClick={() => setShowFeatureModal('Get Started')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#ff283b] to-[#d60425] hover:brightness-110 text-white text-xs font-bold shadow-[0_0_18px_rgba(255,40,60,0.4)] transition cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <a
              href="https://wa.me/917814863709?text=Hello%2C%20I%20am%20interested%20in%20your%20Technologies%20AI%20services"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-[0_0_16px_rgba(16,185,129,0.35)] transition cursor-pointer hover:scale-105"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>Connect to WhatsApp</span>
            </a>

            <button
              onClick={() => setShowFeatureModal('Explore Features')}
              className="px-4 py-2 rounded-full bg-[#18090e]/70 hover:bg-[#250e17] border border-[#ff2a3a]/30 text-neutral-200 text-xs font-semibold backdrop-blur-md transition cursor-pointer"
            >
              Explore Features
            </button>
          </div>
        </div>

        {/* Center Interactive Globe & 4 Floating Glass Cards Area (Original Hero Visual Restored) */}
        <div className="relative w-full h-[280px] sm:h-[340px] md:h-[400px] flex items-center justify-center my-1 sm:my-2">
          {/* Globe Canvas Centerpiece */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <GlobeCanvas className="w-full h-full" />
          </div>

          {/* Card 1: Top-Left (Website Development) */}
          <div
            onClick={() => setShowFeatureModal('Website Product')}
            className="absolute top-2 left-2 sm:top-5 sm:left-4 z-20 w-[140px] sm:w-[170px] p-2.5 sm:p-3 rounded-2xl bg-[#170a0e]/85 hover:bg-[#230f16]/95 border border-[#ff2a3a]/30 backdrop-blur-md transition-all duration-200 shadow-[0_8px_24px_rgba(0,0,0,0.5)] cursor-pointer group hover:scale-[1.03] hover:border-[#ff2a3a]/60"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md">
                <Globe className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-400 font-bold">Product #1</span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
              Custom Websites
            </h4>
            <p className="text-[10px] sm:text-[11px] text-[#A49FA8] mt-1 leading-snug">
              Fast Next.js/React SaaS, 3D canvas, SEO & payments.
            </p>
          </div>

          {/* Card 2: Bottom-Left (Mobile Apps) */}
          <div
            onClick={() => setShowFeatureModal('Mobile App Product')}
            className="absolute bottom-10 left-2 sm:bottom-12 sm:left-4 z-20 w-[140px] sm:w-[170px] p-2.5 sm:p-3 rounded-2xl bg-[#170a0e]/85 hover:bg-[#230f16]/95 border border-[#ff2a3a]/30 backdrop-blur-md transition-all duration-200 shadow-[0_8px_24px_rgba(0,0,0,0.5)] cursor-pointer group hover:scale-[1.03] hover:border-[#ff2a3a]/60"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-purple-600 to-pink-700 flex items-center justify-center shadow-md">
                <Smartphone className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-400 font-bold">Product #2</span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
              Mobile Apps
            </h4>
            <p className="text-[10px] sm:text-[11px] text-[#A49FA8] mt-1 leading-snug">
              Native Android & iOS apps with push alerts & offline sync.
            </p>
          </div>

          {/* Card 3: Top-Right (AI Chatbot & Voice Agent) */}
          <div
            onClick={() => setShowFeatureModal('AI Chatbot & Voice Agent')}
            className="absolute top-2 right-2 sm:top-5 sm:right-4 z-20 w-[140px] sm:w-[170px] p-2.5 sm:p-3 rounded-2xl bg-[#170a0e]/85 hover:bg-[#230f16]/95 border border-[#ff2a3a]/30 backdrop-blur-md transition-all duration-200 shadow-[0_8px_24px_rgba(0,0,0,0.5)] cursor-pointer group hover:scale-[1.03] hover:border-[#ff2a3a]/60 text-left"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shadow-md">
                <Mic className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-400 font-bold">Product #3 & 4</span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-red-400 transition-colors">
              AI Chat & Voice
            </h4>
            <p className="text-[10px] sm:text-[11px] text-[#A49FA8] mt-1 leading-snug">
              Gemini LLM chatbot + real-time voice speech assistant.
            </p>
          </div>

          {/* Card 4: Bottom-Right (10 Types of Automations) */}
          <div
            onClick={() => setShowFeatureModal('Automations')}
            className="absolute bottom-10 right-2 sm:bottom-12 sm:right-4 z-20 w-[140px] sm:w-[170px] p-2.5 sm:p-3 rounded-2xl bg-[#170a0e]/85 hover:bg-[#230f16]/95 border border-[#ff2a3a]/30 backdrop-blur-md transition-all duration-200 shadow-[0_8px_24px_rgba(0,0,0,0.5)] cursor-pointer group hover:scale-[1.03] hover:border-[#ff2a3a]/60 text-left"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-md">
                <Cpu className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">10 Workflows</span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
              10 Automations
            </h4>
            <p className="text-[10px] sm:text-[11px] text-[#A49FA8] mt-1 leading-snug">
              WhatsApp, email, CRM, inventory & OCR workflows.
            </p>
          </div>
        </div>

        {/* Bottom Social Proof & Metrics Bar */}
        <div className="relative z-20 w-full pt-3 pb-1 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-left">
          {/* Avatar stack and team trust */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
                alt="User 1"
                className="inline-block h-6 w-6 sm:h-7 sm:w-7 rounded-full ring-2 ring-[#070506] object-cover"
                referrerPolicy="no-referrer"
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces"
                alt="User 2"
                className="inline-block h-6 w-6 sm:h-7 sm:w-7 rounded-full ring-2 ring-[#070506] object-cover"
                referrerPolicy="no-referrer"
              />
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces"
                alt="User 3"
                className="inline-block h-6 w-6 sm:h-7 sm:w-7 rounded-full ring-2 ring-[#070506] object-cover"
                referrerPolicy="no-referrer"
              />
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces"
                alt="User 4"
                className="inline-block h-6 w-6 sm:h-7 sm:w-7 rounded-full ring-2 ring-[#070506] object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-[11px] sm:text-xs font-medium text-[#d3cfd7]">
              <span>Trusted by 10,000+ teams</span>
              <span className="block text-[10px] text-[#86828b]">worldwide</span>
            </div>
          </div>

          {/* Metrics / Key Stats */}
          <div className="flex items-center gap-4 sm:gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold text-white tabular-nums tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[9.5px] sm:text-[10.5px] text-[#88838d] uppercase tracking-wider font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Floating Bottom-Left Overlay: "AI modified" tag */}
      <div className="absolute bottom-3 left-3 z-30 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1b1c21]/90 backdrop-blur-md border border-white/10 text-white text-xs font-semibold shadow-lg">
          <span>AI modified</span>
        </div>
      </div>

      {/* Floating Bottom-Right Overlay Buttons: Expand and Lens */}
      <div className="absolute bottom-3 right-3 z-30 flex flex-col gap-2">
        {/* Fullscreen Expand button */}
        <button
          onClick={onExpand}
          aria-label="Expand view"
          title="Open Fullscreen Preview"
          className="w-10 h-10 rounded-2xl bg-[#1b1c21]/90 hover:bg-[#2b2d35] backdrop-blur-md border border-white/10 text-neutral-200 hover:text-white flex items-center justify-center transition-all duration-200 shadow-xl cursor-pointer hover:scale-105 active:scale-95"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Visual search button */}
        <button
          onClick={() => setShowFeatureModal('AI Models')}
          aria-label="Visual search"
          title="Visual Search & AI Models"
          className="w-10 h-10 rounded-2xl bg-[#1b1c21]/90 hover:bg-[#2b2d35] backdrop-blur-md border border-white/10 text-neutral-200 hover:text-white flex items-center justify-center transition-all duration-200 shadow-xl cursor-pointer hover:scale-105 active:scale-95"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Feature Modal / Playground */}
      {showFeatureModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowFeatureModal(null)}
        >
          <div
            className="relative w-full max-w-lg p-6 rounded-2xl bg-[#140a0e] border border-[#ff2a3a]/40 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#ff283b] flex items-center justify-center text-white">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-bold text-lg text-white">{showFeatureModal}</h3>
              </div>
              <button
                onClick={() => setShowFeatureModal(null)}
                className="text-neutral-400 hover:text-white text-sm px-2 py-1 rounded-lg hover:bg-white/10"
              >
                ✕ Close
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-[#A8A3AD]">
              {showFeatureModal === 'AI Models' && (
                <div>
                  <p className="leading-relaxed">
                    Access state-of-the-art LLMs, multi-modal foundation models, and specialized reasoning engines
                    through unified latency-optimized endpoints.
                  </p>
                  <ul className="mt-3 space-y-2 text-xs text-neutral-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-500" />
                      Zero cold-start inferences with global edge routing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-500" />
                      Automatic fallback and rate-limit arbitration
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-500" />
                      Fine-tuned embeddings and vector memory indexing
                    </li>
                  </ul>
                </div>
              )}

              {showFeatureModal === 'Automation' && (
                <div>
                  <p className="leading-relaxed">
                    Build self-healing, autonomous agents that orchestrate complex multi-step workflows across your tech stack.
                  </p>
                  <div className="mt-3 p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-red-400">
                    trigger: on_event(&apos;customer_inquiry&apos;) {'->'} route_to_agent() {'->'} execute_action()
                  </div>
                </div>
              )}

              {showFeatureModal === 'Analytics' && (
                <div>
                  <p className="leading-relaxed">
                    Deep observability into token consumption, inference latency, accuracy benchmarks, and cost efficiency.
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                      <span className="text-xs text-neutral-400">Median Latency</span>
                      <p className="text-lg font-bold text-white">42ms</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                      <span className="text-xs text-neutral-400">Cost Savings</span>
                      <p className="text-lg font-bold text-emerald-400">68%</p>
                    </div>
                  </div>
                </div>
              )}

              {showFeatureModal === 'Integrations' && (
                <div>
                  <p className="leading-relaxed">
                    Connect seamlessly with Slack, GitHub, Linear, Stripe, PostgreSQL, AWS, and Google Cloud with 1-click connectors.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {['Slack', 'GitHub', 'Linear', 'Discord', 'PostgreSQL', 'Stripe', 'Notion'].map((tool) => (
                      <span key={tool} className="px-2.5 py-1 rounded-md bg-white/[0.06] text-xs text-neutral-300">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(showFeatureModal === 'AI Chatbot & Voice Agent' || showFeatureModal === 'Voice AI Agent') && (
                <div className="space-y-3">
                  <p className="leading-relaxed">
                    Production-Grade AI Chatbot & Real-Time Hindi Voice Agent engineered by Ranjeet Yadav.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                      <strong className="text-white block mb-0.5">🤖 Gemini Contextual Chatbot</strong>
                      <span className="text-neutral-300">Trained on your business data, answers FAQs, captures leads, multi-lingual Hindi & English.</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                      <strong className="text-white block mb-0.5">🎙️ Real-Time Voice Agent with Speech Synthesis</strong>
                      <span className="text-neutral-300">Microphone speech recognition in Hindi (hi-IN) + natural vocal audio response with live wave visualizer.</span>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/917814863709?text=Hello%20Ranjeet%20Yadav%20ji%2C%20I%20want%20AI%20Chatbot%20and%20Voice%20Agent"
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    Deploy AI Voice Agent with Ranjeet Yadav (+91 7814863709)
                  </a>
                </div>
              )}

              {(showFeatureModal === 'Website Product' || showFeatureModal === 'Custom Websites') && (
                <div className="space-y-3">
                  <p className="leading-relaxed">
                    Custom Web Application & SaaS Platform Engineering by Ranjeet Yadav.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                      <strong className="text-white block mb-0.5">⚡ Sub-Second Speed & 3D Canvas</strong>
                      <span className="text-neutral-300">Next.js & React single-page architecture with mathematical WebGL 3D visuals.</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                      <strong className="text-white block mb-0.5">💳 Payment & Database Ready</strong>
                      <span className="text-neutral-300">Integrated Razorpay, Stripe, PostgreSQL, and Google Sheets real-time pipeline.</span>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/917814863709?text=Hello%20Ranjeet%20Yadav%20ji%2C%20I%20want%20to%20develop%20a%20Website"
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    Build Website with Ranjeet Yadav (+91 7814863709)
                  </a>
                </div>
              )}

              {(showFeatureModal === 'Mobile App Product' || showFeatureModal === 'Mobile Apps') && (
                <div className="space-y-3">
                  <p className="leading-relaxed">
                    Cross-Platform iOS & Android Mobile Application Development.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                      <strong className="text-white block mb-0.5">📱 Native Performance & Biometrics</strong>
                      <span className="text-neutral-300">Smooth 60fps animations with fingerprint / FaceID secure authentication.</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                      <strong className="text-white block mb-0.5">🔔 Push Notifications & Offline Sync</strong>
                      <span className="text-neutral-300">Firebase Cloud Messaging with local SQLite caching for zero data loss.</span>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/917814863709?text=Hello%20Ranjeet%20Yadav%20ji%2C%20I%20want%20to%20develop%20a%20Mobile%20App"
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    Build Mobile App with Ranjeet Yadav (+91 7814863709)
                  </a>
                </div>
              )}

              {showFeatureModal === 'Sales AI Engine' && (
                <div className="space-y-3">
                  <p className="leading-relaxed">
                    Automated Inbound Lead Qualification & Instant 3-Second Conversion Engine.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                      <strong className="text-white block mb-0.5">⚡ Instant WhatsApp Responder</strong>
                      <span className="text-neutral-300">Answers inquiries under 3 seconds, qualifies budget, and logs to CRM.</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                      <strong className="text-white block mb-0.5">📊 Automated Calendar Booking</strong>
                      <span className="text-neutral-300">Schedules discovery consultation directly onto Google Calendar.</span>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/917814863709?text=Hello%20Ranjeet%20Yadav%20ji%2C%20I%20want%20Sales%20AI%20Engine%20for%20my%20business"
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    Set up Sales AI Engine (+91 7814863709)
                  </a>
                </div>
              )}

              {showFeatureModal === 'Customer Support' && (
                <div className="space-y-3">
                  <p className="leading-relaxed">
                    24/7 Autonomous Multimodal Customer Service & Dispute Resolver.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                      <strong className="text-white block mb-0.5">🤖 24/7 Contextual Memory</strong>
                      <span className="text-neutral-300">Remembers order status, past tickets, and resolves 80% of common support requests.</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                      <strong className="text-white block mb-0.5">🎧 Sentiment Analysis</strong>
                      <span className="text-neutral-300">Flags frustrated users and alerts founder directly on WhatsApp.</span>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/917814863709?text=Hello%20Ranjeet%20Yadav%20ji%2C%20I%20want%20AI%20Customer%20Support"
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    Deploy Customer Support Bot (+91 7814863709)
                  </a>
                </div>
              )}

              {showFeatureModal === 'Marketing Automation' && (
                <div className="space-y-3">
                  <p className="leading-relaxed">
                    Multi-Channel Autonomous Social Media & Campaign Distribution Pipeline.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                      <strong className="text-white block mb-0.5">🚀 Cross-Platform Distribution</strong>
                      <span className="text-neutral-300">Single prompt publishes tailored copy across LinkedIn, Twitter, and Instagram.</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                      <strong className="text-white block mb-0.5">📈 Audience Engagement Optimization</strong>
                      <span className="text-neutral-300">Schedules posts at peak traffic hours for maximum conversions.</span>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/917814863709?text=Hello%20Ranjeet%20Yadav%20ji%2C%20I%20want%20Marketing%20Automation"
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    Build Marketing Automation (+91 7814863709)
                  </a>
                </div>
              )}

              {showFeatureModal === 'Features' && (
                <div>
                  <p className="leading-relaxed">
                    Explore all production-ready AI capabilities of ॐ Technologies.
                  </p>
                  <div className="grid grid-cols-2 gap-2.5 mt-3">
                    <button
                      onClick={() => setShowFeatureModal('AI Models')}
                      className="p-3 rounded-xl bg-white/[0.04] hover:bg-[#ff2a3a]/15 border border-white/[0.08] text-left transition"
                    >
                      <h5 className="font-bold text-xs text-white">AI Models</h5>
                      <p className="text-[11px] text-neutral-400 mt-1">Multi-modal LLMs & reasoning engines</p>
                    </button>
                    <button
                      onClick={() => setShowFeatureModal('Automation')}
                      className="p-3 rounded-xl bg-white/[0.04] hover:bg-[#ff2a3a]/15 border border-white/[0.08] text-left transition"
                    >
                      <h5 className="font-bold text-xs text-white">Automation</h5>
                      <p className="text-[11px] text-neutral-400 mt-1">Autonomous workflows & agents</p>
                    </button>
                    <button
                      onClick={() => setShowFeatureModal('Analytics')}
                      className="p-3 rounded-xl bg-white/[0.04] hover:bg-[#ff2a3a]/15 border border-white/[0.08] text-left transition"
                    >
                      <h5 className="font-bold text-xs text-white">Analytics</h5>
                      <p className="text-[11px] text-neutral-400 mt-1">Token telemetry & latency charts</p>
                    </button>
                    <button
                      onClick={() => setShowFeatureModal('Integrations')}
                      className="p-3 rounded-xl bg-white/[0.04] hover:bg-[#ff2a3a]/15 border border-white/[0.08] text-left transition"
                    >
                      <h5 className="font-bold text-xs text-white">Integrations</h5>
                      <p className="text-[11px] text-neutral-400 mt-1">Slack, GitHub, PostgreSQL & AWS</p>
                    </button>
                  </div>
                </div>
              )}

              {showFeatureModal === 'Automations' && (
                <div className="space-y-3">
                  <p className="leading-relaxed">
                    10 Production-Ready Automations built by Ranjeet Yadav for modern businesses.
                  </p>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {[
                      '1. WhatsApp Lead Auto-Responder (Instant 3-sec reply)',
                      '2. Smart Email Scraping & CRM Ticket Creation',
                      '3. E-Commerce Order & Inventory Sync',
                      '4. Automated Google Calendar & Consultation Scheduler',
                      '5. Google Sheets & Cloud PostgreSQL Real-Time Sync',
                      '6. AI Social Media Multi-Platform Cross-Poster',
                      '7. Voice Call Transcription & Customer Sentiment AI',
                      '8. Auto Invoice & WhatsApp UPI Payment Reminder',
                      '9. 24/7 DevOps Server Health & Auto-Recovery',
                      '10. AI Document & Invoice OCR Extraction',
                    ].map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-neutral-200">
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="pt-2">
                    <a
                      href="https://wa.me/917814863709?text=Hello%20Ranjeet%20Yadav%20ji%2C%20I%20want%20to%20build%20custom%20automations"
                      target="_blank"
                      rel="noreferrer"
                      className="block text-center w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      Connect on WhatsApp (+91 7814863709)
                    </a>
                  </div>
                </div>
              )}

              {showFeatureModal === 'Solutions' && (
                <div className="space-y-3">
                  <p className="leading-relaxed">
                    Tailored AI architecture built for modern organizations, software products, and startups.
                  </p>
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                      <h5 className="font-bold text-xs text-white">Enterprise AI Assistants</h5>
                      <p className="text-[11px] text-neutral-400 mt-0.5">Private knowledge-base RAG with enterprise encryption.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                      <h5 className="font-bold text-xs text-white">Customer Support Automation</h5>
                      <p className="text-[11px] text-neutral-400 mt-0.5">24/7 autonomous multimodal voice and chat agents.</p>
                    </div>
                  </div>
                </div>
              )}

              {showFeatureModal === 'Resources' && (
                <div className="space-y-3">
                  <p className="leading-relaxed">
                    Documentation, SDK references, API keys, and tutorials for developers.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10">
                      <span className="font-bold text-white block">API Docs</span>
                      <span className="text-[10px] text-neutral-400">OpenAPI 3.1 & SDK Specs</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10">
                      <span className="font-bold text-white block">Code Samples</span>
                      <span className="text-[10px] text-neutral-400">Node, Python, Go & cURL</span>
                    </div>
                  </div>
                </div>
              )}

              {showFeatureModal === 'Pricing' && (
                <div className="space-y-3">
                  <p className="leading-relaxed">
                    Predictable pricing with pay-as-you-go and enterprise plans.
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                      <span className="text-xs font-bold text-neutral-300">Starter</span>
                      <p className="text-lg font-black text-white mt-1">₹0 <span className="text-[10px] font-normal text-neutral-400">/ free</span></p>
                      <p className="text-[10.5px] text-neutral-400 mt-1">1,000 free monthly requests</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#ff2a3a]/15 border border-red-500/40">
                      <span className="text-xs font-bold text-red-400">Pro Enterprise</span>
                      <p className="text-lg font-black text-white mt-1">₹2,499 <span className="text-[10px] font-normal text-neutral-400">/ mo</span></p>
                      <p className="text-[10.5px] text-neutral-300 mt-1">Unlimited calls & Dedicated SLA</p>
                    </div>
                  </div>
                </div>
              )}

              {showFeatureModal === 'Contact' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#210c11] to-[#12070a] border border-red-500/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#ff2a3a] text-white flex items-center justify-center font-bold text-sm shadow-md">
                        RY
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Ranjeet Yadav</h4>
                        <p className="text-xs text-neutral-400">Founder & Creative Technologist</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-neutral-300 border-t border-white/10 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400">Address:</span>
                        <span className="font-semibold text-white">Adarsh Nagar, Shikohabad, UP</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400">Mobile / WhatsApp:</span>
                        <a href="tel:+917814863709" className="font-mono text-red-400 hover:underline">
                          +91 7814863709
                        </a>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400">Email:</span>
                        <a href="mailto:mr.jeet325@gmail.com" className="text-red-400 hover:underline">
                          mr.jeet325@gmail.com
                        </a>
                      </div>
                    </div>

                    <a
                      href="https://wa.me/917814863709?text=Hello%20Ranjeet%20Yadav%20ji%2C%20I%20want%20to%20discuss%20a%20project"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>Chat directly on WhatsApp (+91 7814863709)</span>
                    </a>
                  </div>
                </div>
              )}

              {(showFeatureModal === 'Get Started' || showFeatureModal === 'Explore Features') && (
                <div>
                  <p className="leading-relaxed">
                    Start building today with Ranjeet Yadav&apos;s ॐ Technologies AI Platform.
                  </p>
                  {submittedEmail ? (
                    <div className="mt-4 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2 animate-in fade-in duration-300">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-white text-sm">Sandbox Initialized!</h4>
                      <p className="text-xs text-neutral-300">
                        Your developer workspace is ready for <strong>Ranjeet Yadav</strong> (Shikohabad).
                      </p>
                      <a
                        href="https://wa.me/917814863709?text=Hello%20Ranjeet%20Yadav%20ji%2C%20I%20have%20initialized%20a%20sandbox%20and%20want%20to%20discuss%20project%20details"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 mt-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        <span>Discuss Scope on WhatsApp</span>
                      </a>
                    </div>
                  ) : (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const emailInput = (e.currentTarget.elements.namedItem('workEmail') as HTMLInputElement)?.value;
                        const validEmail = emailInput || 'mr.jeet325@gmail.com';
                        try {
                          await addDoc(collection(db, 'leads'), {
                            email: validEmail,
                            userId: user?.uid || null,
                            name: user?.displayName || 'Inquiry Contact',
                            service: 'Sandbox Project',
                            createdAt: serverTimestamp(),
                          });
                          await addDoc(collection(db, 'contact_messages'), {
                            email: validEmail,
                            userId: user?.uid || null,
                            name: user?.displayName || 'Sandbox Applicant',
                            subject: 'Sandbox Developer Project Request',
                            message: `Developer workspace sandbox request initiated for email ${validEmail}`,
                            read: false,
                            createdAt: serverTimestamp(),
                          });
                        } catch (err) {
                          console.warn('Could not write lead to Firestore:', err);
                        }
                        setSubmittedEmail(true);
                      }}
                      className="mt-4 flex flex-col gap-2"
                    >
                      <input
                        name="workEmail"
                        type="email"
                        defaultValue={user?.email || 'mr.jeet325@gmail.com'}
                        placeholder="Enter your work email"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white placeholder-neutral-500 text-xs outline-none focus:border-red-500"
                      />
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ff283b] to-[#dc0928] text-white text-xs font-bold hover:brightness-110 cursor-pointer shadow-lg"
                      >
                        Create Free Sandbox Project
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

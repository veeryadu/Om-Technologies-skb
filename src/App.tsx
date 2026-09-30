/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NexoraLanding } from './components/NexoraLanding';
import { PostSidebar } from './components/PostSidebar';
import { FullPreviewModal } from './components/FullPreviewModal';
import { ChatbotVoiceAgent } from './components/ChatbotVoiceAgent';
import { ServicesAndAutomationsHub } from './components/ServicesAndAutomationsHub';
import { Footer } from './components/Footer';
import { ProtectedDashboard } from './components/ProtectedDashboard';
import { AuthModal } from './components/AuthModal';
import { useAuth } from './AuthContext';
import { Check, MessageCircle } from 'lucide-react';

export default function App() {
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { currentView, user, openAuthModal } = useAuth();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-neutral-900 font-['Plus_Jakarta_Sans',sans-serif] antialiased p-3 sm:p-5 md:p-8 flex flex-col items-center">
      {/* Centered Main Content Wrapper */}
      <div className="w-full max-w-[1240px] flex flex-col">
        {/* Main Post Card Container */}
        <main className="w-full transition-all space-y-8">
          {/* Conditional Protected Dashboard View or Main Landing Showcase */}
          {currentView === 'dashboard' && user ? (
            <ProtectedDashboard />
          ) : (
            <>
              {/* Nexora AI Landing Page Preview Mockup */}
              <div className="w-full">
                <NexoraLanding
                  onExpand={() => setIsFullscreenModalOpen(true)}
                />
              </div>

              {/* Website, App, AI Chatbot, AI Voice Agent & 10 Automations Hub */}
              <ServicesAndAutomationsHub />
            </>
          )}

          {/* Website Footer with Products, Automations, Contact & Ranjeet Yadav profile */}
          <Footer />
        </main>
      </div>

      {/* Production Firebase Auth Modal */}
      <AuthModal />

      {/* Fullscreen Interactive Modal when Expand button is clicked */}
      <FullPreviewModal
        isOpen={isFullscreenModalOpen}
        onClose={() => setIsFullscreenModalOpen(false)}
      />

      {/* AI Chatbot & Real-Time Voice Agent */}
      <ChatbotVoiceAgent />

      {/* Floating Direct WhatsApp Support Button */}
      <aside aria-label="WhatsApp Contact" className="fixed bottom-6 right-6 z-40">
        <a
          href="https://wa.me/917814863709?text=Hello%2C%20I%20want%20to%20connect%20regarding%20Technologies%20AI%20platform"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-[0_6px_24px_rgba(37,211,102,0.45)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 group"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5 fill-current" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white animate-ping opacity-75" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-white" />
          </div>
          <span className="hidden sm:inline">Connect to WhatsApp</span>
          <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full font-mono text-emerald-100 hidden md:inline">
            7814863709
          </span>
        </a>
      </aside>

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-neutral-900 text-white text-xs sm:text-sm font-medium shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

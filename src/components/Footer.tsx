import React from 'react';
import {
  Globe,
  Smartphone,
  MessageSquare,
  Mic,
  Cpu,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  ArrowUp,
  Heart,
  Shield,
  Zap,
} from 'lucide-react';
import { ReviewSection } from './ReviewSection';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full mt-10 rounded-[28px] sm:rounded-[36px] bg-[#0c0608] border border-[#ff2a3a]/30 shadow-2xl text-white font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden">
      {/* Upper Main Footer Grid */}
      <div className="p-6 sm:p-8 lg:p-12 border-b border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
          {/* Brand & Founder Info Column (span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#ff2a3a]/25 via-[#ff2a3a]/15 to-transparent border border-[#ff3344]/35 shadow-[0_0_16px_rgba(255,42,58,0.35)]">
                <span className="text-[#ff3344] text-2xl font-black leading-none drop-shadow-[0_0_12px_rgba(255,50,70,0.95)]">
                  ॐ
                </span>
                <span className="font-bold tracking-[0.24em] text-[11px] text-neutral-200 uppercase leading-none">
                  <span className="text-[#ff4155] font-extrabold">Tech</span>nologies
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-400 max-w-sm leading-relaxed">
              Cutting-edge digital ecosystem delivering Custom Web Applications, Native Mobile Apps,
              Contextual AI Chatbots, Voice Speech Agents, and Enterprise Automation pipelines.
            </p>
          </div>

          {/* Column 2: Core Products */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#ff2a3a]" />
              Products
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li className="flex items-center gap-1.5 hover:text-white transition cursor-pointer">
                <Globe className="w-3 h-3 text-blue-400" />
                <span>Custom Websites</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition cursor-pointer">
                <Smartphone className="w-3 h-3 text-purple-400" />
                <span>Mobile Apps (iOS & Android)</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition cursor-pointer">
                <MessageSquare className="w-3 h-3 text-red-400" />
                <span>AI Chatbots (Gemini 3.8)</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition cursor-pointer">
                <Mic className="w-3 h-3 text-emerald-400" />
                <span>Real-Time Voice Agents</span>
              </li>
            </ul>
          </div>

          {/* Column 3: 10 Automations Suite */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#ff2a3a]" />
              Top Automations
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li className="hover:text-white transition cursor-pointer">WhatsApp Auto-Responder</li>
              <li className="hover:text-white transition cursor-pointer">Smart Email Scraping</li>
              <li className="hover:text-white transition cursor-pointer">Order & Inventory Sync</li>
              <li className="hover:text-white transition cursor-pointer">Google Calendar Scheduler</li>
              <li className="hover:text-white transition cursor-pointer">Google Sheets Data Pipeline</li>
              <li className="hover:text-white transition cursor-pointer">AI OCR Invoice Ingestion</li>
            </ul>
          </div>

          {/* Column 4: Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#ff2a3a]" />
              Direct Contact
            </h4>
            <div className="space-y-2.5 text-xs text-neutral-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                <span className="text-[11.5px] leading-snug">
                  Adarsh Nagar, Shikohabad, Uttar Pradesh, India
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <a href="tel:+917814863709" className="font-mono text-[11.5px] hover:text-red-400 transition">
                  +91 7814863709
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <a href="mailto:mr.jeet325@gmail.com" className="text-[11.5px] hover:text-red-400 transition">
                  mr.jeet325@gmail.com
                </a>
              </div>

              {/* WhatsApp direct connect CTA */}
              <a
                href="https://wa.me/917814863709?text=Hello%20Ranjeet%20Yadav%20ji%2C%20I%20saw%20your%20website%20and%20want%20to%20collaborate"
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>WhatsApp (+91 7814863709)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Client Testimonials & Reviews Section */}
        <ReviewSection />
      </div>

      {/* Bottom Sub-footer */}
      <div className="px-6 sm:px-8 py-4 bg-[#070304] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
        <div className="flex items-center gap-1 text-[11px]">
          <span>© {new Date().getFullYear()} ॐ Technologies. Designed & Built with</span>
          <Heart className="w-3 h-3 text-red-500 fill-current inline mx-0.5" />
          <span>by <strong className="text-neutral-300 font-semibold">Ranjeet Yadav</strong> (Shikohabad).</span>
        </div>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-neutral-300 hover:text-white transition cursor-pointer text-[11px]"
        >
          <span>Back to Top</span>
          <ArrowUp className="w-3 h-3" />
        </button>
      </div>
    </footer>
  );
};

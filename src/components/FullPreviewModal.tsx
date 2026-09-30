import React from 'react';
import { X, ArrowLeft, ExternalLink, Sparkles } from 'lucide-react';
import { NexoraLanding } from './NexoraLanding';

interface FullPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FullPreviewModal: React.FC<FullPreviewModalProps> = ({ isOpen, onClose }) => {
  const [isExported, setIsExported] = React.useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Top Floating Control Bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-[#0a0708]/90 border-b border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Inspiration View</span>
          </button>
          <span className="hidden sm:inline-block text-xs text-neutral-400">
            Interactive Fullscreen Mode
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isExported ? (
            <a
              href="https://wa.me/917814863709?text=Hello%20Ranjeet%20Yadav%20ji%2C%20I%20want%20to%20deploy%20this%20Technologies%20AI%20platform%20template"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-[0_0_12px_rgba(16,185,129,0.5)] cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Connect on WhatsApp for Deployment</span>
            </a>
          ) : (
            <button
              onClick={() => {
                setIsExported(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ff283b] hover:bg-[#dc0928] text-white text-xs font-bold transition shadow-[0_0_12px_rgba(255,40,60,0.5)] cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Deploy This Template</span>
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close fullscreen"
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Full Webpage Content */}
      <div className="w-full">
        <NexoraLanding isFullScreen={true} />
      </div>
    </div>
  );
};

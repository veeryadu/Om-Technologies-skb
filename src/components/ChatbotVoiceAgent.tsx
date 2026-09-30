import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Radio,
  Minimize2,
  Maximize2,
  RefreshCw,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface ChatbotVoiceAgentProps {
  onWhatsAppClick?: () => void;
}

export const ChatbotVoiceAgent: React.FC<ChatbotVoiceAgentProps> = ({ onWhatsAppClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'voice'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: 'Namaste! Welcome to ॐ Technologies (Founder: Ranjeet Yadav, Adarsh Nagar Shikohabad). Main aapka AI Assistant & Voice Agent hoon. Aap AI models, automation workflows, ya contact details (7814863709) ke baare mein pooch sakte hain.',
      timestamp: 'Just now',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSpeechEnabled, setVoiceSpeechEnabled] = useState(true);
  const [voiceLiveTranscript, setVoiceLiveTranscript] = useState('');
  const [voiceVolumeLevel, setVoiceVolumeLevel] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeTab]);

  // Setup Web Speech API for voice input
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      // Strictly set speech recognition language to Hindi (India)
      recognition.lang = 'hi-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            const final = event.results[i][0].transcript;
            setVoiceLiveTranscript(final);
            handleSendMessage(final);
          } else {
            interim += event.results[i][0].transcript;
            setVoiceLiveTranscript(interim);
          }
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Simulating voice audio wave activity when listening or speaking
  useEffect(() => {
    let interval: any;
    if (isListening || isSpeaking) {
      interval = setInterval(() => {
        setVoiceVolumeLevel(Math.random() * 0.8 + 0.2);
      }, 120);
    } else {
      setVoiceVolumeLevel(0);
    }
    return () => clearInterval(interval);
  }, [isListening, isSpeaking]);

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const [voicePitch, setVoicePitch] = useState<number>(1.0);
  const [voiceRate, setVoiceRate] = useState<number>(1.0);

  // Load human-like natural voices
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        setAvailableVoices(voices);

        // Highest preference for Hindi neural/natural human voices
        const bestVoice =
          voices.find((v) => v.lang === 'hi-IN' || v.lang.startsWith('hi')) ||
          voices.find((v) => v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('swara') || v.name.toLowerCase().includes('madhur') || v.name.toLowerCase().includes('kalpana') || v.name.toLowerCase().includes('hemant')) ||
          voices.find((v) => v.lang.startsWith('en-IN') || v.name.toLowerCase().includes('india')) ||
          voices.find((v) => v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('neural')) ||
          voices[0];

        if (bestVoice) {
          setSelectedVoiceName(bestVoice.name);
        }
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, []);

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const speakText = async (text: string) => {
    if (!voiceSpeechEnabled) return;

    // Clean markdown asterisks & symbols for natural fluid speech
    const cleanText = text
      .replace(/[*_#`~>]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    // Stop any ongoing speech or audio
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }

    // Attempt 1: Fetch ultra-high definition human voice audio from backend
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audio) {
          const audio = new Audio(`data:${data.mimeType || 'audio/wav'};base64,${data.audio}`);
          audioPlayerRef.current = audio;
          setIsSpeaking(true);
          audio.onended = () => setIsSpeaking(false);
          audio.onerror = () => {
            setIsSpeaking(false);
            fallbackBrowserSpeech(cleanText);
          };
          await audio.play();
          return;
        }
      }
    } catch (err) {
      console.warn('Backend TTS stream attempt note:', err);
    }

    // Attempt 2: Fallback to tuned Browser Natural Human Speech
    fallbackBrowserSpeech(cleanText);
  };

  const fallbackBrowserSpeech = (cleanText: string) => {
    if (!('speechSynthesis' in window)) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Select best human-like Hindi voice
    const voices = window.speechSynthesis.getVoices();
    const voiceToUse =
      voices.find((v) => v.lang === 'hi-IN') ||
      voices.find((v) => v.lang.startsWith('hi')) ||
      voices.find((v) => v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('swara') || v.name.toLowerCase().includes('madhur')) ||
      voices.find((v) => v.name === selectedVoiceName) ||
      voices.find((v) => v.lang.startsWith('en-IN')) ||
      voices[0];

    if (voiceToUse) {
      utterance.voice = voiceToUse;
      utterance.lang = voiceToUse.lang;
    }

    // Set natural human conversational pitch & speed
    utterance.rate = 0.98; // slightly slower for maximum clarity
    utterance.pitch = 1.0; // natural human pitch

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleVoiceListening = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      setIsListening(false);
    } else {
      setVoiceLiveTranscript('');
      
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        // Non-intrusive fallback for browsers without Web Speech recognition
        setActiveTab('chat');
        setInputVal('Namaste! Mujhe ॐ Technologies ke baare me batao');
        return;
      }

      try {
        if (!recognitionRef.current) {
          const rec = new SpeechRecognition();
          rec.continuous = false;
          rec.interimResults = true;
          rec.lang = 'hi-IN';
          rec.onstart = () => setIsListening(true);
          rec.onend = () => setIsListening(false);
          rec.onerror = () => setIsListening(false);
          rec.onresult = (event: any) => {
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                const final = event.results[i][0].transcript;
                setVoiceLiveTranscript(final);
                handleSendMessage(final);
              } else {
                setVoiceLiveTranscript(event.results[i][0].transcript);
              }
            }
          };
          recognitionRef.current = rec;
        }

        recognitionRef.current.start();
        setIsListening(true);
      } catch (err: any) {
        console.warn('Speech recognition start note:', err?.message);
        // If already started, stop then restart
        try {
          recognitionRef.current?.stop();
          setTimeout(() => {
            recognitionRef.current?.start();
            setIsListening(true);
          }, 150);
        } catch (e) {
          setIsListening(false);
        }
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query || isLoading) return;

    setInputVal('');
    setVoiceLiveTranscript('');

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
          isVoice: activeTab === 'voice',
        }),
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const data = await response.json();
      const botReply = data.reply || 'Main aapki sahayata karne ke liye taiyaar hoon.';

      const botMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        sender: 'assistant',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);

      // If in voice mode or voice speech enabled, vocalize response
      if (activeTab === 'voice' || voiceSpeechEnabled) {
        speakText(botReply);
      }
    } catch (err: any) {
      const fallbackReply =
        "Main ॐ Technologies AI assistant hoon. Aap hamare AI Models, custom workflow automations ke baare mein jaan sakte hain ya seedhe WhatsApp (+91 7814863709) par baat kar sakte hain.";
      const botMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        sender: 'assistant',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      if (activeTab === 'voice' || voiceSpeechEnabled) {
        speakText(fallbackReply);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button Cluster (Chatbot & Voice Agent triggers) */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2.5">
        {/* Voice Agent Quick Trigger - Instant 1-Click Activate */}
        <button
          onClick={() => {
            setIsOpen(true);
            setActiveTab('voice');
            // Immediate single-click engagement: warm voice hello + listen
            if (!isListening && !isSpeaking) {
              speakText("Namaste! Boliye, main aapki kya madad kar sakta hoon?");
            }
            setTimeout(() => {
              toggleVoiceListening();
            }, 300);
          }}
          title="Voice Agent - 1 Click to Speak"
          aria-label="Open Voice Agent"
          className="flex items-center gap-2 px-3.5 py-3 rounded-full bg-gradient-to-r from-[#ff2a3a] to-[#b30015] hover:brightness-110 text-white font-bold text-xs shadow-[0_6px_22px_rgba(255,42,58,0.45)] transition-all duration-300 hover:scale-105 active:scale-95 group border border-red-400/40 cursor-pointer"
        >
          <div className="relative">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <span className="hidden sm:inline">🎙️ Voice Agent</span>
        </button>

        {/* Chatbot Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle AI Chatbot"
          className="relative flex items-center gap-2 px-4 py-3 rounded-full bg-[#160b0e] hover:bg-[#251016] text-white font-bold text-sm shadow-[0_6px_24px_rgba(0,0,0,0.45)] border border-[#ff2a3a]/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-[#ff2a3a] text-white">
            <Sparkles className="w-3 h-3" />
          </div>
          <span>AI Chatbot</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute top-2 right-2" />
        </button>
      </div>

      {/* Main Chatbot & Voice Agent Modal Window */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 sm:left-6 z-50 w-[92vw] sm:w-[410px] h-[550px] max-h-[82vh] rounded-[24px] bg-[#0d0709] border border-[#ff2a3a]/40 shadow-[0_12px_45px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="p-3.5 px-4 bg-gradient-to-r from-[#200e12] via-[#14080b] to-[#0d0709] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ff2a3a] to-[#a30014] flex items-center justify-center text-white font-bold text-base shadow-[0_0_12px_rgba(255,42,58,0.6)]">
                ॐ
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-white font-bold text-sm tracking-tight">Technologies Assistant</h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <p className="text-[10.5px] text-neutral-400">AI Chatbot & Voice Agent</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* TTS Mute Toggle */}
              <button
                onClick={() => {
                  if (voiceSpeechEnabled && isSpeaking) {
                    window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                  }
                  setVoiceSpeechEnabled(!voiceSpeechEnabled);
                }}
                className={`p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition ${
                  voiceSpeechEnabled ? 'text-red-400' : ''
                }`}
                title={voiceSpeechEnabled ? 'Voice readout enabled' : 'Voice readout muted'}
              >
                {voiceSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Close Button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (isSpeaking) window.speechSynthesis.cancel();
                  if (isListening) recognitionRef.current?.stop();
                }}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs (Chatbot vs Voice Agent) */}
          <div className="grid grid-cols-2 p-1.5 bg-[#170a0e]/90 border-b border-white/[0.08] text-xs font-semibold">
            <button
              onClick={() => {
                setActiveTab('chat');
                if (isListening) recognitionRef.current?.stop();
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-xl transition cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-[#ff2a3a] text-white shadow-[0_0_10px_rgba(255,42,58,0.4)]'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>AI Chatbot</span>
            </button>

            <button
              onClick={() => setActiveTab('voice')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-xl transition cursor-pointer ${
                activeTab === 'voice'
                  ? 'bg-[#ff2a3a] text-white shadow-[0_0_10px_rgba(255,42,58,0.4)]'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Voice Agent</span>
            </button>
          </div>

          {/* TAB 1: Chatbot Interface */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              {/* Message scroll list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                        m.sender === 'user'
                          ? 'bg-neutral-700 text-white'
                          : 'bg-gradient-to-br from-[#ff2a3a] to-[#a30014] text-white font-bold'
                      }`}
                    >
                      {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : 'ॐ'}
                    </div>

                    <div
                      className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-[#ff2a3a] text-white rounded-tr-none'
                          : 'bg-[#1b0d12] text-neutral-200 border border-white/10 rounded-tl-none shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.text}</p>
                      <div className="flex items-center justify-between mt-1 text-[9.5px] opacity-60">
                        <span>{m.timestamp}</span>
                        {m.sender === 'assistant' && (
                          <button
                            onClick={() => speakText(m.text)}
                            className="hover:opacity-100 p-0.5"
                            title="Play Voice"
                          >
                            <Volume2 className="w-3 h-3 text-red-300" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <div className="w-6 h-6 rounded-lg bg-[#ff2a3a] flex items-center justify-center text-white text-[11px] font-bold">
                      ॐ
                    </div>
                    <div className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-[#1b0d12] border border-white/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a3a] animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a3a] animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a3a] animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick suggestions in Hindi */}
              <div className="px-3 py-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-white/5">
                {[
                  'ॐ Technologies क्या है?',
                  'Ranjeet Yadav ji के बारे में बताओ',
                  'वेबसाइट और ऐप कैसे बनवाएं?',
                  'WhatsApp 7814863709',
                  'Automations की जानकारी',
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSendMessage(s)}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.05] hover:bg-[#ff2a3a]/20 hover:text-red-400 text-neutral-400 whitespace-nowrap transition cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Text Input area */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-[#13080c] border-t border-white/10 flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={toggleVoiceListening}
                  className={`p-2 rounded-full transition cursor-pointer ${
                    isListening
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-white/10 hover:bg-white/15 text-neutral-300'
                  }`}
                  title="Speech to Text"
                >
                  {isListening ? <Mic className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="अपना सवाल यहाँ लिखें या बोलें..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-full px-3.5 py-2 text-xs text-white placeholder-neutral-500 outline-none focus:border-[#ff2a3a]"
                />

                <button
                  type="submit"
                  disabled={!inputVal.trim() || isLoading}
                  className="p-2 rounded-full bg-[#ff2a3a] hover:bg-red-600 text-white disabled:opacity-40 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: Dedicated Voice Agent Interface */}
          {activeTab === 'voice' && (
            <div className="flex-1 flex flex-col justify-between items-center p-6 text-center">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff2a3a]/15 border border-[#ff2a3a]/30 text-xs text-red-400 font-semibold mb-2">
                  <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-ping' : isSpeaking ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'}`} />
                  <span>{isListening ? 'आपकी आवाज़ सुन रहा हूँ...' : isSpeaking ? 'जवाब बोल रहा हूँ...' : 'हिंदी वॉइस एजेंट तैयार है'}</span>
                </div>
                <h4 className="text-base font-extrabold text-white">ॐ हिंदी वॉइस एजेंट (Voice Agent)</h4>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                  माइक बटन दबाएं और हिंदी में कुछ भी पूछें।
                </p>
              </div>

              {/* Pulsing Visualizer Core Sphere */}
              <div className="relative my-4 flex items-center justify-center">
                {/* Ambient dynamic glow ring */}
                <div
                  className="absolute rounded-full transition-all duration-150"
                  style={{
                    width: `${140 + voiceVolumeLevel * 70}px`,
                    height: `${140 + voiceVolumeLevel * 70}px`,
                    backgroundColor: isListening ? 'rgba(255, 42, 58, 0.25)' : isSpeaking ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 42, 58, 0.08)',
                    filter: 'blur(20px)',
                  }}
                />

                {/* Central Action Button */}
                <button
                  onClick={toggleVoiceListening}
                  className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer ${
                    isListening
                      ? 'bg-gradient-to-br from-red-500 to-rose-700 text-white scale-110 shadow-[0_0_35px_rgba(255,42,58,0.8)]'
                      : isSpeaking
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-[0_0_30px_rgba(16,185,129,0.7)]'
                      : 'bg-[#1e0d13] hover:bg-[#2b121a] text-white border-2 border-[#ff2a3a]/40 shadow-[0_0_20px_rgba(255,42,58,0.3)]'
                  }`}
                >
                  <div className="text-2xl font-black mb-0.5 leading-none">ॐ</div>
                  <Mic className="w-5 h-5" />
                </button>
              </div>

              {/* Live Transcript or Status */}
              <div className="w-full min-h-[60px] p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-xs text-neutral-300">
                {voiceLiveTranscript ? (
                  <p className="italic text-red-300 font-medium">&quot;{voiceLiveTranscript}&quot;</p>
                ) : isSpeaking ? (
                  <p className="text-emerald-400 font-medium animate-pulse">Voice Agent is currently answering...</p>
                ) : isListening ? (
                  <p className="text-red-400 animate-pulse font-medium">Boliye, main sun raha hoon...</p>
                ) : (
                  <p className="text-neutral-500">Tap the center mic icon to speak.</p>
                )}
              </div>

              {/* Quick Speech Topic Chips for instant voice testing */}
              <div className="w-full flex items-center justify-center gap-1.5 flex-wrap my-1">
                {[
                  'Batao Ranjeet Yadav ji ke baare me',
                  'Website development features',
                  'Mobile App details',
                  '10 Types ke automations',
                ].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => handleSendMessage(sample)}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-[#ff2a3a]/30 text-neutral-300 hover:text-white border border-white/10 transition cursor-pointer"
                  >
                    🗣️ {sample}
                  </button>
                ))}
              </div>

              {/* Natural Human Voice Settings */}
              {availableVoices.length > 0 && (
                <div className="w-full p-2.5 rounded-xl bg-white/[0.04] border border-white/10 my-1 text-left">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1.5">
                    <span className="font-semibold text-neutral-300 flex items-center gap-1">
                      <Volume2 className="w-3 h-3 text-[#ff2a3a]" /> Human Voice Engine:
                    </span>
                    <span className="text-[10px] text-emerald-400">Natural Warmth</span>
                  </div>
                  <select
                    value={selectedVoiceName}
                    onChange={(e) => setSelectedVoiceName(e.target.value)}
                    className="w-full text-xs p-1.5 rounded-lg bg-black/60 border border-white/20 text-neutral-200 outline-none"
                  >
                    {availableVoices.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Quick WhatsApp or Switch Actions */}
              <div className="w-full flex items-center justify-between pt-2 text-xs">
                <a
                  href="https://wa.me/917814863709?text=Hello%20Voice%20Agent%20Technologies"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Connect WhatsApp (7814863709)</span>
                </a>

                <button
                  onClick={() => setActiveTab('chat')}
                  className="text-neutral-400 hover:text-white underline cursor-pointer"
                >
                  Switch to Text Chat
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </>
  );
};

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Security & iFrame-Friendly Headers Middleware
// Note: In AI Studio preview environment, the app runs inside an iframe.
// We must NOT send X-Frame-Options: SAMEORIGIN or DENY as that prevents the iframe from loading!
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
});

// JSON body parser with strict 1MB size limit to prevent buffer overflow attacks
app.use(express.json({ limit: '1mb' }));

// In-memory sliding window rate limiter
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();

function rateLimiter(maxRequests: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const forwarded = req.headers['x-forwarded-for'];
    const ip =
      (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : '') ||
      req.ip ||
      req.socket.remoteAddress ||
      'unknown';

    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetAt) {
      rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      const retryAfterSec = Math.ceil((record.resetAt - now) / 1000);
      res.setHeader('Retry-After', retryAfterSec);
      return res.status(429).json({
        error: 'Too many requests. Please slow down and try again shortly.',
      });
    }

    record.count += 1;
    next();
  };
}

// Clean up stale rate limiter records periodically every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

// Initialize Gemini SDK securely using server-side process.env.GEMINI_API_KEY
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Health endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    geminiConfigured: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// Chatbot & Voice Agent API endpoint
app.post('/api/chat', rateLimiter(30, 60 * 1000), async (req: Request, res: Response) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Valid text message is required' });
    }

    const sanitizedMessage = message.trim().slice(0, 1000);

    const systemInstruction = `You are the official Hindi-speaking Conversational AI & Voice Agent for "ॐ Technologies", founded and led by Ranjeet Yadav from Adarsh Nagar, Shikohabad (Uttar Pradesh, India).
Owner Details:
- Founder: Ranjeet Yadav
- Location / Address: Adarsh Nagar, Shikohabad, Uttar Pradesh, India
- Mobile & WhatsApp: +91 7814863709
- Email: mr.jeet325@gmail.com

Our Core Offerings:
1. Custom Websites: High-speed Next.js / React SaaS portals with 3D canvas visuals & sub-second page speed.
2. Cross-Platform Mobile Apps: Flutter / React Native iOS & Android apps with offline support & push alerts.
3. AI Chatbots: Context-aware Gemini conversational assistants with RAG & WhatsApp integration.
4. AI Voice Agents: Real-time speech recognition & vocal synthesis with audio wave visualizer.

10 Types of Automations We Build:
1. WhatsApp Lead Auto-Responder (Instant 3-sec reply & CRM logging)
2. Smart Email Scraping & CRM Ticket Auto-Creation
3. E-Commerce Order, Inventory & Shiprocket Dispatch Sync
4. Automated Google Calendar & Demo Consultation Booking
5. Google Sheets & Cloud PostgreSQL Real-Time Data Pipeline
6. Social Media AI Cross-Posting (LinkedIn, Twitter, IG)
7. Voice Call Audio Transcription & Customer Sentiment AI
8. Automated Invoice & WhatsApp UPI 1-click Payment Reminders
9. 24/7 DevOps Server Health Monitoring & Auto-Recovery
10. AI Document & Receipt OCR Processing (PDF to ERP in seconds)

CRITICAL LANGUAGE INSTRUCTION:
- Always speak and reply in natural, polite, and fluent Hindi (shuddh yet conversational Hindi / clear Hinglish).
- Speak warmly with polite words like "Namaste", "Ji bilkul", "Aapka swagat hai".
- Keep voice agent responses concise, crystal-clear, and crisp (under 2-3 short spoken sentences) so that audio output sounds clean, fast, and 100% human-like.
- Never respond entirely in English unless the user explicitly forces English.`;

    const chatMessages = [
      ...history
        .filter((h: any) => h && typeof h.text === 'string' && typeof h.sender === 'string')
        .slice(-6)
        .map((h: { sender: string; text: string }) => ({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text.slice(0, 500) }],
        })),
      {
        role: 'user',
        parts: [{ text: sanitizedMessage }],
      },
    ];

    let reply = '';
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: chatMessages,
          config: {
            systemInstruction,
            temperature: 0.7,
            maxOutputTokens: 400,
          },
        });
        reply = response.text || '';
      } catch (geminiErr: any) {
        console.warn('Gemini proxy request note: local fallback active');
      }
    }

    if (!reply) {
      const lower = sanitizedMessage.toLowerCase();
      if (
        lower.includes('ranjeet') ||
        lower.includes('owner') ||
        lower.includes('founder') ||
        lower.includes('address') ||
        lower.includes('shikohabad') ||
        lower.includes('contact') ||
        lower.includes('phone') ||
        lower.includes('number') ||
        lower.includes('email')
      ) {
        reply = `Namaste! ॐ Technologies ke Founder & Creator Ranjeet Yadav ji hain.
📍 Address: Adarsh Nagar, Shikohabad (UP), India.
📞 Phone & WhatsApp: +91 7814863709
📧 Email: mr.jeet325@gmail.com
Aap seedhe WhatsApp par message bhej kar apna project discuss kar sakte hain!`;
      } else if (lower.includes('website') || lower.includes('web')) {
        reply = `Hum modern SaaS websites aur custom web portals banate hain:
⚡ Sub-second load speeds, responsive Next.js & React architecture.
🎨 3D particle canvas visuals, dark obsidian glassmorphism UI.
🔒 Secure database, payment gateways (Razorpay/Stripe), aur SEO optimization.
Bataiye aapko kis tarah ki website banwani hai?`;
      } else if (lower.includes('app') || lower.includes('mobile') || lower.includes('android') || lower.includes('ios')) {
        reply = `Hum cross-platform mobile apps (Android aur iOS) develop karte hain:
📱 60fps smooth native animations.
⚡ Offline storage & cloud sync (Firebase/PostgreSQL).
🔔 Push notifications aur biometric login security.
Play Store aur App Store publishing support ke sath.`;
      } else if (lower.includes('chatbot') || lower.includes('voice') || lower.includes('agent')) {
        reply = `Hamare AI Chatbots & Voice Agents:
🤖 Multi-turn contextual Gemini AI trained on your business data.
🎙️ Real-time speech recognition & vocal synthesis with audio wave visualizer.
💬 WhatsApp, Telegram, aur website me direct integration.
24/7 customer support aur automatic lead capture ke liye ready!`;
      } else if (lower.includes('automation') || lower.includes('workflow') || lower.includes('10')) {
        reply = `Hum 10 tarah ke powerful business automations build karte hain:
1. WhatsApp Lead Auto-Responder (Instant 3-sec reply)
2. Smart Email Scraping & CRM Ticket Creation
3. E-Commerce Order & Inventory Sync
4. Automated Google Calendar & Consultation Scheduler
5. Google Sheets & Cloud PostgreSQL Real-time Data Sync
6. AI Social Media Cross-Posting (LinkedIn, X, IG)
7. Voice Call Audio Transcription & Sentiment AI
8. Auto Invoice & WhatsApp UPI Payment Reminders
9. 24/7 DevOps Server Health & Auto-Recovery
10. AI Document & Receipt OCR Processing (PDF to ERP).
Aap kis automation ko live test karna chahte hain?`;
      } else if (lower.includes('price') || lower.includes('pricing') || lower.includes('cost') || lower.includes('kharcha')) {
        reply = `Humari pricing transparent aur flexible hai:
• Starter Plan: Free trial & sandbox testing ke liye.
• Custom Project: Website, App ya AI automation ke scope ke mutabik customized quotation milti hai.
Direct contact karein Ranjeet Yadav ji se (+91 7814863709) exact quote ke liye!`;
      } else {
        reply = `Namaste! Main ॐ Technologies (Ranjeet Yadav, Adarsh Nagar Shikohabad) ka AI Assistant & Voice Agent hoon.
Main aapko Websites, Mobile Apps, AI Chatbots, Voice Agents aur 10 Automations ke baare me sab kuch bata sakta hoon.
Aap WhatsApp par bhi jud sakte hain: +91 7814863709. Aapko kis service ki zaroorat hai?`;
      }
    }

    res.json({ reply });
  } catch (error: any) {
    console.error('Server error handling chat request');
    res.status(500).json({
      error: 'Unable to process request at this moment. Please try again.',
    });
  }
});

// Voice TTS API endpoint
app.post('/api/tts', rateLimiter(20, 60 * 1000), async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const cleanText = text
      .replace(/[*_#`~>]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 300);

    if (ai) {
      try {
        const ttsResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash-lite-tts',
          contents: cleanText,
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: 'Puck',
                },
              },
            },
          },
        });

        const audioData =
          ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        const mimeType =
          ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType ||
          'audio/wav';

        if (audioData) {
          return res.json({ audio: audioData, mimeType });
        }
      } catch (err: any) {
        console.warn('Server TTS note: client will fall back to browser vocal synthesis');
      }
    }

    res.json({ audio: null });
  } catch (error: any) {
    console.error('Server error generating speech audio');
    res.status(500).json({ error: 'Audio synthesis unavailable' });
  }
});

app.all('/api/*', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${port}`);
  });
}

startServer();

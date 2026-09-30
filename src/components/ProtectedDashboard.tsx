import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  FolderLock,
  Plus,
  Trash2,
  LogOut,
  Sparkles,
  CheckCircle2,
  Layers,
  ArrowLeft,
  Mail,
  ShoppingBag,
  Briefcase,
  FileText,
  Clock,
  Send,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import {
  ClientProject,
  ClientOrder,
  ContactMessage,
  AIServiceItem,
} from '../services/firestoreService';

export const ProtectedDashboard: React.FC = () => {
  const { user, userProfile, logout, setCurrentView } = useAuth();
  const [activeTab, setActiveTab] = useState<'projects' | 'orders' | 'messages' | 'catalog'>('projects');

  // Firestore live states
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [orders, setOrders] = useState<ClientOrder[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [services, setServices] = useState<AIServiceItem[]>([]);

  // Create Project Form
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectCategory, setProjectCategory] = useState<'Website' | 'Mobile App' | 'AI Voice Agent' | 'Automation'>('Automation');
  const [projectBudget, setProjectBudget] = useState('₹10,000 - ₹25,000');
  const [projectDesc, setProjectDesc] = useState('');

  // Contact / Message Form
  const [isAddingMessage, setIsAddingMessage] = useState(false);
  const [msgSubject, setMsgSubject] = useState('');
  const [msgBody, setMsgBody] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // 1. Synchronize Projects for current user
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'projects'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ClientProject)));
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'projects');
      }
    );
    return () => unsubscribe();
  }, [user]);

  // 2. Synchronize Orders for current user
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ClientOrder)));
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'orders');
      }
    );
    return () => unsubscribe();
  }, [user]);

  // 3. Synchronize Contact Messages for current user
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'contact_messages'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ContactMessage)));
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'contact_messages');
      }
    );
    return () => unsubscribe();
  }, [user]);

  // 4. Synchronize Active Services Catalog (public read)
  useEffect(() => {
    const q = query(collection(db, 'services'), where('active', '==', true));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        if (!snap.empty) {
          setServices(snap.docs.map((d) => ({ id: d.id, ...d.data() } as AIServiceItem)));
        } else {
          // Provide default catalog items if none yet written to DB
          setServices([
            {
              id: 's1',
              name: 'Custom React & Vite Website',
              tagline: 'Ultra-fast responsive web portal with full mobile optimization',
              category: 'Website',
              price: 14999,
              deliveryDays: 5,
              features: ['Tailwind CSS', 'Responsive UI', 'SEO Ready', 'Fast Hosting'],
              active: true,
            },
            {
              id: 's2',
              name: 'Cross-Platform Mobile App',
              tagline: 'iOS and Android deployment with native hardware acceleration',
              category: 'Mobile App',
              price: 29999,
              deliveryDays: 10,
              features: ['Push Notifications', 'Camera & GPS', 'Offline Sync', 'App Store Setup'],
              active: true,
            },
            {
              id: 's3',
              name: 'Real-Time Voice Speech Agent',
              tagline: 'Bilingual conversational bot with speech recognition & audio synthesis',
              category: 'AI Voice Agent',
              price: 24999,
              deliveryDays: 7,
              features: ['Hindi & English TTS', 'Speech-to-Text', 'Gemini Reasoning', 'WhatsApp Alert'],
              active: true,
            },
            {
              id: 's4',
              name: '10x Enterprise Business Automation',
              tagline: 'Automated CRM leads, instant WhatsApp bot, and invoice reconciliation',
              category: 'Automation',
              price: 19999,
              deliveryDays: 4,
              features: ['WhatsApp Cloud API', 'Google Sheets Sync', 'Invoice Gen', '24/7 Webhook'],
              active: true,
            },
          ]);
        }
      },
      (err) => {
        console.warn('Services catalog note:', err);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !projectTitle.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'projects'), {
        userId: user.uid,
        title: projectTitle.trim(),
        category: projectCategory,
        status: 'planning',
        budget: projectBudget,
        description: projectDesc.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setProjectTitle('');
      setProjectDesc('');
      setIsAddingProject(false);
      setFeedbackMsg('New project saved to your private Firestore collection!');
      setTimeout(() => setFeedbackMsg(null), 3500);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.CREATE, 'projects');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateOrder = async (service: AIServiceItem) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        serviceId: service.id || 'custom',
        serviceName: service.name,
        amount: service.price,
        currency: 'INR',
        status: 'pending',
        paymentMethod: 'UPI / Direct Consultation',
        createdAt: serverTimestamp(),
      });
      setFeedbackMsg(`Order for "${service.name}" created! Our team will reach out via WhatsApp.`);
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.CREATE, 'orders');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !msgBody.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'contact_messages'), {
        userId: user.uid,
        name: user.displayName || 'Client',
        email: user.email || '',
        subject: msgSubject.trim() || 'Technical Consultation',
        message: msgBody.trim(),
        read: false,
        createdAt: serverTimestamp(),
      });
      setMsgSubject('');
      setMsgBody('');
      setIsAddingMessage(false);
      setFeedbackMsg('Your message was stored in contact_messages for Ranjeet Yadav!');
      setTimeout(() => setFeedbackMsg(null), 3500);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.CREATE, 'contact_messages');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'projects', projectId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `projects/${projectId}`);
    }
  };

  return (
    <div className="w-full rounded-[28px] bg-[#0a0507] border border-[#ff2a3a]/30 shadow-2xl p-4 sm:p-6 lg:p-8 text-white font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <button
            onClick={() => setCurrentView('home')}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition font-medium mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Showcase</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff2a3a] to-red-900 flex items-center justify-center text-white font-bold shadow-[0_0_20px_rgba(255,42,58,0.5)]">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Client Dashboard
              </h2>
              <p className="text-xs text-neutral-400">
                Logged in as <strong className="text-red-400">{user?.displayName || user?.email}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <Shield className="w-3.5 h-3.5" />
            <span>Firestore Protected (Zero-Trust)</span>
          </span>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-red-500/20 text-neutral-300 hover:text-red-400 border border-white/10 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Tabs for Collections */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 border-b border-white/10">
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
            activeTab === 'projects'
              ? 'bg-[#ff2a3a] text-white shadow-md'
              : 'bg-white/[0.04] text-neutral-400 hover:text-white'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>My Projects ({projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
            activeTab === 'orders'
              ? 'bg-[#ff2a3a] text-white shadow-md'
              : 'bg-white/[0.04] text-neutral-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
            activeTab === 'messages'
              ? 'bg-[#ff2a3a] text-white shadow-md'
              : 'bg-white/[0.04] text-neutral-400 hover:text-white'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Contact Messages ({messages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
            activeTab === 'catalog'
              ? 'bg-[#ff2a3a] text-white shadow-md'
              : 'bg-white/[0.04] text-neutral-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Services Catalog</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left Column: Metadata & Security Rules Info */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 rounded-2xl bg-[#14080d] border border-white/10 shadow-lg space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
              <FolderLock className="w-4 h-4 text-red-400" />
              <span>Production Firestore Security</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-neutral-500">Authenticated UID</span>
                <span className="font-mono text-neutral-300 text-[11px] break-all select-all">
                  {user?.uid}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex justify-between items-center">
                <span className="text-neutral-400">User Scope</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Private (Isolated)</span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex justify-between items-center">
                <span className="text-neutral-400">Admin Email</span>
                <span className="font-mono text-red-400 text-[11px]">mr.jeet325@gmail.com</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30 text-[11px] text-neutral-300 leading-relaxed">
              🛡️ <strong>Zero-Trust ABAC:</strong> Rules mathematically enforce that queries without <code>where(&quot;userId&quot;, &quot;==&quot;, auth.uid)</code> are immediately rejected by the database. No cross-tenant reads allowed.
            </div>
          </div>
        </div>

        {/* Right Column: Tab View */}
        <div className="lg:col-span-2 space-y-4">
          {/* TAB 1: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="p-5 rounded-2xl bg-[#14080d] border border-white/10 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#ff2a3a]" />
                    <span>Your Projects (/projects)</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Custom software, websites, AI agents & automations initiated with ॐ Technologies.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingProject(!isAddingProject)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ff2a3a] hover:bg-red-600 text-white text-xs font-bold transition shadow-md cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingProject ? 'Cancel' : 'New Project'}</span>
                </button>
              </div>

              {isAddingProject && (
                <form onSubmit={handleCreateProject} className="mb-6 p-4 rounded-xl bg-black/60 border border-red-500/30 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                      Project Title
                    </label>
                    <input
                      type="text"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="e.g. Shikohabad Retail Automated Billing System"
                      required
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.06] border border-white/10 text-xs text-white placeholder-neutral-500 outline-none focus:border-[#ff2a3a]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                        Category
                      </label>
                      <select
                        value={projectCategory}
                        onChange={(e) => setProjectCategory(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg bg-[#1a0a12] border border-white/10 text-xs text-white outline-none focus:border-[#ff2a3a]"
                      >
                        <option value="Website">Custom Website</option>
                        <option value="Mobile App">Mobile App</option>
                        <option value="AI Voice Agent">AI Voice Agent</option>
                        <option value="Automation">Automation Pipeline</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                        Estimated Budget
                      </label>
                      <input
                        type="text"
                        value={projectBudget}
                        onChange={(e) => setProjectBudget(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.06] border border-white/10 text-xs text-white outline-none focus:border-[#ff2a3a]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                      Technical Requirements
                    </label>
                    <textarea
                      value={projectDesc}
                      onChange={(e) => setProjectDesc(e.target.value)}
                      placeholder="Describe what features you need..."
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.06] border border-white/10 text-xs text-white placeholder-neutral-500 outline-none focus:border-[#ff2a3a]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#ff2a3a] to-red-700 text-white font-bold text-xs hover:brightness-110 transition cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Writing to Firestore...' : 'Create Project Record'}
                  </button>
                </form>
              )}

              {projects.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-neutral-400 text-xs space-y-2">
                  <Briefcase className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p>No project records found in your private collection.</p>
                  <p className="text-[11px] text-neutral-500">Click &quot;New Project&quot; to initiate a verified build.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {projects.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 flex items-center justify-between gap-3 transition"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{p.title}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#ff2a3a]/20 text-red-300 border border-[#ff2a3a]/30">
                            {p.category}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {p.status}
                          </span>
                        </div>
                        {p.description && (
                          <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                            {p.description}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => p.id && handleDeleteProject(p.id)}
                        title="Delete project"
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === 'orders' && (
            <div className="p-5 rounded-2xl bg-[#14080d] border border-white/10 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#ff2a3a]" />
                    <span>Your Orders & Subscriptions (/orders)</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Immutable order records verified with user UID check.
                  </p>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-neutral-400 text-xs space-y-2">
                  <ShoppingBag className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p>No active orders placed yet.</p>
                  <p className="text-[11px] text-neutral-500">
                    Switch to the &quot;Services Catalog&quot; tab to order pre-configured automation packages.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {orders.map((o) => (
                    <div
                      key={o.id}
                      className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{o.serviceName}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {o.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-1">
                          Payment Mode: {o.paymentMethod}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-white">
                          ₹{o.amount.toLocaleString()}
                        </span>
                        <span className="block text-[10px] text-neutral-500">{o.currency}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CONTACT MESSAGES */}
          {activeTab === 'messages' && (
            <div className="p-5 rounded-2xl bg-[#14080d] border border-white/10 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#ff2a3a]" />
                    <span>Inbound Consultation Requests (/contact_messages)</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Direct messages sent to Ranjeet Yadav (Adarsh Nagar, Shikohabad).
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingMessage(!isAddingMessage)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ff2a3a] hover:bg-red-600 text-white text-xs font-bold transition shadow-md cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingMessage ? 'Cancel' : 'Send Message'}</span>
                </button>
              </div>

              {isAddingMessage && (
                <form onSubmit={handleCreateMessage} className="mb-6 p-4 rounded-xl bg-black/60 border border-red-500/30 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={msgSubject}
                      onChange={(e) => setMsgSubject(e.target.value)}
                      placeholder="e.g. Consultation on WhatsApp Bot & Payment Sync"
                      required
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.06] border border-white/10 text-xs text-white placeholder-neutral-500 outline-none focus:border-[#ff2a3a]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                      Your Message
                    </label>
                    <textarea
                      value={msgBody}
                      onChange={(e) => setMsgBody(e.target.value)}
                      placeholder="Detail your requirements or inquiry..."
                      required
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.06] border border-white/10 text-xs text-white placeholder-neutral-500 outline-none focus:border-[#ff2a3a]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#ff2a3a] to-red-700 text-white font-bold text-xs hover:brightness-110 transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Sending to Firestore...' : 'Transmit Message'}</span>
                  </button>
                </form>
              )}

              {messages.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-neutral-400 text-xs space-y-2">
                  <Mail className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p>You have not dispatched any contact messages yet.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{m.subject}</span>
                        <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Submitted</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-300 leading-relaxed bg-black/30 p-2.5 rounded-lg">
                        {m.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SERVICES CATALOG */}
          {activeTab === 'catalog' && (
            <div className="p-5 rounded-2xl bg-[#14080d] border border-white/10 shadow-lg">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#ff2a3a]" />
                  <span>Production Services Catalog (/services)</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Active offerings available for direct booking and project kick-off.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 flex flex-col justify-between transition"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider">
                          {svc.category}
                        </span>
                        <span className="text-xs font-bold text-neutral-400">
                          {svc.deliveryDays} Days SLA
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{svc.name}</h4>
                      <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                        {svc.tagline}
                      </p>

                      <ul className="mt-3 space-y-1 text-[10px] text-neutral-300">
                        {svc.features?.slice(0, 3).map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-neutral-400">Starting at</span>
                        <p className="text-sm font-black text-white">₹{svc.price.toLocaleString()}</p>
                      </div>

                      <button
                        onClick={() => handleCreateOrder(svc)}
                        disabled={isSubmitting}
                        className="px-3 py-1.5 rounded-lg bg-[#ff2a3a] hover:bg-red-600 text-white text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
                      >
                        Order Package
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

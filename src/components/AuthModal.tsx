import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../AuthContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    login,
    signup,
    forgotPassword,
    loginWithGoogleProvider,
    setCurrentView,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleModeSwitch = (mode: 'login' | 'signup' | 'forgot') => {
    resetForm();
    setAuthModalMode(mode);
  };

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Form Validations
    if (!email.trim() || !validateEmail(email.trim())) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }

    if (authModalMode !== 'forgot' && (!password || password.length < 6)) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (authModalMode === 'signup' && password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      if (authModalMode === 'login') {
        await login(email.trim(), password);
        // Automatically redirect to protected dashboard
        setCurrentView('dashboard');
        closeAuthModal();
      } else if (authModalMode === 'signup') {
        await signup(email.trim(), password, displayName.trim() || undefined);
        setCurrentView('dashboard');
        closeAuthModal();
      } else if (authModalMode === 'forgot') {
        await forgotPassword(email.trim());
        setSuccessMsg('Password reset link sent! Please check your inbox.');
      }
    } catch (err: any) {
      let friendlyError = 'Authentication failed. Please try again.';
      const code = err?.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        friendlyError = 'Invalid email or password. Please verify and try again.';
      } else if (code === 'auth/email-already-in-use') {
        friendlyError = 'An account with this email already exists. Try signing in.';
      } else if (code === 'auth/weak-password') {
        friendlyError = 'Password is too weak. Please use at least 6 characters.';
      } else if (code === 'auth/invalid-email') {
        friendlyError = 'Invalid email format.';
      } else if (code === 'auth/too-many-requests') {
        friendlyError = 'Too many attempts. Please try again later or reset password.';
      } else if (err?.message) {
        friendlyError = err.message;
      }
      setErrorMsg(friendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      await loginWithGoogleProvider();
      setCurrentView('dashboard');
      closeAuthModal();
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(err?.message || 'Google Sign-In failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md rounded-3xl bg-[#0e070b] border border-[#ff2a3a]/30 shadow-[0_0_50px_rgba(255,42,58,0.25)] text-white overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glow & Accent Border */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#ff2a3a] to-transparent" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          aria-label="Close Auth Modal"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff2a3a]/15 border border-[#ff2a3a]/30 text-red-400 text-[11px] font-bold mb-3 shadow-[0_0_12px_rgba(255,42,58,0.2)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ॐ Technologies Auth Portal</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              {authModalMode === 'login' && 'Welcome Back'}
              {authModalMode === 'signup' && 'Create Your Account'}
              {authModalMode === 'forgot' && 'Reset Password'}
            </h2>
            <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
              {authModalMode === 'login' && 'Sign in to access your protected client dashboard & private data.'}
              {authModalMode === 'signup' && 'Register for personal workspace, cloud sync & automation projects.'}
              {authModalMode === 'forgot' && 'Enter your registered email to receive a password reset link.'}
            </p>
          </div>

          {/* Mode Switch Tabs */}
          {authModalMode !== 'forgot' && (
            <div className="flex bg-[#190a12] p-1 rounded-2xl border border-white/10 mb-6">
              <button
                type="button"
                onClick={() => handleModeSwitch('login')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                  authModalMode === 'login'
                    ? 'bg-[#ff2a3a] text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleModeSwitch('signup')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                  authModalMode === 'signup'
                    ? 'bg-[#ff2a3a] text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Error & Success Banners */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/50 flex items-start gap-2.5 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 flex items-start gap-2.5 text-xs text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authModalMode === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ranjeet Yadav"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 focus:border-[#ff2a3a] text-xs text-white placeholder-neutral-500 outline-none transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 focus:border-[#ff2a3a] text-xs text-white placeholder-neutral-500 outline-none transition"
                />
              </div>
            </div>

            {authModalMode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    Password
                  </label>
                  {authModalMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => handleModeSwitch('forgot')}
                      className="text-[11px] text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-black/60 border border-white/15 focus:border-[#ff2a3a] text-xs text-white placeholder-neutral-500 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}

            {authModalMode === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 focus:border-[#ff2a3a] text-xs text-white placeholder-neutral-500 outline-none transition"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff283b] to-[#dc0928] hover:from-[#ff3d4f] hover:to-[#eb1434] text-white text-xs font-bold transition shadow-[0_0_20px_rgba(255,40,60,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {authModalMode === 'login' && 'Sign In to Dashboard'}
                    {authModalMode === 'signup' && 'Create Free Account'}
                    {authModalMode === 'forgot' && 'Send Reset Link'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Forgot mode back button */}
          {authModalMode === 'forgot' && (
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => handleModeSwitch('login')}
                className="text-xs text-neutral-400 hover:text-white transition font-medium cursor-pointer"
              >
                ← Back to Sign In
              </button>
            </div>
          )}

          {/* Social Divider */}
          {authModalMode !== 'forgot' && (
            <>
              <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-white/10" />
                <span className="flex-shrink mx-3 text-[11px] text-neutral-500 uppercase font-bold tracking-wider">
                  Or continue with
                </span>
                <div className="flex-grow border-t border-white/10" />
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white text-xs font-bold transition flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </>
          )}

          {/* Privacy Note */}
          <p className="text-[10px] text-center text-neutral-500 mt-5">
            Protected by Firebase Auth Zero-Trust Security. Passwords are never stored on Firestore.
          </p>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import {
  X, Music, Eye, EyeOff, Mail, Lock, User, ChevronRight,
  Check, AlertCircle, Zap, Headphones
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ── Password strength helper ── */
interface StrengthResult {
  score: number;   // 0-4
  label: string;
  color: string;
}

const getPasswordStrength = (pw: string): StrengthResult => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map: StrengthResult[] = [
    { score: 0, label: 'Too short', color: '#ef4444' },
    { score: 1, label: 'Weak', color: '#f97316' },
    { score: 2, label: 'Fair', color: '#eab308' },
    { score: 3, label: 'Good', color: '#22c55e' },
    { score: 4, label: 'Strong', color: '#10b981' },
  ];
  return map[score];
};

/* ── Mini waveform decoration (canvas) ── */
const WaveAnim: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let frame = 0;
    let raf: number;
    const draw = () => {
      const { width: w, height: h } = canvas;
      ctx.clearRect(0, 0, w, h);
      const count = 5;
      for (let i = 0; i < count; i++) {
        const phase = frame * 0.04 + (i * Math.PI * 2) / count;
        const amp = 14 + i * 6;
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, `hsla(${145 + i * 20},70%,55%,${0.25 - i * 0.03})`);
        grad.addColorStop(1, `hsla(${165 + i * 20},80%,60%,0)`);
        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        for (let x = 0; x < w; x++) {
          const y = h / 2 + Math.sin((x / w) * Math.PI * 4 + phase) * amp;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      frame++;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} width={320} height={80} className="w-full opacity-60" />;
};

/* ── Feature pill ── */
const Feature: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center space-x-2 text-sm text-green-200/80">
    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
    <span>{text}</span>
  </div>
);

/* ── Input field ── */
interface InputProps {
  id: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  required?: boolean;
  minLength?: number;
  suffix?: React.ReactNode;
  autoComplete?: string;
}
const AuthInput: React.FC<InputProps> = ({
  id, type, value, onChange, placeholder, icon, required, minLength, suffix, autoComplete
}) => (
  <div className="relative group">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-400 transition-colors pointer-events-none">
      {icon}
    </div>
    <input
      id={id}
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      minLength={minLength}
      autoComplete={autoComplete}
      className="w-full bg-gray-800/60 border border-gray-700 focus:border-green-500 rounded-xl py-3 pl-10 pr-10 text-white placeholder-gray-500 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
    />
    {suffix && (
      <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>
    )}
  </div>
);

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [animating, setAnimating] = useState(false);

  const { signIn, signUp } = useAuth();

  const pwStrength = mode === 'signup' ? getPasswordStrength(password) : null;
  const passwordsMatch = password === confirmPassword;

  /* Reset form when mode changes */
  const switchMode = (next: typeof mode) => {
    setAnimating(true);
    setTimeout(() => {
      setMode(next);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFullName('');
      setShowPassword(false);
      setShowConfirm(false);
      setAgreeTerms(false);
      setAnimating(false);
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (mode === 'forgot') {
      toast.success(`Password reset link sent to ${email}!`);
      switchMode('login');
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        toast.error('Please enter your full name');
        return;
      }
      if ((pwStrength?.score ?? 0) < 2) {
        toast.error('Please choose a stronger password');
        return;
      }
      if (!passwordsMatch) {
        toast.error('Passwords do not match');
        return;
      }
      if (!agreeTerms) {
        toast.error('Please agree to the Terms of Service');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        await signUp(email, password, fullName);
      } else {
        await signIn(email, password);
      }
      onClose();
    } catch (err) {
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  /* Quick-login demo buttons */
  const demoLogin = async (email: string, name: string) => {
    setLoading(true);
    try {
      await signIn(email, 'demo123');
      toast.success(`Signed in as ${name}`);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-3xl bg-gray-900 rounded-3xl overflow-hidden shadow-2xl flex"
        style={{ maxHeight: '90vh' }}>

        {/* ── LEFT PANEL (decorative) ── */}
        <div className="hidden md:flex flex-col justify-between w-[45%] bg-gradient-to-br from-green-700 via-emerald-800 to-gray-900 p-8 relative overflow-hidden">
          {/* Background blobs */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-green-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-10 w-56 h-56 bg-emerald-400/15 rounded-full blur-3xl" />

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-black text-xl tracking-tight">PlayMusic</span>
            </div>

            <h2 className="text-white font-black text-2xl leading-tight mb-2">
              {mode === 'login'
                ? 'Welcome back 👋'
                : mode === 'signup'
                  ? 'Join the beat 🎵'
                  : 'Reset password 🔑'}
            </h2>
            <p className="text-green-200/70 text-sm leading-relaxed mb-6">
              {mode === 'login'
                ? 'Your music, your vibe — pick up right where you left off.'
                : mode === 'signup'
                  ? 'Millions of songs, playlists, studios — for free.'
                  : 'We\'ll send a secure link to your email.'}
            </p>

            <div className="space-y-2">
              <Feature text="18+ Hindi songs with real audio" />
              <Feature text="Create & save unlimited playlists" />
              <Feature text="Movies, Studio & WAV export" />
              <Feature text="No subscription required" />
            </div>
          </div>

          <div className="relative z-10">
            <WaveAnim />
            <div className="flex items-center space-x-2 mt-3">
              <Headphones className="w-4 h-4 text-green-300/60" />
              <span className="text-green-200/50 text-xs">Stream in high quality</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL (form) ── */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-3 flex-shrink-0">
            {/* Mode tabs */}
            <div className="flex space-x-1 bg-gray-800/60 rounded-xl p-1">
              {(['login', 'signup'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => mode !== m && switchMode(m)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === m
                    ? 'bg-green-500 text-white shadow'
                    : 'text-gray-400 hover:text-white'
                    }`}
                >
                  {m === 'login' ? 'Log In' : 'Sign Up'}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form body */}
          <div className={`px-6 pb-6 transition-opacity duration-200 ${animating ? 'opacity-0' : 'opacity-100'}`}>

            {/* ─── FORGOT PASSWORD ─── */}
            {mode === 'forgot' && (
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <AlertCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <p className="text-gray-300 text-sm">Enter your email and we'll send a reset link.</p>
                </div>
                <AuthInput id="frgt-email" type="email" value={email} onChange={setEmail}
                  placeholder="your@email.com" icon={<Mail className="w-4 h-4" />} required
                  autoComplete="email" />
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-400 text-white font-bold text-sm transition-all disabled:opacity-50">
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
                <button type="button" onClick={() => switchMode('login')}
                  className="w-full text-center text-gray-400 text-sm hover:text-white transition-colors">
                  ← Back to Login
                </button>
              </form>
            )}

            {/* ─── LOGIN ─── */}
            {mode === 'login' && (
              <>
                <form onSubmit={handleSubmit} className="space-y-3 mt-4">
                  <AuthInput id="login-email" type="email" value={email} onChange={setEmail}
                    placeholder="Email address" icon={<Mail className="w-4 h-4" />} required
                    autoComplete="email" />

                  <AuthInput id="login-pass" type={showPassword ? 'text' : 'password'}
                    value={password} onChange={setPassword}
                    placeholder="Password" icon={<Lock className="w-4 h-4" />} required
                    autoComplete="current-password"
                    suffix={
                      <button type="button" onClick={() => setShowPassword(s => !s)}
                        className="text-gray-500 hover:text-gray-300 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    } />

                  <div className="flex justify-end">
                    <button type="button" onClick={() => switchMode('forgot')}
                      className="text-xs text-green-400 hover:text-green-300 transition-colors">
                      Forgot password?
                    </button>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-400 active:bg-green-600 text-white font-bold text-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg shadow-green-500/20">
                    {loading
                      ? <span className="flex items-center space-x-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /><span>Signing in…</span></span>
                      : <><span>Log In</span><ChevronRight className="w-4 h-4" /></>}
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-4">
                  <div className="flex-1 h-px bg-gray-800" />
                  <span className="px-3 text-xs text-gray-500">or try demo</span>
                  <div className="flex-1 h-px bg-gray-800" />
                </div>

                {/* Demo accounts */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => demoLogin('demo@PlayMusic.com', 'Demo User')}
                    disabled={loading}
                    className="flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white text-xs py-2.5 rounded-xl transition-all disabled:opacity-50 border border-gray-700"
                  >
                    <Zap className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Demo User</span>
                  </button>
                  <button
                    onClick={() => demoLogin('admin@PlayMusic.com', 'Admin')}
                    disabled={loading}
                    className="flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white text-xs py-2.5 rounded-xl transition-all disabled:opacity-50 border border-gray-700"
                  >
                    <Zap className="w-3.5 h-3.5 text-purple-400" />
                    <span>Demo Admin</span>
                  </button>
                </div>

                {/* Social logins (always visible, simulate) */}
                <div className="flex items-center my-4">
                  <div className="flex-1 h-px bg-gray-800" />
                  <span className="px-3 text-xs text-gray-500">or continue with</span>
                  <div className="flex-1 h-px bg-gray-800" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      label: 'Google', bg: 'bg-white', icon: (
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                      )
                    },
                    {
                      label: 'Facebook', bg: 'bg-[#1877F2]', icon: (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#fff">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      )
                    },
                    {
                      label: 'Apple', bg: 'bg-black border border-gray-700', icon: (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#fff">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                        </svg>
                      )
                    },
                  ].map(({ label, bg, icon }) => (
                    <button
                      key={label}
                      onClick={() => toast('Connect OAuth keys in .env to enable ' + label + ' login', { icon: '🔑' })}
                      className={`${bg} flex items-center justify-center py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all`}
                      title={`Sign in with ${label}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* ─── SIGN UP ─── */}
            {mode === 'signup' && (
              <form onSubmit={handleSubmit} className="space-y-3 mt-4">
                <AuthInput id="su-name" type="text" value={fullName} onChange={setFullName}
                  placeholder="Full name" icon={<User className="w-4 h-4" />} required
                  autoComplete="name" />

                <AuthInput id="su-email" type="email" value={email} onChange={setEmail}
                  placeholder="Email address" icon={<Mail className="w-4 h-4" />} required
                  autoComplete="email" />

                <div className="space-y-1.5">
                  <AuthInput id="su-pass" type={showPassword ? 'text' : 'password'}
                    value={password} onChange={setPassword}
                    placeholder="Create password" icon={<Lock className="w-4 h-4" />}
                    required minLength={6} autoComplete="new-password"
                    suffix={
                      <button type="button" onClick={() => setShowPassword(s => !s)}
                        className="text-gray-500 hover:text-gray-300 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    } />

                  {/* Strength bar */}
                  {password.length > 0 && pwStrength && (
                    <div className="space-y-1">
                      <div className="flex space-x-1">
                        {[0, 1, 2, 3].map(i => (
                          <div
                            key={i}
                            className="h-1 flex-1 rounded-full transition-all duration-300"
                            style={{
                              background: i < pwStrength.score
                                ? pwStrength.color
                                : '#374151'
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-xs" style={{ color: pwStrength.color }}>{pwStrength.label}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <AuthInput id="su-confirm" type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword} onChange={setConfirmPassword}
                    placeholder="Confirm password" icon={<Lock className="w-4 h-4" />}
                    required autoComplete="new-password"
                    suffix={
                      <div className="flex items-center space-x-1">
                        {confirmPassword.length > 0 && (
                          passwordsMatch
                            ? <Check className="w-3.5 h-3.5 text-green-400" />
                            : <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                        )}
                        <button type="button" onClick={() => setShowConfirm(s => !s)}
                          className="text-gray-500 hover:text-gray-300 transition-colors ml-1">
                          {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    } />
                  {confirmPassword.length > 0 && !passwordsMatch && (
                    <p className="text-xs text-red-400">Passwords don't match</p>
                  )}
                </div>

                {/* Terms */}
                <label className="flex items-start space-x-2.5 cursor-pointer group">
                  <div
                    onClick={() => setAgreeTerms(a => !a)}
                    className={`mt-0.5 w-4 h-4 rounded flex-shrink-0 border-2 transition-all flex items-center justify-center ${agreeTerms ? 'bg-green-500 border-green-500' : 'border-gray-600 group-hover:border-gray-400'
                      }`}
                  >
                    {agreeTerms && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                  </div>
                  <span className="text-xs text-gray-400 leading-relaxed">
                    I agree to the{' '}
                    <span className="text-green-400 hover:underline cursor-pointer">Terms of Service</span>
                    {' '}and{' '}
                    <span className="text-green-400 hover:underline cursor-pointer">Privacy Policy</span>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading || !agreeTerms || !passwordsMatch}
                  className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-400 active:bg-green-600 text-white font-bold text-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
                >
                  {loading
                    ? <span className="flex items-center space-x-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /><span>Creating account…</span></span>
                    : <><span>Create Account</span><ChevronRight className="w-4 h-4" /></>}
                </button>
              </form>
            )}

            {/* Footer note */}
            {mode !== 'forgot' && (
              <p className="text-center text-xs text-gray-600 mt-4">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-green-400 hover:text-green-300 font-medium transition-colors"
                >
                  {mode === 'login' ? 'Sign up free' : 'Log in'}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
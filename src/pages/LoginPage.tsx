import { useState } from 'react';
import { Link, useHashRoute } from '@/router';
import { useAuth, roleHome } from '@/auth/AuthContext';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export function LoginPage() {
  const { navigate } = useHashRoute();
  const { login, loading, error, clearError } = useAuth();
  const [role, setRole] = useState<'student' | 'tutor' | 'admin'>('student');
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const roles: { key: 'student' | 'tutor' | 'admin'; label: string; desc: string }[] = [
    { key: 'student', label: 'Student', desc: 'Find and book tutors' },
    { key: 'tutor', label: 'Tutor', desc: 'Teach and earn' },
    { key: 'admin', label: 'Admin', desc: 'Manage platform' },
  ];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password, role);
      navigate(roleHome(role));
    } catch {
      // error is set in context
    }
  };

  const pickRole = (r: typeof role) => {
    setRole(r);
    clearError();
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="relative flex flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold font-display">Skillora</span>
          </Link>
          <div>
            <h2 className="text-4xl font-bold font-display leading-tight">Welcome back to your learning journey</h2>
            <p className="mt-4 text-brand-100 text-lg max-w-md">Sign in to continue booking sessions, messaging tutors, and tracking your progress.</p>
            <div className="mt-8 space-y-3">
              {['12,840 sessions completed this month', '312 verified expert tutors', 'AI-powered tutor matching'].map((t) => (
                <div key={t} className="flex items-center gap-3 text-brand-50">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</div>
                  {t}
                </div>
              ))}
            </div>
          </div>
          <p className="text-brand-200 text-sm">© 2026 Skillora. All rights reserved.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display text-slate-900">Skillora</span>
          </Link>

          <h1 className="text-2xl font-bold text-slate-900">Sign in to your account</h1>
          <p className="mt-1 text-sm text-slate-500">Choose your role and enter your credentials.</p>

          <div className="mt-6 grid grid-cols-3 gap-2">
            {roles.map((r) => (
              <button
                key={r.key}
                onClick={() => pickRole(r.key)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  role === r.key
                    ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <p className="text-sm font-semibold text-slate-900">{r.label}</p>
                <p className="text-xs text-slate-500">{r.desc}</p>
              </button>
            ))}
          </div>

          {/* Demo credentials hint */}
          <div className="mt-4 p-3 rounded-lg bg-brand-50 border border-brand-100 text-xs text-brand-700">
            <p className="font-medium">Demo credentials</p>
            <p className="mt-0.5">Email: <span className="font-mono">{role}@skillora.com</span> · Password: <span className="font-mono">demo1234</span></p>
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={submit} className="mt-4 space-y-4">
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError(); }}
                  className="input pl-10"
                  placeholder="you@email.com"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="label">Password</label>
                <Link to="/forgot-password" className="text-xs text-brand-600 hover:text-brand-700 font-medium">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError(); }}
                  className="input pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" className="rounded border-slate-300 text-brand-600 focus:ring-brand-500" defaultChecked />
              Keep me signed in
            </label>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
              ) : (
                <>Sign in as {roles.find((r) => r.key === role)?.label} <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-600 hover:text-brand-700 font-semibold">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

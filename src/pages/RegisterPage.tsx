import { useState } from 'react';
import { Link, useHashRoute } from '@/router';
import { useAuth, roleHome } from '@/auth/AuthContext';
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, ArrowRight, Check, AlertCircle, Loader2 } from 'lucide-react';

export function RegisterPage() {
  const { navigate } = useHashRoute();
  const { register, loading, error, clearError } = useAuth();
  const [role, setRole] = useState<'student' | 'tutor'>('student');
  const [showPw, setShowPw] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const roles: { key: 'student' | 'tutor'; label: string; desc: string }[] = [
    { key: 'student', label: 'I am a Student', desc: 'Find and book tutors' },
    { key: 'tutor', label: 'I am a Tutor', desc: 'Teach and earn' },
  ];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(name, email, password, role);
      navigate(roleHome(role));
    } catch {
      // error is set in context
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="relative flex flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold font-display">Skillora</span>
          </Link>
          <div>
            <h2 className="text-4xl font-bold font-display leading-tight">Start your learning journey today</h2>
            <p className="mt-4 text-brand-50 text-lg max-w-md">Join 4,800+ students and 312 expert tutors on the world's AI-powered tutoring platform.</p>
            <div className="mt-8 space-y-3">
              {['Free to join — no subscription required', 'Book sessions from $38/hour', 'AI-powered tutor matching included'].map((t) => (
                <div key={t} className="flex items-center gap-3 text-brand-50">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center"><Check className="w-3 h-3" /></div>
                  {t}
                </div>
              ))}
            </div>
          </div>
          <p className="text-brand-200 text-sm">© 2026 Skillora. All rights reserved.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display text-slate-900">Skillora</span>
          </Link>

          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500">Join Skillora in less than a minute.</p>

          <div className="mt-6 grid grid-cols-2 gap-2">
            {roles.map((r) => (
              <button
                key={r.key}
                onClick={() => { setRole(r.key); clearError(); }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  role === r.key ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/20' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <p className="text-sm font-semibold text-slate-900">{r.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{r.desc}</p>
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="label">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  required
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearError(); }}
                  className="input pl-10"
                  placeholder="Your full name"
                />
              </div>
            </div>
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
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError(); }}
                  className="input pl-10 pr-10"
                  placeholder="Create a strong password"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-400">Must be at least 6 characters.</p>
            </div>
            <label className="flex items-start gap-2 text-sm text-slate-600">
              <input type="checkbox" required className="mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
              I agree to Skillora's <span className="text-brand-600 font-medium">Terms</span> and <span className="text-brand-600 font-medium">Privacy Policy</span>
            </label>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
              ) : (
                <>Create {role} account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 hover:text-brand-700 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

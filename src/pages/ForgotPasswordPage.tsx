import { useState } from 'react';
import { Link } from '@/router';
import { GraduationCap, Mail, ArrowRight, ArrowLeft, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen flex">
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
            <h2 className="text-4xl font-bold font-display leading-tight">Reset your password</h2>
            <p className="mt-4 text-brand-100 text-lg max-w-md">Enter your email and we'll send you a link to get back into your account.</p>
          </div>
          <p className="text-brand-200 text-sm">© 2026 Skillora. All rights reserved.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display text-slate-900">Skillora</span>
          </Link>

          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-brand-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Check your email</h1>
              <p className="mt-2 text-sm text-slate-500">
                We've sent a password reset link to <span className="font-medium text-slate-700">{email}</span>.
                Follow the link in the email to reset your password.
              </p>
              <div className="mt-6 space-y-3">
                <Link to="/login" className="btn-primary w-full py-3 justify-center">
                  Back to sign in <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => { setSent(false); setEmail(''); }}
                  className="btn-secondary w-full py-3 justify-center"
                >
                  Use a different email
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to sign in
              </Link>
              <h1 className="text-2xl font-bold text-slate-900">Forgot password?</h1>
              <p className="mt-1 text-sm text-slate-500">No worries — we'll email you a reset link.</p>

              {error && (
                <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={submit} className="mt-6 space-y-4">
                <div>
                  <label className="label">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(null); }}
                      className="input pl-10"
                      placeholder="you@email.com"
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending reset link...</>
                  ) : (
                    <>Send reset link <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Remember your password?{' '}
                <Link to="/login" className="text-brand-600 hover:text-brand-700 font-semibold">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

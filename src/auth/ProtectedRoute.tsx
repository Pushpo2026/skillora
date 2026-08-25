import { useEffect, type ReactNode } from 'react';
import { useHashRoute } from '@/router';
import { useAuth, roleHome } from '@/auth/AuthContext';
import type { Role } from '@/types';
import { GraduationCap } from 'lucide-react';

export function ProtectedRoute({ role, children }: { role: Role; children: ReactNode }) {
  const { user, loading } = useAuth();
  const { navigate } = useHashRoute();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== role) {
      navigate(roleHome(user.role));
    }
  }, [user, loading, role, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center animate-pulse">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <p className="text-sm text-slate-500">Loading Skillora...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== role) {
    return null;
  }

  return <>{children}</>;
}

export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const { navigate } = useHashRoute();

  useEffect(() => {
    if (!loading && user) {
      navigate(roleHome(user.role));
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center animate-pulse">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
      </div>
    );
  }

  if (user) return null;

  return <>{children}</>;
}

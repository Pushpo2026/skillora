import { DashboardShell } from '@/components/Sidebar';
import { PageHeader } from '@/components/ui';
import { useAuth } from '@/auth/AuthContext';
import { subjects } from '@/data/mock';
import { Mail, Phone, MapPin, Calendar, BookOpen, Award, Edit3, Camera } from 'lucide-react';

export function StudentProfile() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <DashboardShell role="student">
      <PageHeader title="My Profile" subtitle="Manage your personal information and preferences." action={<button className="btn-primary"><Edit3 className="w-4 h-4" /> Edit profile</button>} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <div className="relative inline-block">
            <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full mx-auto bg-slate-100" />
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-card">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900">{user.name}</h2>
          <p className="text-sm text-slate-500">Student since Jan 2026</p>
          <div className="mt-4 flex justify-center gap-6 py-4 border-y border-slate-100">
            <div><p className="text-2xl font-bold text-slate-900">23</p><p className="text-xs text-slate-500">Sessions</p></div>
            <div><p className="text-2xl font-bold text-slate-900">4</p><p className="text-xs text-slate-500">Reviews</p></div>
            <div><p className="text-2xl font-bold text-slate-900">3</p><p className="text-xs text-slate-500">Subjects</p></div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Personal information</h3>
            <dl className="grid sm:grid-cols-2 gap-4 text-sm">
              <div><dt className="text-slate-500 flex items-center gap-2 mb-1"><Mail className="w-4 h-4" /> Email</dt><dd className="font-medium text-slate-900">{user.email}</dd></div>
              <div><dt className="text-slate-500 flex items-center gap-2 mb-1"><Phone className="w-4 h-4" /> Phone</dt><dd className="font-medium text-slate-900">+1 (555) 123-4567</dd></div>
              <div><dt className="text-slate-500 flex items-center gap-2 mb-1"><MapPin className="w-4 h-4" /> Location</dt><dd className="font-medium text-slate-900">Boston, USA</dd></div>
              <div><dt className="text-slate-500 flex items-center gap-2 mb-1"><Calendar className="w-4 h-4" /> Birthday</dt><dd className="font-medium text-slate-900">March 15, 2002</dd></div>
            </dl>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Learning interests</h3>
            <div className="flex flex-wrap gap-2">
              {subjects.slice(0, 5).map((s) => (
                <span key={s} className="badge bg-brand-50 text-brand-700">{s}</span>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Account settings</h3>
            <div className="space-y-3">
              {['Email notifications', 'Session reminders', 'Marketing emails', 'Two-factor authentication'].map((s, i) => (
                <div key={s} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <span className="text-sm text-slate-700">{s}</span>
                  <button className={`w-11 h-6 rounded-full transition-colors ${i !== 2 ? 'bg-brand-600' : 'bg-slate-200'} relative`}>
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${i !== 2 ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

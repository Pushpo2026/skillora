import { DashboardShell } from '@/components/Sidebar';
import { PageHeader, Badge, statusBadge } from '@/components/ui';
import { tutorStudents } from '@/data/mock';
import { Mail, BookOpen, Calendar, DollarSign, Search } from 'lucide-react';
import { useState } from 'react';

export function TutorStudents() {
  const [query, setQuery] = useState('');
  const filtered = tutorStudents.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <DashboardShell role="tutor">
      <PageHeader title="My Students" subtitle={`${tutorStudents.length} students have booked sessions with you.`} />

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} className="input pl-9" placeholder="Search students..." />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <div key={s.id} className="card p-5">
            <div className="flex items-center gap-3">
              <img src={s.avatar} alt={s.name} className="w-14 h-14 rounded-full bg-slate-100" />
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 truncate">{s.name}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1"><Mail className="w-3 h-3" /> {s.email}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {s.subjects.map((sub) => <span key={sub} className="badge bg-brand-50 text-brand-700">{sub}</span>)}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
              <div><p className="text-lg font-bold text-slate-900">{s.sessionsCompleted}</p><p className="text-xs text-slate-500">Sessions</p></div>
              <div><p className="text-lg font-bold text-slate-900">${s.totalSpent}</p><p className="text-xs text-slate-500">Spent</p></div>
              <div><Badge color={statusBadge(s.status)}>{s.status}</Badge></div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="btn-secondary flex-1 text-sm">Message</button>
              <button className="btn-primary flex-1 text-sm">Book session</button>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}

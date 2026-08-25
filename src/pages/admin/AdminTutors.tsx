import { useState } from 'react';
import { DashboardShell } from '@/components/Sidebar';
import { PageHeader, Badge } from '@/components/ui';
import { Rating } from '@/components/Rating';
import { tutors } from '@/data/mock';
import { Search, MoreVertical, BadgeCheck, Award, Download } from 'lucide-react';

export function AdminTutors() {
  const [query, setQuery] = useState('');
  const filtered = tutors.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()) || t.subjects.some((s) => s.toLowerCase().includes(query.toLowerCase())));

  return (
    <DashboardShell role="admin">
      <PageHeader title="Manage Tutors" subtitle={`${tutors.length} tutors on the platform.`} action={<button className="btn-secondary"><Download className="w-4 h-4" /> Export</button>} />

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} className="input pl-9" placeholder="Search tutors..." />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-slate-500">
                <th className="px-4 py-3 font-medium">Tutor</th>
                <th className="px-4 py-3 font-medium">Subjects</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Rate</th>
                <th className="px-4 py-3 font-medium">Sessions</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full bg-slate-100" />
                      <div>
                        <p className="font-medium text-slate-900 flex items-center gap-1">{t.name}{t.verified && <BadgeCheck className="w-3.5 h-3.5 text-brand-600" />}</p>
                        <p className="text-xs text-slate-500">{t.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{t.subjects.slice(0, 2).map((s) => <span key={s} className="badge bg-brand-50 text-brand-700">{s}</span>)}{t.subjects.length > 2 && <span className="badge bg-slate-100 text-slate-500">+{t.subjects.length - 2}</span>}</div></td>
                  <td className="px-4 py-3"><Rating value={t.rating} showValue /></td>
                  <td className="px-4 py-3 font-medium text-slate-900">${t.hourlyRate}/hr</td>
                  <td className="px-4 py-3 text-slate-600">{t.totalSessions}</td>
                  <td className="px-4 py-3">{t.topRated ? <Badge color="accent"><Award className="w-3 h-3" /> Top Rated</Badge> : <Badge color="brand">Active</Badge>}</td>
                  <td className="px-4 py-3 text-right"><button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"><MoreVertical className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}

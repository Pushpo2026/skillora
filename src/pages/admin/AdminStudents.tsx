import { useState } from 'react';
import { DashboardShell } from '@/components/Sidebar';
import { PageHeader, Badge, statusBadge } from '@/components/ui';
import { adminStudents } from '@/data/mock';
import { Search, MoreVertical, Users, Download } from 'lucide-react';

export function AdminStudents() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const filtered = adminStudents.filter((s) => {
    const matchQuery = s.name.toLowerCase().includes(query.toLowerCase()) || s.email.toLowerCase().includes(query.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchQuery && matchStatus;
  });

  return (
    <DashboardShell role="admin">
      <PageHeader title="Manage Students" subtitle={`${adminStudents.length} students registered on the platform.`} action={<button className="btn-secondary"><Download className="w-4 h-4" /> Export</button>} />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} className="input pl-9" placeholder="Search by name or email..." />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')} className="input sm:w-48">
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-slate-500">
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Sessions</th>
                <th className="px-4 py-3 font-medium">Total spent</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={s.avatar} alt={s.name} className="w-9 h-9 rounded-full bg-slate-100" />
                      <div><p className="font-medium text-slate-900">{s.name}</p><p className="text-xs text-slate-500">{s.email}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{s.joinedDate}</td>
                  <td className="px-4 py-3 text-slate-600">{s.sessionsCompleted}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">${s.totalSpent}</td>
                  <td className="px-4 py-3"><Badge color={statusBadge(s.status)}>{s.status}</Badge></td>
                  <td className="px-4 py-3 text-right"><button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"><MoreVertical className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-slate-500"><Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />No students found.</div>
        )}
      </div>
    </DashboardShell>
  );
}
